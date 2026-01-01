import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

interface UseProfileRefreshProps {
    userId: string;
    isOwnProfile: boolean;
    refetchUserProfile?: () => Promise<unknown>;
}

interface RefreshResult {
    isRefreshing: boolean;
    refreshProfile: () => Promise<void>;
}

export function useProfileRefresh({
                                      userId,
                                      isOwnProfile,
                                      refetchUserProfile
                                  }: UseProfileRefreshProps): RefreshResult {
    const queryClient = useQueryClient();
    const [isRefreshing, setIsRefreshing] = useState(false);

    const refreshProfile = async () => {
        if (isRefreshing) return;

        try {
            setIsRefreshing(true);

            const promises = [];

            promises.push(
                queryClient.invalidateQueries({ queryKey: ['userProfileById', userId] }),
                queryClient.invalidateQueries({ queryKey: ['achievements', userId] })
            );

            if (isOwnProfile) {
                promises.push(
                    queryClient.invalidateQueries({ queryKey: ['userProfile'] }),
                    queryClient.invalidateQueries({ queryKey: ['myOwnedGames'] })
                );
            }

            await Promise.all(promises);

            if (refetchUserProfile) {
                await refetchUserProfile();
            }
        } finally {
            setIsRefreshing(false);
        }
    };

    return {
        isRefreshing,
        refreshProfile
    };
}