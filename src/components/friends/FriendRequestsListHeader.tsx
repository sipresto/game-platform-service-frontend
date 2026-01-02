import { Box, Typography, Tooltip, IconButton } from '@mui/material';
import { Refresh } from '@mui/icons-material';

interface FriendRequestsListHeaderProps {
    friendRequestCount: number;
    onRefresh?: () => void | Promise<void>;
    isRefreshing?: boolean;
}

export function FriendRequestsListHeader({
                                             friendRequestCount,
                                             onRefresh,
                                             isRefreshing
                                         }: FriendRequestsListHeaderProps) {
    const handleRefresh = () => {
        if (onRefresh && !isRefreshing) {
            const result = onRefresh();
            if (result instanceof Promise) {
                return result;
            }
        }
    };

    return (
        <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2
        }}>
            <Typography variant="body2" color="text.secondary">
                You have {friendRequestCount} pending friend request{friendRequestCount !== 1 ? 's' : ''}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {isRefreshing && (
                    <Typography variant="caption" color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Refresh sx={{ fontSize: 14, animation: 'spin 1s linear infinite' }} />
                        Refreshing...
                    </Typography>
                )}

                {onRefresh && (
                    <Tooltip title="Refresh friend requests">
                        <IconButton
                            onClick={handleRefresh}
                            disabled={isRefreshing}
                            size="small"
                        >
                            <Refresh
                                sx={{
                                    animation: isRefreshing ? 'spin 1s linear infinite' : 'none'
                                }}
                            />
                        </IconButton>
                    </Tooltip>
                )}
            </Box>
        </Box>
    );
}