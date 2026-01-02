import {Box, Button, CardActions, IconButton, Tooltip} from '@mui/material';
import {useTheme} from '@mui/material/styles';
import {Link as RouterLink} from 'react-router';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';

interface FriendCardActionsProps {
    userId: string;
    keycloakId: string;
    onRemoveFriend?: (userId: string) => void;
}

export function FriendCardActions({ userId, onRemoveFriend }: FriendCardActionsProps) {
    const theme = useTheme();

    return (
        <CardActions
            sx={{
                p: 1.5,
                pt: 0.5,
                gap: 1,
            }}
        >
            <Button
                size="small"
                variant="contained"
                component={RouterLink}
                to={`/profile/${userId}`}
                fullWidth
                sx={{
                    borderRadius: 1,
                    textTransform: 'none',
                    fontWeight: 500,
                    boxShadow: 'none',
                    color: theme.palette.primary.contrastText,
                    '&:hover, &:active, &:visited, &:link': {
                        color: theme.palette.primary.contrastText,
                    }
                }}
            >
                View Profile
            </Button>

            <Box sx={{ display: 'flex', gap: 0.5 }}>
                {onRemoveFriend && (
                    <Tooltip title="Remove Friend">
                        <IconButton
                            size="small"
                            onClick={() => onRemoveFriend(userId)}
                            sx={{
                                color: 'text.primary',
                                '&:hover': {
                                    color: 'destructive.main',
                                }
                            }}
                        >
                            <PersonRemoveIcon fontSize="small"/>
                        </IconButton>
                    </Tooltip>
                )}
            </Box>
        </CardActions>
    );
}