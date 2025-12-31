import { Box, Typography } from '@mui/material';

export function UsersPageHeader() {
    return (
        <Box sx={{ mb: 4, position: 'relative' }}>
            <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
                Users
            </Typography>
            <Typography variant="body1" color="text.secondary">
                Browse all users on the platform. You can see public profiles and users you're connected with.
            </Typography>
        </Box>
    );
}