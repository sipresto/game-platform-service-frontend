import { Box, Typography } from '@mui/material';

interface LobbyHeaderProps {
    game?: {
        name?: string;
        description?: string;
        categories?: string[];
    };
}

export const LobbyHeader = ({ game }: LobbyHeaderProps) => {
    return (
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Box>
                <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
                    {game?.name || 'Game'} Lobbies
                </Typography>
                {game?.description && (
                    <Typography variant="body1" color="text.secondary">
                        {game.description}
                    </Typography>
                )}
            </Box>
        </Box>
    );
};