import { Box, Typography, Paper, Tooltip, IconButton } from '@mui/material';
import { Group, Refresh } from '@mui/icons-material';

interface EmptyFriendsStateProps {
    onRefresh?: () => void | Promise<void>;
    isRefreshing?: boolean;
}

export function EmptyFriendsState({ onRefresh, isRefreshing }: EmptyFriendsStateProps) {
    const handleRefresh = () => {
        if (onRefresh && !isRefreshing) {
            const result = onRefresh();
            if (result instanceof Promise) {
                return result;
            }
        }
    };

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