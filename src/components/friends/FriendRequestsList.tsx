import { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    CircularProgress, Grid
} from '@mui/material';
import { PersonAdd } from '@mui/icons-material';
import { FriendRequestCard } from './FriendRequestCard';
import { useUserProfileById } from '../../hooks/useUserProfile';

interface FriendRequest {
    senderId: string;
    createdAt: string;
}

interface FriendRequestsListProps {
    friendRequests: FriendRequest[];
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

export function FriendRequestsList({ friendRequests }: FriendRequestsListProps) {
    const [sortedRequests, setSortedRequests] = useState<FriendRequest[]>([]);

    useEffect(() => {
        const sorted = [...friendRequests].sort((a, b) => {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        setSortedRequests(sorted);
    }, [friendRequests]);

    if (friendRequests.length === 0) {
        return (
            <Paper
                sx={{
                    p: 6,
                    textAlign: 'center',
                    bgcolor: 'background.default',
                }}
            >
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
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                You have {friendRequests.length} pending friend request{friendRequests.length !== 1 ? 's' : ''}
            </Typography>

            <Grid container spacing={3}>
                {sortedRequests.map((request) => (
                    <FriendRequestItem key={request.senderId} request={request} />
                ))}
            </Grid>
        </Box>
    );
}