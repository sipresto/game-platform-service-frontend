import { Box, Typography, Chip } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import StarIcon from '@mui/icons-material/Star';
import { UserAvatar } from '../users/UserAvatar';
import type { PublicUserProfile } from '../../model/userProfile';

interface FriendCardHeaderProps {
    user: PublicUserProfile;
    profileImageUrl: string | null | undefined;
    isLoading: boolean;
    hasError: boolean;
    displayName: string;
}

export function FriendCardHeader({
                                     user,
                                     profileImageUrl,
                                     isLoading,
                                     hasError,
                                     displayName
                                 }: FriendCardHeaderProps) {
    const theme = useTheme();

    return (
        <Box sx={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 2,
            mb: 2,
        }}>
            <Box>
                <UserAvatar
                    userId={user.id}
                    displayName={displayName}
                    profileImageUrl={profileImageUrl ?? null}
                    isLoading={isLoading}
                    hasError={hasError}
                    size={60}
                />
            </Box>

            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                <Box sx={{ mb: 1 }}>
                    <Typography
                        variant="h6"
                        noWrap
                        fontWeight="600"
                        sx={{
                            color: theme.palette.text.primary,
                            fontSize: '1.1rem',
                        }}
                        align="left"
                    >
                        {displayName}
                    </Typography>
                </Box>

                {user.points !== undefined && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip
                            icon={<StarIcon />}
                            label={`${user.points} points`}
                            size="small"
                            variant="outlined"
                            sx={{
                                height: 22,
                                fontSize: '0.65rem',
                                borderColor: alpha(theme.palette.primary.main, 0.2),
                                color: theme.palette.text.secondary,
                                '& .MuiChip-icon': {
                                    fontSize: 12,
                                    marginLeft: 0.5,
                                }
                            }}
                        />
                    </Box>
                )}
            </Box>
        </Box>
    );
}