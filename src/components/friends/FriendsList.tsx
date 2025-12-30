import { useState, useMemo } from 'react';
import {
    Box,
    TextField,
    Typography,
    Paper,
    Grid,
    IconButton,
    Tooltip
} from '@mui/material';
import { Group, Refresh } from '@mui/icons-material';
import type { PublicUserProfile } from '../../model/userProfile';
import { FriendCard } from './FriendCard';

interface FriendsListProps {
    friends: PublicUserProfile[];
    onRemoveFriend?: (userId: string) => void;
    onRefresh?: () => void | Promise<void>;
    isRefreshing?: boolean;
}

export function FriendsList({ friends, onRemoveFriend, onRefresh, isRefreshing = false }: FriendsListProps) {
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

    const handleRefresh = async () => {
        if (onRefresh && !isRefreshing) {
            await onRefresh();
        }
    };

    if (friends.length === 0) {
        return (
            <Paper
                sx={{
                    p: 6,
                    textAlign: 'center',
                    bgcolor: 'background.default',
                    position: 'relative'
                }}
            >
                {onRefresh && (
                    <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
                        <Tooltip title="Refresh friends list">
                            <IconButton
                                onClick={handleRefresh}
                                disabled={isRefreshing}
                                size="small"
                            >
                                <Refresh
                                    sx={{
                                        fontSize: 20,
                                        animation: isRefreshing ? 'spin 1s linear infinite' : 'none'
                                    }}
                                />
                            </IconButton>
                        </Tooltip>
                    </Box>
                )}
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
            <Box sx={{
                display: 'flex',
                gap: 2,
                mb: 3,
                flexWrap: 'wrap',
                alignItems: 'center'
            }}>
                <TextField
                    placeholder="Search friends..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    size="small"
                    sx={{ flexGrow: 1, minWidth: 200 }}
                />

                {onRefresh && (
                    <Tooltip title="Refresh friends list">
                        <IconButton
                            onClick={handleRefresh}
                            disabled={isRefreshing}
                            sx={{
                                bgcolor: 'background.paper',
                                border: '1px solid',
                                borderColor: 'divider',
                                '&:hover': {
                                    bgcolor: 'action.hover'
                                }
                            }}
                        >
                            <Refresh
                                sx={{
                                    animation: isRefreshing ? 'spin 1s linear infinite' : 'none'
                                }}
                            />
                        </IconButton>
                    </Tooltip>
                )}
            </Box>

            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2
            }}>
                <Typography variant="body2" color="text.secondary">
                    Showing {filteredAndSortedFriends.length} of {friends.length} friend{friends.length !== 1 ? 's' : ''}
                    {searchTerm && ` matching "${searchTerm}"`}
                </Typography>

                {isRefreshing && (
                    <Typography variant="caption" color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Refresh sx={{ fontSize: 14, animation: 'spin 1s linear infinite' }} />
                        Refreshing...
                    </Typography>
                )}
            </Box>

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