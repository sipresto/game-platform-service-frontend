import { Box, CircularProgress } from '@mui/material';

export function FriendsPageLoadingState() {
    return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
            <CircularProgress />
        </Box>
    );
}