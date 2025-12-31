import { Box, CircularProgress, Typography } from '@mui/material';

interface UsersPageLoadingStateProps {
    isRefreshing?: boolean;
}

export function UsersPageLoadingState({ isRefreshing = false }: UsersPageLoadingStateProps) {
    return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh" position="relative">
            {!isRefreshing && <CircularProgress />}
            {isRefreshing && (
                <Box sx={{ textAlign: 'center' }}>
                    <CircularProgress />
                    <Typography variant="caption" color="primary" sx={{ display: 'block', mt: 1 }}>
                        Refreshing users...
                    </Typography>
                </Box>
            )}
        </Box>
    );
}