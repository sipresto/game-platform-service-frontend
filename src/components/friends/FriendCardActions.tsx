import { Box, IconButton, Tooltip } from '@mui/material';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';

interface FriendCardActionsProps {
    userId: string;
    keycloakId: string;
    onRemoveFriend?: (userId: string) => void;
}

export function FriendCardActions({ userId, onRemoveFriend }: FriendCardActionsProps) {
    if (!onRemoveFriend) return null;

    return (
        <Box
            sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                zIndex: 1,
            }}
        >
            <Tooltip title="Remove Friend">
                <IconButton
                    size="small"
                    onClick={(e) => {
                        e.stopPropagation();
                        onRemoveFriend(userId);
                    }}
                    sx={{
                        color: 'text.secondary',
                        backgroundColor: 'background.paper',
                        '&:hover': {
                            color: 'destructive.main',
                            backgroundColor: 'background.elevated',
                        },
                    }}
                >
                    <PersonRemoveIcon fontSize="small"/>
                </IconButton>
            </Tooltip>
        </Box>
    );
}