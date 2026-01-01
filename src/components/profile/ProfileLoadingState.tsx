import { Box, Tooltip, IconButton } from '@mui/material';
import { Refresh } from '@mui/icons-material';
import { ProfileSkeleton } from './ProfileSkeleton';

interface ProfileLoadingStateProps {
    isRefreshing: boolean;
}

export function ProfileLoadingState({ isRefreshing }: ProfileLoadingStateProps) {
    return (
        <Box position="relative">
            <ProfileSkeleton />
            {isRefreshing && (
                <Box sx={{
                    position: 'absolute',
                    top: 16,
                    left: 16,
                    zIndex: 1
                }}>
                    <Tooltip title="Refreshing...">
                        <IconButton disabled>
                            <Refresh sx={{ animation: 'spin 1s linear infinite' }} />
                        </IconButton>
                    </Tooltip>
                </Box>
            )}
        </Box>
    );
}