import {
    Grid,
    Typography,
    Alert,
    CircularProgress,
    Box,
    Button,
    Container
} from '@mui/material';
import { GameCard } from './GameCard.tsx';
import { useFilteredStoreGames } from '../hooks/useGames';
import type { GameFilterRequest } from "../model/gameRequest.ts";
import type { Game } from "../model/game.ts";

interface GameListProps {
    searchTerm: string;
    filters: GameFilterRequest;
}

export function GameList({ searchTerm, filters }: GameListProps) {

    const {
        games,
        loading,
        error,
        refresh
    } = useFilteredStoreGames(searchTerm, filters);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Container sx={{ mt: 4 }}>
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
            </Container>
        );
    }

    if (games.length === 0) {
        return (
            <Box sx={{ textAlign: 'center', mt: 10, opacity: 0.6 }}>
                <Typography variant="h5" gutterBottom>
                    {searchTerm || Object.keys(filters).length > 0
                        ? `No games found matching your criteria.`
                        : 'No games available'
                    }
                </Typography>
                <Typography variant="body1">
                    {searchTerm || Object.keys(filters).length > 0
                        ? 'Try modifying your search term or filter settings.'
                        : 'Check back later for new releases.'
                    }
                </Typography>
            </Box>
        );
    }

    return (
        <Grid container spacing={2}>
            {games.map((game: Game) => (
                <Grid
                    key={game.gameId}
                    size={{
                        xs: 12,
                        sm: 6,
                        md: 4,
                    }}
                >
                    <GameCard game={game} />
                </Grid>
            ))}
        </Grid>
    );
}