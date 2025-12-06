import {Alert, Box, Button, CardMedia, CircularProgress, Container, Grid, Typography} from "@mui/material";
import {useGameDetails} from "../hooks/useGames.ts";
import {useParams} from "react-router";
import {GameInfoGrid} from "../components/GameInfoGrid.tsx";

export function GamePage() {
    const { gameId } = useParams<{gameId: string}>();
    const { game, loading, error, refresh } = useGameDetails(gameId);

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
                    {error.message}
                </Alert>
            </Box>
        );
    }
    if (!game) return null;



    return (
        <Container maxWidth="xl" sx={{p: 0}}>
            <Box
                sx={{
                    textAlign: 'left',
                    width: '100%',
                    maxWidth: 1200,
                    overflowX: 'hidden',
                }}
            >
                <Typography variant="h1" sx={{ fontWeight: 'bold' }}>
                    {game.name}
                </Typography>

                <Grid container spacing={4} sx={{mb: 3}}>

                    <Grid size={{xs: 12, md: 7}}>
                        <CardMedia
                            component="img"
                            image={game.imageUrl || `https://placehold.co/400x140/1B2838/FFFFFF?text=${encodeURIComponent(game.name)}`}
                            alt={game.name}
                            sx={{
                                width: '100%',
                                borderRadius: 1,
                                objectFit: 'cover',
                            }}
                        />
                    </Grid>
                    <GameInfoGrid game={game}/>
                </Grid>

                <Typography variant="h4" sx={{fontWeight: 'bold'}}>
                    Rules
                </Typography>

                <Typography sx={{ whiteSpace: "pre-line" }}>
                    {game.rules}
                </Typography>

            </Box>
        </Container>
    )
}