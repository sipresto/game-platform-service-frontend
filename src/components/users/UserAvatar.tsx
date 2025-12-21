import { Avatar, Box, CircularProgress } from '@mui/material';
import { getInitials } from '../../utils/userUtils.ts';

interface UserAvatarProps {
    userId: string;
    displayName: string;
    profileImageUrl: string | null;
    isLoading: boolean;
    hasError: boolean;
    size?: number;
}

export const UserAvatar = ({
                               displayName,
                               profileImageUrl,
                               isLoading,
                               hasError,
                               size = 56
                           }: UserAvatarProps) => {
    const userInitials = getInitials(displayName);

    return (
        <Box sx={{ position: 'relative', mr: 2 }}>
            <Avatar
                src={!hasError && !isLoading ? profileImageUrl || undefined : undefined}
                sx={{
                    width: size,
                    height: size,
                    bgcolor: 'primary.main',
                    fontSize: Math.floor(size * 0.36)
                }}
                alt={`${displayName}'s profile picture`}
            >
                {userInitials}
            </Avatar>

            {isLoading && (
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: 'rgba(255, 255, 255, 0.7)',
                        borderRadius: '50%',
                    }}
                >
                    <CircularProgress size={Math.floor(size * 0.36)} />
                </Box>
            )}
        </Box>
    );
};