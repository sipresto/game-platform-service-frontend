import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, TextField, FormControlLabel, Switch } from '@mui/material';

interface CreateLobbyDialogProps {
    open: boolean;
    onClose: () => void;
    gameName?: string;
    password: string;
    onPasswordChange: (value: string) => void;
    onCreateLobby: () => void;
    isCreating?: boolean;
}

export const CreateLobbyDialog = ({
                                      open,
                                      onClose,
                                      gameName,
                                      password,
                                      onPasswordChange,
                                      onCreateLobby,
                                      isCreating
                                  }: CreateLobbyDialogProps) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                Create New {gameName || 'Game'} Lobby
            </DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                    <TextField
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => onPasswordChange(e.target.value)}
                        fullWidth
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                    onClick={onCreateLobby}
                    variant="contained"
                    disabled={isCreating}
                >
                    {isCreating ? 'Creating...' : 'Create Lobby'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};