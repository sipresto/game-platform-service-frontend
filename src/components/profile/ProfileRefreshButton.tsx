import { Box, Tooltip, IconButton, Typography } from '@mui/material';
import { Refresh } from '@mui/icons-material';

interface ProfileRefreshButtonProps {
    onRefresh: () => void;
    isRefreshing: boolean;
    showRefreshingText?: boolean;
    position?: 'absolute' | 'relative';
}

export function ProfileRefreshButton({
                                         onRefresh,
                                         isRefreshing,
                                         showRefreshingText = false,
                                         position = 'absolute'
                                     }: ProfileRefreshButtonProps) {
    return (
        <Box sx={{
            position,
            top: 16,
            left: 16,
            zIndex: 1
        }}>
            <Tooltip title="Refresh profile data">
                <IconButton
                    onClick={onRefresh}
                    disabled={isRefreshing}
                    sx={{
                        bgcolor: 'background.paper',
                        border: '1px solid',
                        borderColor: 'divider',
                        boxShadow: 1,
                        '&:hover': {
                            bgcolor: 'background.paper'
                        }
                    }}
                >
                    <Refresh
                        sx={{
                            animation: isRefreshing ? 'spin 1s linear infinite' : 'none'
                        }}
                    />
                </IconButton>
            </Tooltip>

            {showRefreshingText && isRefreshing && (
                <Box sx={{
                    position: 'absolute',
                    top: 60,
                    left: 16,
                    zIndex: 1
                }}>
                    <Typography variant="caption" color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Refresh sx={{ fontSize: 12, animation: 'spin 1s linear infinite' }} />
                        Refreshing...
                    </Typography>
                </Box>
            )}
        </Box>
    );
}