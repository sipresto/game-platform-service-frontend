import {Box, Button, Grid, Typography} from "@mui/material";
import type {Game} from "../model/game.ts";
import {useNavigate} from "react-router";
import {useContext, useState} from "react";
import SecurityContext from "../context/SecurityContext.ts";
import {usePurchaseGame} from "../hooks/usePurchases.ts";
import {NotificationAlert} from "./NotificationAlert.tsx";

interface GameInfoGridProps {
    game: Game;
}

export function GameInfoGrid({game}: GameInfoGridProps) {
    const navigate = useNavigate();
    const {isAuthenticated, login} = useContext(SecurityContext);
    const { purchaseGame } = usePurchaseGame();

    const [notification, setNotification] = useState<{
        type: 'success' | 'error';
        message: string;
    } | null>(null);

    const handleBuyClick = () => {
        if (!isAuthenticated()) {
            login();
            return;
        }
        else {
            purchaseGame.mutate(game.gameId, {
                onSuccess: () => {
                    navigate(`/library`)
                },
                onError: () => {
                    setNotification({
                        type: 'error',
                        message: 'Failed to buy game.'
                    });
                }
            })
        }
    };


    return (
        <Grid size={{xs: 12, md: 5}}>
            <Typography variant="h5" sx={{fontWeight: 'bold'}}>
                Description
            </Typography>
            <Typography variant="body1" gutterBottom sx={{ mb: 2 }}>
                {game.description}
            </Typography>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
                {game.categories.map(tag => (
                    <Box
                        sx={{
                            px: 1.5,
                            py: 0.5,
                            bgcolor: '#e0e0e0',
                            borderRadius: '4px',
                            fontSize: '0.85rem',
                            color: '#333',
                        }}
                    >
                        {tag}
                    </Box>
                ))}
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="h5" sx={{fontWeight: 'bold'}}>
                    € {game.price?.toFixed(2) ?? 0 }
                </Typography>

                <Button
                    variant="contained"
                    size="medium"
                    onClick={handleBuyClick}
                >
                    Buy the game
                </Button>

                <NotificationAlert
                    notification={notification}
                    onClose={() => setNotification(null)}
                />

            </Box>
        </Grid>
    )

}