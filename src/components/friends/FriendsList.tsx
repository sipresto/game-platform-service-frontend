import { useState } from 'react';
import { Box, Grid } from '@mui/material';
import type { PublicUserProfile } from '../../model/userProfile';
import { FriendCard } from './FriendCard';
import { filterAndSortFriends } from '../../utils/friendsUtils';
import { EmptyFriendsState } from './EmptyFriendsState';
import { FriendsSearchHeader } from './FriendsSearchHeader';

interface FriendsListProps {
    friends: PublicUserProfile[];
    onRemoveFriend?: (userId: string) => void;
    onRefresh?: () => void | Promise<void>;
    isRefreshing?: boolean;
}

export function FriendsList({
                                friends,
                                onRemoveFriend,
                                onRefresh,
                                isRefreshing = false
                            }: FriendsListProps) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredAndSortedFriends = filterAndSortFriends(friends, searchTerm);

    if (friends.length === 0) {
        return (
            <EmptyFriendsState
                onRefresh={onRefresh}
                isRefreshing={isRefreshing}
            />
        );
    }

    return (
        <Box>
            <FriendsSearchHeader
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onRefresh={onRefresh}
                isRefreshing={isRefreshing}
                filteredCount={filteredAndSortedFriends.length}
                totalCount={friends.length}
            />

            <Grid container spacing={3}>
                {filteredAndSortedFriends.map((friend) => (
                    <Grid key={friend.id} size={{ xs: 12, sm: 6, md: 4 }}>
                        <FriendCard
                            user={friend}
                            onRemoveFriend={onRemoveFriend}
                        />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}