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
import { useGames } from '../hooks/useGames';

export function GameList() {
    const { games, loading, error, refresh } = useGames();

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
                <Typography variant="h5" gutterBottom>No games available</Typography>
                <Typography variant="body1">Check back later for new releases.</Typography>
                <Button variant="outlined" sx={{ mt: 2 }} onClick={refresh}>
                    Refresh
                </Button>
            </Box>
        );
    }

    return (
        <Grid container spacing={3}>
            {games.map((game) => (
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 6 }} key={game.gameId}>
                    <GameCard game={game} />
                </Grid>
            ))}
        </Grid>
    );
}