import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem } from '@mui/material';
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
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Start {gameName || 'Game'}</DialogTitle>
            <DialogContent>
                <TextField
                    select
                    label="Difficulty"
                    value={difficulty}
                    onChange={(e) => onDifficultyChange(e.target.value as 'EASY' | 'MEDIUM' | 'HARD')}
                    fullWidth
                    sx={{ mt: 1 }}
                >
                    <MenuItem value="EASY">Easy</MenuItem>
                    <MenuItem value="MEDIUM">Medium</MenuItem>
                    <MenuItem value="HARD">Hard</MenuItem>
                </TextField>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
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