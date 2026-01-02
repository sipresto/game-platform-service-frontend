import { Card, CardContent, Box, Typography, IconButton, Tooltip } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import { UserAvatar } from '../../users/UserAvatar';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { useProfileImageLoader } from '../../../hooks/useProfileImageLoader';
import { cardStyles, contentStyles } from "../../../utils/friendCardUtils";
import type {BlockedUser} from "../../../model/userProfile.ts";

interface BlockedUserCardProps {
    user: BlockedUser;
    onUnblock?: (userId: string) => void;
}

export function BlockedUserCard({ user, onUnblock }: BlockedUserCardProps) {
    const theme = useTheme();
    const { profileImageUrl, isLoading, hasError } = useProfileImageLoader(user.id);
    const displayName = user.profile?.displayName || user.username;

    const unblockButtonStyles = {
        border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
        backgroundColor: alpha(theme.palette.success.main, 0.04),
        color: theme.palette.text.secondary,
        '&:hover': {
            backgroundColor: alpha(theme.palette.success.main, 0.12),
            color: theme.palette.success.main,
            borderColor: alpha(theme.palette.success.main, 0.4),
        }
    };

    return (
        <Card sx={cardStyles}>
            <CardContent sx={contentStyles(true)}>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 2,
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

                    <Box sx={{
                        flexGrow: 1,
                        minWidth: 0,
                        position: 'relative',
                        pt: 0.5,
                    }}>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            justifyContent: 'space-between',
                            mb: 1,
                        }}>
                            <Typography
                                variant="h6"
                                noWrap
                                fontWeight="600"
                                sx={{
                                    color: theme.palette.text.primary,
                                    fontSize: '1.1rem',
                                    lineHeight: '1.2',
                                    pr: 1,
                                }}
                            >
                                {displayName}
                            </Typography>

                            {onUnblock && (
                                <Tooltip title="Unblock User">
                                    <IconButton
                                        size="small"
                                        onClick={() => onUnblock(user.id)}
                                        sx={unblockButtonStyles}
                                    >
                                        <LockOpenIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            )}
                        </Box>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
}