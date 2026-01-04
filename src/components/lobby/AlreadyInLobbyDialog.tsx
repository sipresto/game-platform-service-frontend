import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';

interface AlreadyInLobbyDialogProps {
    open: boolean;
    onClose: () => void;
    onLeaveCurrent: () => void;
    onReturnToLibrary: () => void;
    currentGameName?: string;
    isLeaving?: boolean;
}

export const AlreadyInLobbyDialog = ({
                                         open,
                                         onClose,
                                         onLeaveCurrent,
                                         onReturnToLibrary,
                                         currentGameName,
                                         isLeaving
                                     }: AlreadyInLobbyDialogProps) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <WarningIcon color="warning"/>
                    Already in a Lobby
                </Box>
            </DialogTitle>
            <DialogContent>
                <Typography variant="body1">
                    You're currently in a lobby for <strong>{currentGameName || 'another game'}</strong>.
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    You can only be in one lobby at a time. Would you like to leave your current lobby?
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onReturnToLibrary} disabled={isLeaving} sx={{ color: 'text.primary' }}>
                    Return to Library
                </Button>
                <Button
                    onClick={onLeaveCurrent}
                    variant="contained"
                    color="error"
                    disabled={isLeaving}
                >
                    {isLeaving ? 'Leaving...' : 'Leave Current Lobby'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};