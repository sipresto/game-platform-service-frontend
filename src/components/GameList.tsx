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
import type {LibraryGame} from "../model/libraryGame.ts";
import {useOwnedGames} from "../hooks/useOwnedGames.ts";

type ListGame = Game | LibraryGame;

interface GameListProps {
    searchTerm: string;
    filters: GameFilterRequest;
    isLibrary?: boolean;
}

export function GameList({ searchTerm, filters, isLibrary=false }: GameListProps) {
    const storeHook = useFilteredStoreGames(searchTerm, filters);
    const libraryHook = useOwnedGames(searchTerm);

    const data = isLibrary ? libraryHook : storeHook;

    const games: ListGame[] = data.games as ListGame[];
    const loading = data.loading;
    const error = data.error;
    const refresh = data.refresh;

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
                        <Button color="inherit" size="small" onClick={() => void refresh()}>
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
                            {searchTerm || (isLibrary ? false : Object.keys(filters).length > 0)
                                ? `No games found matching your criteria.`
                                : isLibrary ? 'Your library is empty.' : 'No games available'}
                        </Typography>
                        <Typography variant="body1">
                            {searchTerm || (isLibrary ? false : Object.keys(filters).length > 0)
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
            {games.map((game: ListGame) => (
                <Grid key={game.gameId} size={{xs: 12, md: 6, lg: 4}}>
                    <GameCard game={game as Game} isLibrary={isLibrary} />
                </Grid>
            ))}
        </Grid>
    );
}
