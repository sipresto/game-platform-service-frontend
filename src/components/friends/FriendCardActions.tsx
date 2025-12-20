import { CardActions, Button, Box, IconButton, Tooltip } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import MessageIcon from '@mui/icons-material/Message';

interface FriendCardActionsProps {
    userId: string;
    keycloakId: string;
    onRemoveFriend?: (userId: string) => void;
    onMessage?: (userId: string) => void;
}

export function FriendCardActions({
                                      userId,
                                      keycloakId,
                                      onRemoveFriend,
                                      onMessage
                                  }: FriendCardActionsProps) {
    const theme = useTheme();

    return (
        <CardActions
            sx={{
                p: 1.5,
                pt: 0.5,
                gap: 1,
                borderTop: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                backgroundColor: alpha(theme.palette.background.default, 0.6),
            }}
        >
            <Button
                size="small"
                variant="contained"
                component={RouterLink}
                to={`/profile/${keycloakId}`}
                fullWidth
                sx={{
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
                }}
            >
                View Profile
            </Button>

            <Box sx={{ display: 'flex', gap: 0.5 }}>
                {onMessage && (
                    <Tooltip title="Message">
                        <IconButton
                            size="small"
                            onClick={() => onMessage(userId)}
                            sx={{
                                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                                backgroundColor: alpha(theme.palette.primary.main, 0.04),
                                color: theme.palette.text.secondary,
                                '&:hover': {
                                    backgroundColor: alpha(theme.palette.primary.main, 0.12),
                                    color: theme.palette.primary.main,
                                }
                            }}
                        >
                            <MessageIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                )}

                {onRemoveFriend && (
                    <Tooltip title="Remove Friend">
                        <IconButton
                            size="small"
                            onClick={() => onRemoveFriend(userId)}
                            sx={{
                                border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
                                backgroundColor: alpha(theme.palette.error.main, 0.04),
                                color: theme.palette.text.secondary,
                                '&:hover': {
                                    backgroundColor: alpha(theme.palette.error.main, 0.12),
                                    color: theme.palette.error.main,
                                }
                            }}
                        >
                            <PersonRemoveIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                )}
            </Box>
        </CardActions>
    );
}