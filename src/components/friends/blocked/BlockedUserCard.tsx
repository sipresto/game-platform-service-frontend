import { Card, CardContent, CardActions, Box, Typography, Button, IconButton, Tooltip } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router';
import BlockIcon from '@mui/icons-material/Block';
import { UserAvatar } from '../../users/UserAvatar';
import { useProfileImageLoader } from '../../../hooks/useProfileImageLoader';
import type { BlockedUser } from '../../../model/userProfile';
import { cardStyles, contentStyles } from "../../../utils/friendCardUtils";

interface BlockedUserCardProps {
    user: BlockedUser;
    onUnblock?: (userId: string) => void;
}

export function BlockedUserCard({ user, onUnblock }: BlockedUserCardProps) {
    const theme = useTheme();
    const { profileImageUrl, isLoading, hasError } = useProfileImageLoader(user.id);
    const displayName = user.profile?.displayName || user.username;

    const viewProfileLinkStyles = {
        borderRadius: 1,
        textTransform: 'none',
        fontWeight: 500,
        boxShadow: 'none',
        color: theme.palette.primary.contrastText,
        '&:hover': {
            boxShadow: `0 2px 6px ${alpha(theme.palette.primary.main, 0.2)}`,
            backgroundColor: theme.palette.primary.dark,
        },
        textDecoration: 'none',
        '&:hover, &:active, &:visited, &:link': {
            color: theme.palette.primary.contrastText,
        }
    };

    const unblockButtonStyles = {
        border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
        backgroundColor: alpha(theme.palette.success.main, 0.04),
        color: theme.palette.text.secondary,
        '&:hover': {
            backgroundColor: alpha(theme.palette.success.main, 0.12),
            color: theme.palette.success.main,
        }
    };

    const cardActionsStyles = {
        p: 1.5,
        pt: 0.5,
        gap: 1,
        borderTop: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
        backgroundColor: alpha(theme.palette.background.default, 0.6),
    };

    return (
        <Card sx={cardStyles(theme)}>
            <CardContent sx={contentStyles(true)}>
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
                </Box>
            </CardContent>

            <CardActions sx={cardActionsStyles}>
                <Button
                    size="small"
                    variant="contained"
                    component={RouterLink}
                    to={`/profile/${user.id}`}
                    fullWidth
                    sx={viewProfileLinkStyles}
                >
                    View Profile
                </Button>

                {onUnblock && (
                    <Tooltip title="Unblock User">
                        <IconButton
                            size="small"
                            onClick={() => onUnblock(user.id)}
                            sx={unblockButtonStyles}
                        >
                            <BlockIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                )}
            </CardActions>
        </Card>
    );
}