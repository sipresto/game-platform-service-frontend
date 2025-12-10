import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    MenuItem,
    Box,
    Typography,
    CircularProgress
} from '@mui/material';
import { PlayArrow as PlayIcon } from '@mui/icons-material';

interface StartGameDialogProps {
    open: boolean;
    onClose: () => void;
    gameName?: string;
    difficulty: 'EASY' | 'MEDIUM' | 'HARD';
    onDifficultyChange: (value: 'EASY' | 'MEDIUM' | 'HARD') => void;
    onStartGame: () => void;
    isStarting?: boolean;
}

export const StartGameDialog = ({
                                    open,
                                    onClose,
                                    gameName,
                                    difficulty,
                                    onDifficultyChange,
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
                <TextField
                    select
                    label="Difficulty"
                    value={difficulty}
                    onChange={(e) => onDifficultyChange(e.target.value as 'EASY' | 'MEDIUM' | 'HARD')}
                    fullWidth
                    sx={{ mt: 1 }}
                    disabled={isStarting}
                >
                    <MenuItem value="EASY">Easy</MenuItem>
                    <MenuItem value="MEDIUM">Medium</MenuItem>
                    <MenuItem value="HARD">Hard</MenuItem>
                </TextField>

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