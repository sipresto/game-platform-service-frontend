import {
    Grid,
    Typography,
    Alert,
    CircularProgress,
    Box,
    Button,
} from '@mui/material';
import { GameCard } from './GameCard';
import { useFilteredStoreGames } from '../hooks/useGames';
import type { GameFilterRequest } from "../model/gameRequest";
import type { Game } from "../model/game";

interface GameListProps {
    searchTerm: string;
    filters: GameFilterRequest;
}

export function GameList({ searchTerm, filters }: GameListProps) {
    const { games, loading, error, refresh } = useFilteredStoreGames(searchTerm, filters);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ mt: 4 }}>
                <Alert
                    severity="error"
                    action={
                        <Button color="inherit" size="small" onClick={refresh}>
                            Retry
                        </Button>
                    }
                >
                    {error}
                </Alert>
            </Box>
        );
    }

    if (games.length === 0) {
        return (
            <Grid container spacing={2} justifyContent="center" sx={{ mt: 10, opacity: 0.6 }}>
                <Grid size={{xs: 12}}>
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h5" gutterBottom>
                            {searchTerm || Object.keys(filters).length > 0
                                ? `No games found matching your criteria.`
                                : 'No games available'}
                        </Typography>
                        <Typography variant="body1">
                            {searchTerm || Object.keys(filters).length > 0
                                ? 'Try modifying your search term or filter settings.'
                                : 'Check back later for new releases.'}
                        </Typography>
                    </Box>
                </Grid>
            </Grid>
        );
    }

    return (
        <Grid container spacing={2} sx={{ overflowX: 'hidden' }}>
            {games.map((game: Game) => (
                <Grid key={game.gameId} size={{xs: 12, md: 6, lg: 4}}>
                    <GameCard game={game} />
                </Grid>
            ))}
        </Grid>
    );
}
