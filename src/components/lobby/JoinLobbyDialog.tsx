import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';

interface JoinLobbyDialogProps {
    open: boolean;
    onClose: () => void;
    password: string;
    onPasswordChange: (value: string) => void;
    onJoinLobby: () => void;
    isJoining?: boolean;
}

export const JoinLobbyDialog = ({
                                    open,
                                    onClose,
                                    password,
                                    onPasswordChange,
                                    onJoinLobby,
                                    isJoining
                                }: JoinLobbyDialogProps) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Join Private Lobby</DialogTitle>
            <DialogContent>
                <TextField
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => onPasswordChange(e.target.value)}
                    fullWidth
                    autoFocus
                    sx={{ mt: 1 }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                    onClick={onJoinLobby}
                    variant="contained"
                    disabled={isJoining || !password}
                >
                    {isJoining ? 'Joining...' : 'Join'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};