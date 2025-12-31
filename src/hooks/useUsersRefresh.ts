import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export function useUsersRefresh() {
    const queryClient = useQueryClient();
    const [isRefreshing, setIsRefreshing] = useState(false);

    const refreshUsers = async () => {
        try {
            setIsRefreshing(true);
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ['publicUsers'] }),
                queryClient.invalidateQueries({ queryKey: ['friends'] })
            ]);
        } finally {
            setIsRefreshing(false);
        }
    };

    return {
        isRefreshing,
        refreshUsers
    };
}