import { useState, useMemo } from 'react';
import {
    Box,
    TextField,
    Typography,
    Paper,
    Grid
} from '@mui/material';
import { Group } from '@mui/icons-material';
import type {PublicUserProfile} from '../../model/userProfile';
import { FriendCard } from './FriendCard';

interface FriendsListProps {
    friends: PublicUserProfile[];
}

export function FriendsList({ friends }: FriendsListProps) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredAndSortedFriends = useMemo(() => {
        let result = [...friends];

        if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase();
            result = result.filter(friend => {
                const displayName = friend.profile?.displayName?.toLowerCase() || '';
                const username = friend.username.toLowerCase();
                return displayName.includes(term) || username.includes(term);
            });
        }

        result.sort((a, b) => {
            const nameA = (a.profile?.displayName || a.username).toLowerCase();
            const nameB = (b.profile?.displayName || b.username).toLowerCase();
            return nameA.localeCompare(nameB);
        });

        return result;
    }, [friends, searchTerm]);

    if (friends.length === 0) {
        return (
            <Paper
                sx={{
                    p: 6,
                    textAlign: 'center',
                    bgcolor: 'background.default',
                }}
            >
                <Group sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                    No Friends Yet
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Start connecting with other players! Browse the Users page to find people to add as friends.
                </Typography>
            </Paper>
        );
    }

    return (
        <Box>
            <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                <TextField
                    placeholder="Search friends..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    size="small"
                    sx={{ flexGrow: 1, minWidth: 200 }}
                />
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Showing {filteredAndSortedFriends.length} of {friends.length} friend{friends.length !== 1 ? 's' : ''}
                {searchTerm && ` matching "${searchTerm}"`}
            </Typography>

            <Grid container spacing={3}>
                {filteredAndSortedFriends.map((friend) => (
                    <Grid key={friend.id} size={{ xs: 12, sm: 6, md: 4 }}>
                        <FriendCard user={friend} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}