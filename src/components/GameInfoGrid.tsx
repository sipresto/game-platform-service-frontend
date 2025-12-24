import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Divider,
    Grid,
    Stack,
    Typography,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import type { Game } from "../model/game.ts";
import { useNavigate } from "react-router";
import { useContext, useEffect, useState } from "react";
import SecurityContext from "../context/SecurityContext.ts";
import { useMyOwnedGames } from "../hooks/useOwnedGames.ts";

interface GameInfoGridProps {
    game: Game;
}

export function GameInfoGrid({ game }: GameInfoGridProps) {
    const navigate = useNavigate();
    const { isAuthenticated, login } = useContext(SecurityContext);
    const { games } = useMyOwnedGames("");

    const [isGameOwned, setIsGameOwned] = useState(false);

    useEffect(() => {
        const owned = games.some((g) => g.gameId === game.gameId);
        setIsGameOwned(owned);
    }, [games, game.gameId]);

    const handleBuyClick = () => {
        if (!isAuthenticated()) {
            login();
            return;
        }
        navigate(`/purchase/${game.gameId}`);
    };

    return (
        <Grid size={{ xs: 12, md: 5 }}>
            <Card elevation={4} sx={{ borderRadius: 2 }}>
                <CardContent>
                    <Stack spacing={3}>
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                                Description
                            </Typography>
                            <Typography
                                variant="body1"
                                sx={{ color: "text.secondary", whiteSpace: "pre-line" }}
                            >
                                {game.description}
                            </Typography>
                        </Box>

                        <Box textAlign="center">
                            <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                Categories
                            </Typography>

                            <Stack
                                direction="row"
                                spacing={1}
                                flexWrap="wrap"
                                justifyContent="center"
                            >
                                {game.categories.map((tag, index) => (
                                    <Chip
                                        key={index}
                                        label={tag}
                                        size="small"
                                        sx={{ mb: 1, textTransform: "capitalize" }}
                                    />
                                ))}
                            </Stack>
                        </Box>

                        <Divider />

                        <Stack
                            direction={{ xs: "column", sm: "row" }}
                            spacing={2}
                            alignItems="center"
                            justifyContent="space-between"
                        >
                            <Box>
                                <Typography variant="overline" color="text.secondary">
                                    Price
                                </Typography>
                                <Typography variant="h5" sx={{ fontWeight: "bold", mt: 0.5 }}>
                                    € {game.price?.toFixed(2) ?? "0.00"}
                                </Typography>
                            </Box>

                            <Button
                                startIcon={!isGameOwned ? <ShoppingCartIcon /> : <CheckCircleIcon />}
                                variant="contained"
                                size="large"
                                onClick={handleBuyClick}
                                disabled={isGameOwned}
                                fullWidth
                                sx={{ maxWidth: 240 }}
                            >
                                {isGameOwned ? "You already own this game" : "Buy Game"}
                            </Button>
                        </Stack>
                    </Stack>
                </CardContent>
            </Card>
        </Grid>
    );
}
