import { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    CircularProgress,
    Grid,
    IconButton,
    Tooltip
} from '@mui/material';
import { PersonAdd, Refresh } from '@mui/icons-material';
import { FriendRequestCard } from './FriendRequestCard';
import { useUserProfileById } from '../../hooks/useUserProfile';

interface FriendRequest {
    senderId: string;
    createdAt: string;
}

interface FriendRequestsListProps {
    friendRequests: FriendRequest[];
    onRefresh?: () => void | Promise<void>;
    isRefreshing?: boolean;
}

function FriendRequestItem({ request }: { request: FriendRequest }) {
    const { data: user, isLoading, error } = useUserProfileById(request.senderId);

    if (isLoading) {
        return (
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Paper sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
                    <CircularProgress size={24} />
                </Paper>
            </Grid>
        );
    }

    if (error || !user) {
        return null;
    }

    return (
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <FriendRequestCard user={user} createdAt={request.createdAt} />
        </Grid>
    );
}

export function FriendRequestsList({
                                       friendRequests,
                                       onRefresh,
                                       isRefreshing = false
                                   }: FriendRequestsListProps) {
    const [sortedRequests, setSortedRequests] = useState<FriendRequest[]>([]);

    useEffect(() => {
        const sorted = [...friendRequests].sort((a, b) => {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        setSortedRequests(sorted);
    }, [friendRequests]);

    const handleRefresh = async () => {
        if (onRefresh && !isRefreshing) {
            await onRefresh();
        }
    };

    if (friendRequests.length === 0) {
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
                        <Tooltip title="Refresh friend requests">
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
                <PersonAdd sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                    No Pending Friend Requests
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    When someone sends you a friend request, it will appear here.
                </Typography>
            </Paper>
        );
    }

    return (
        <Box>
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2
            }}>
                <Typography variant="body2" color="text.secondary">
                    You have {friendRequests.length} pending friend request{friendRequests.length !== 1 ? 's' : ''}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {isRefreshing && (
                        <Typography variant="caption" color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Refresh sx={{ fontSize: 14, animation: 'spin 1s linear infinite' }} />
                            Refreshing...
                        </Typography>
                    )}

                    {onRefresh && (
                        <Tooltip title="Refresh friend requests">
                            <IconButton
                                onClick={handleRefresh}
                                disabled={isRefreshing}
                                size="small"
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
            </Box>

            <Grid container spacing={3}>
                {sortedRequests.map((request) => (
                    <FriendRequestItem key={request.senderId} request={request} />
                ))}
            </Grid>
        </Box>
    );
}