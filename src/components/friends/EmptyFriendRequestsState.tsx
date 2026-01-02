import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import { PersonAdd, Refresh } from '@mui/icons-material';

interface EmptyFriendRequestsStateProps {
    onRefresh?: () => void | Promise<void>;
    isRefreshing?: boolean;
}

export function EmptyFriendRequestsState({ onRefresh, isRefreshing }: EmptyFriendRequestsStateProps) {
    const handleRefresh = () => {
        if (onRefresh && !isRefreshing) {
            const result = onRefresh();
            if (result instanceof Promise) {
                return result;
            }
        }
    };

    return (
        <Box
            sx={{
                textAlign: 'center',
                position: 'relative'
            }}
        >
            {onRefresh && (
                <Box sx={{ position: 'absolute', right: 16 }}>
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
        </Box>
    );
}