import {
    Alert,
    Box,
    Button,
    CardMedia,
    CircularProgress,
    Container,
    Divider,
    Grid,
    Stack,
    Typography,
} from "@mui/material";
import { useGameDetails } from "../hooks/useGames.ts";
import { useParams } from "react-router";
import { GameInfoGrid } from "../components/games/GameInfoGrid.tsx";

export function GamePage() {
    const { gameId } = useParams<{ gameId: string }>();
    const { game, loading, error, refresh } = useGameDetails(gameId);

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
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
                        <Button onClick={() => void refresh()} color="inherit" size="small">
                            Retry
                        </Button>
                    }
                >
                    {error}
                </Alert>
            </Box>
        );
    }

    if (!game) return null;

    const rulesList = game.rules
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0);

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Stack spacing={4} sx={{ maxWidth: 1200, mx: "auto" }}>
                <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                    {game.name}
                </Typography>

                <Grid container spacing={4}>
                    <Grid size={{ xs: 12, md: 7}}>
                        <CardMedia
                            component="img"
                            image={
                                game.imageUrl ||
                                `https://placehold.co/1000x500/1B2838/FFFFFF?text=${encodeURIComponent(
                                    game.name
                                )}`
                            }
                            alt={game.name}
                            sx={{
                                width: "100%",
                                borderRadius: 2,
                                objectFit: "cover",
                                boxShadow: 3,
                            }}
                        />
                    </Grid>

                    <GameInfoGrid game={game} />
                </Grid>

                <Divider />

                <Box textAlign="center">
                    <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2 }}>
                        Rules
                    </Typography>

                    <Box
                        component="ol"
                        sx={{
                            listStylePosition: "inside",
                            display: "inline-block",
                            textAlign: "left",
                            color: "text.secondary",
                            fontSize: "1rem",
                            p: 0,
                            m: 0,
                        }}
                    >
                        {rulesList.map((rule, index) => (
                            <li key={index} style={{ marginBottom: "8px" }}>
                                {rule}
                            </li>
                        ))}
                    </Box>
                </Box>
            </Stack>
        </Container>
    );
}
