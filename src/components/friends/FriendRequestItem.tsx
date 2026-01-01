import { Grid, Paper, CircularProgress } from '@mui/material';
import { FriendRequestCard } from './FriendRequestCard';
import { useUserProfileById } from '../../hooks/useUserProfile';
import type {FriendRequest} from "../../model/userProfile.ts";

interface FriendRequestItemProps {
    request: FriendRequest;
}

export function FriendRequestItem({ request }: FriendRequestItemProps) {
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