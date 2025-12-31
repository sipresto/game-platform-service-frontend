import { Box, Typography, Paper, Tooltip, IconButton } from '@mui/material';
import { Block, Refresh } from '@mui/icons-material';

interface EmptyBlockedUsersStateProps {
    onRefresh?: () => void | Promise<void>;
    isRefreshing?: boolean;
}

export function EmptyBlockedUsersState({ onRefresh, isRefreshing }: EmptyBlockedUsersStateProps) {
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
                    <Tooltip title="Refresh blocked users">
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
            <Block sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
                No Blocked Users
            </Typography>
            <Typography variant="body2" color="text.secondary">
                You haven't blocked anyone yet.
            </Typography>
        </Paper>
    );
}