import { Box, Grid, Typography, } from '@mui/material';
import { GameCard } from './GameCard';
import type { GameFilterRequest } from "../model/gameRequest";
import type { Game } from "../model/game";

interface GameListDisplayProps {
    games: Game[];
    searchText: string;
    filters?: GameFilterRequest;
    isLibrary?: boolean;
}

export function GameListDisplay({ games, searchText, filters, isLibrary = false }: GameListDisplayProps) {
    if (games.length === 0) {
        return (
            <Grid container spacing={2} justifyContent="center" sx={{ mt: 10, opacity: 0.6 }}>
                <Grid size={{xs: 12}}>
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h5" gutterBottom>
                            {searchText || (isLibrary ? false : filters && Object.keys(filters).length > 0)
                                ? `No games found matching your criteria.`
                                : isLibrary ? 'Your library is empty.' : 'No games available'}
                        </Typography>
                        <Typography variant="body1">
                            {searchText || (isLibrary ? false : filters && Object.keys(filters).length > 0)
                                ? 'Try modifying your search term or filter settings.'
                                : isLibrary ? 'Time to check out the store!' : 'Check back later for new releases.'}
                        </Typography>
                    </Box>
                </Grid>
            </Grid>
        );
    }

    return (
        <Grid container spacing={2} sx={{ overflowX: 'hidden' }}>
            {games.map((game: Game) => (
                <Grid key={game.gameId} size={{xs: 12, md: 6, lg: 3}}>
                    <GameCard game={game} isLibrary={isLibrary} />
                </Grid>
            ))}
        </Grid>
    );
}