import { useState } from 'react';
import { Box, Grid } from '@mui/material';
import type { BlockedUser } from '../../../model/userProfile';
import { BlockedUserCard } from './BlockedUserCard';
import { filterAndSortBlockedUsers } from '../../../utils/userUtils';
import { EmptyBlockedUsersState } from './EmptyBlockedUsersState';
import { BlockedUsersSearchHeader } from './BlockedUsersSearchHeader';

interface BlockedUsersListProps {
    blockedUsers: BlockedUser[];
    onUnblock?: (userId: string) => void;
    onRefresh?: () => void | Promise<void>;
    isRefreshing?: boolean;
}

export function BlockedUsersList({
                                     blockedUsers,
                                     onUnblock,
                                     onRefresh,
                                     isRefreshing = false
                                 }: BlockedUsersListProps) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredAndSortedUsers = filterAndSortBlockedUsers(blockedUsers, searchTerm);

    if (blockedUsers.length === 0) {
        return (
            <EmptyBlockedUsersState
                onRefresh={onRefresh}
                isRefreshing={isRefreshing}
            />
        );
    }

    return (
        <Box>
            <BlockedUsersSearchHeader
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onRefresh={onRefresh}
                isRefreshing={isRefreshing}
                filteredCount={filteredAndSortedUsers.length}
                totalCount={blockedUsers.length}
            />

            <Grid container spacing={3}>
                {filteredAndSortedUsers.map((user) => (
                    <Grid key={user.id} size={{ xs: 12, sm: 6, md: 4 }}>
                        <BlockedUserCard user={user} onUnblock={onUnblock} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}