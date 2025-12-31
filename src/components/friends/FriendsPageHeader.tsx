import { Box, Typography } from '@mui/material';

export function FriendsPageHeader() {
    return (
        <Box sx={{ mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
                Friends
            </Typography>
            <Typography variant="body1" color="text.secondary">
                Manage your friends, friend requests, and blocked users
            </Typography>
        </Box>
    );
}