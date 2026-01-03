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
import SmartToyIcon from '@mui/icons-material/SmartToy';

interface AddBotDialogProps {
    open: boolean;
    onClose: () => void;
    difficulty: 'EASY' | 'MEDIUM' | 'HARD';
    onDifficultyChange: (value: 'EASY' | 'MEDIUM' | 'HARD') => void;
    onAddBot: () => void;
    isAdding?: boolean;
}

export const AddBotDialog = ({
                                    open,
                                    onClose,
                                    difficulty,
                                    onDifficultyChange,
                                    onAddBot,
                                    isAdding
                                }: AddBotDialogProps) => {
    return (
        <Dialog
            open={open}
            onClose={isAdding ? undefined : onClose}
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle>Select the difficulty for the AI</DialogTitle>
            <DialogContent>
                <TextField
                    select
                    label="Difficulty"
                    value={difficulty}
                    onChange={(e) => onDifficultyChange(e.target.value as 'EASY' | 'MEDIUM' | 'HARD')}
                    fullWidth
                    sx={{ mt: 1 }}
                    disabled={isAdding}
                >
                    <MenuItem value="EASY">Easy</MenuItem>
                    <MenuItem value="MEDIUM">Medium</MenuItem>
                    <MenuItem value="HARD">Hard</MenuItem>
                </TextField>

                {isAdding && (
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
                                Your bot is being added...
                            </Typography>
                        </Box>
                    </Box>
                )}
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={onClose} disabled={isAdding}>
                    Cancel
                </Button>
                <Button
                    onClick={onAddBot}
                    variant="contained"
                    startIcon={<SmartToyIcon />}
                    disabled={isAdding}
                >
                    {isAdding ? 'Adding bot...' : 'Add bot'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};