import { Box, Typography, Button, Chip, IconButton } from '@mui/material';
import { Add as AddIcon, Refresh as RefreshIcon } from '@mui/icons-material';

interface LobbyHeaderProps {
    game?: {
        name?: string;
        description?: string;
        categories?: string[];
    };
    onCreateLobby: () => void;
    onRefresh: () => void;
}

export const LobbyHeader = ({ game, onCreateLobby, onRefresh }: LobbyHeaderProps) => {
    return (
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
                <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
                    {game?.name || 'Game'} Lobbies
                </Typography>
                {game?.description && (
                    <Typography variant="body1" color="text.secondary">
                        {game.description}
                    </Typography>
                )}
                {game?.categories && game.categories.length > 0 && (
                    <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                        {game.categories.map((category) => (
                            <Chip
                                key={category}
                                label={category}
                                size="small"
                                variant="outlined"
                            />
                        ))}
                    </Box>
                )}
            </Box>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <IconButton onClick={onRefresh} color="primary" title="Refresh lobbies">
                    <RefreshIcon />
                </IconButton>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={onCreateLobby}
                >
                    Create Lobby
                </Button>
            </Box>
        </Box>
    );
};