import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

interface UseFriendsRefreshProps {
    refetchProfile: () => Promise<unknown>;
    refetchBlockedUsers: () => Promise<unknown>;
}

export function useFriendsRefresh({
                                      refetchProfile,
                                      refetchBlockedUsers
                                  }: UseFriendsRefreshProps) {
    const queryClient = useQueryClient();
    const [isFriendsRefreshing, setIsFriendsRefreshing] = useState(false);
    const [isRequestsRefreshing, setIsRequestsRefreshing] = useState(false);
    const [isBlockedRefreshing, setIsBlockedRefreshing] = useState(false);

    const handleRefreshFriends = async () => {
        try {
            setIsFriendsRefreshing(true);
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ['friends'] }),
                queryClient.invalidateQueries({ queryKey: ['publicUsers'] }),
                refetchProfile()
            ]);
        } finally {
            setIsFriendsRefreshing(false);
        }
    };

    const handleRefreshFriendRequests = async () => {
        try {
            setIsRequestsRefreshing(true);
            await refetchProfile();
        } finally {
            setIsRequestsRefreshing(false);
        }
    };

    const handleRefreshBlockedUsers = async () => {
        try {
            setIsBlockedRefreshing(true);
            await refetchBlockedUsers();
        } finally {
            setIsBlockedRefreshing(false);
        }
    };

    return {
        isFriendsRefreshing,
        isRequestsRefreshing,
        isBlockedRefreshing,
        handleRefreshFriends,
        handleRefreshFriendRequests,
        handleRefreshBlockedUsers
    };
}