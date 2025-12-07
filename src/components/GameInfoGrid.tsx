import { Box, Button, Grid, Typography } from "@mui/material";
import type { Game } from "../model/game.ts";
import { useNavigate } from "react-router";
import { useContext, useEffect, useState } from "react";
import SecurityContext from "../context/SecurityContext.ts";
import { NotificationAlert } from "./NotificationAlert.tsx";
import { useOwnedGames } from "../hooks/useOwnedGames.ts";

interface GameInfoGridProps {
    game: Game;
}

export function GameInfoGrid({ game }: GameInfoGridProps) {
    const navigate = useNavigate();
    const { isAuthenticated, login } = useContext(SecurityContext);
    const libraryHook = useOwnedGames("");
    const games: Game[] = libraryHook.games;

    const [notification, setNotification] = useState<{
        type: "success" | "error";
        message: string;
    } | null>(null);

    const [isGameOwned, setIsGameOwned] = useState(false);

    useEffect(() => {
        const owned = games.some((gameMap) => gameMap.gameId === game.gameId);
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
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                Description
            </Typography>
            <Typography variant="body1" gutterBottom sx={{ mb: 2 }}>
                {game.description}
            </Typography>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
                {game.categories.map((tag, index) => (
                    <Box
                        key={index}
                        sx={{
                            px: 1.5,
                            py: 0.5,
                            bgcolor: "#e0e0e0",
                            borderRadius: "4px",
                            fontSize: "0.85rem",
                            color: "#333",
                        }}
                    >
                        {tag}
                    </Box>
                ))}
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                    € {game.price?.toFixed(2) ?? 0}
                </Typography>

                <Button
                    variant="contained"
                    size="medium"
                    onClick={handleBuyClick}
                    disabled={isGameOwned}
                >
                    {isGameOwned ? "You already own this game" : "Buy the game"}
                </Button>

                <NotificationAlert
                    notification={notification}
                    onClose={() => setNotification(null)}
                />
            </Box>
        </Grid>
    );
}
