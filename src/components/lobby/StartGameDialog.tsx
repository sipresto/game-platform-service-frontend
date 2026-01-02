import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Typography,
    CircularProgress
} from '@mui/material';
import { PlayArrow as PlayIcon } from '@mui/icons-material';

interface StartGameDialogProps {
    open: boolean;
    onClose: () => void;
    gameName?: string;
    onStartGame: () => void;
    isStarting?: boolean;
}

export const StartGameDialog = ({
                                    open,
                                    onClose,
                                    gameName,
                                    onStartGame,
                                    isStarting
                                }: StartGameDialogProps) => {
    return (
        <Dialog
            open={open}
            onClose={isStarting ? undefined : onClose}
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle>Start {gameName || 'Game'}</DialogTitle>
            <DialogContent>
                {isStarting && (
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mt: 3,
                        p: 2,
                        bgcolor: 'info.light',
                        borderRadius: 1
                    }}>
                        <CircularProgress size={20} sx={{ mr: 2 }} />
                        <Box>
                            <Typography variant="body2" color="info.contrastText">
                                Starting game and redirecting all players...
                            </Typography>
                            <Typography
                                variant="caption"
                                color="info.contrastText"
                                sx={{ display: 'block', mt: 0.5 }}
                            >
                                Other players will be automatically redirected within seconds.
                            </Typography>
                        </Box>
                    </Box>
                )}
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={onClose} disabled={isStarting}>
                    Cancel
                </Button>
                <Button
                    onClick={onStartGame}
                    variant="contained"
                    startIcon={<PlayIcon />}
                    disabled={isStarting}
                >
                    {isStarting ? 'Starting...' : 'Start Game'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};