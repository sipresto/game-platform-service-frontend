import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, TextField, FormControlLabel, Switch } from '@mui/material';

interface CreateLobbyDialogProps {
    open: boolean;
    onClose: () => void;
    gameName?: string;
    maxPlayers: number;
    isPrivate: boolean;
    password: string;
    onMaxPlayersChange: (value: number) => void;
    onIsPrivateChange: (value: boolean) => void;
    onPasswordChange: (value: string) => void;
    onCreateLobby: () => void;
    isCreating?: boolean;
}

export const CreateLobbyDialog = ({
                                      open,
                                      onClose,
                                      gameName,
                                      maxPlayers,
                                      isPrivate,
                                      password,
                                      onMaxPlayersChange,
                                      onIsPrivateChange,
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
                        label="Max Players"
                        type="number"
                        value={maxPlayers}
                        onChange={(e) => onMaxPlayersChange(Number(e.target.value))}
                        fullWidth
                    />
                    <FormControlLabel
                        control={
                            <Switch
                                checked={isPrivate}
                                onChange={(e) => onIsPrivateChange(e.target.checked)}
                            />
                        }
                        label="Private Lobby"
                    />
                    {isPrivate && (
                        <TextField
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => onPasswordChange(e.target.value)}
                            fullWidth
                            required
                        />
                    )}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                    onClick={onCreateLobby}
                    variant="contained"
                    disabled={isCreating || (isPrivate && !password)}
                >
                    {isCreating ? 'Creating...' : 'Create Lobby'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};