import { Grid, Typography } from '@mui/material';
import { UserCard } from './UserCard';
import type { UserProfile } from '../../model/userProfile';

interface UsersGridProps {
    users: UserProfile[];
}

export function UsersGrid({ users }: UsersGridProps) {
    if (users.length === 0) {
        return (
            <Typography
                align="center"
                color="text.secondary"
                sx={{ py: 8 }}
            >
                No users found. Try adjusting your search.
            </Typography>
        );
    }

    return (
        <Grid container spacing={3}>
            {users.map((user) => (
                <Grid key={user.id} size={{xs: 12, sm: 6, md: 4, lg: 3}}>
                    <UserCard user={user} />
                </Grid>
            ))}
        </Grid>
    );
}