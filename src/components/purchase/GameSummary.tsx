import { Box, CardMedia, Typography, Chip, Stack, Divider } from '@mui/material';
import type { Game } from '../../model/game';

interface GameSummaryProps {
    game: Game;
}

export function GameSummary({ game }: GameSummaryProps) {
    return (
        <>
            {game.imageUrl && (
                <CardMedia
                    component="img"
                    height="300"
                    image={game.imageUrl}
                    alt={game.name}
                    sx={{ objectFit: 'cover' }}
                />
            )}
            <Box sx={{ p: 3 }}>
                <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
                    {game.name}
                </Typography>

                {game.categories && game.categories.length > 0 && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                        <Stack
                            direction="row"
                            spacing={1}
                            sx={{ flexWrap: 'wrap', gap: 1, justifyContent: 'center', alignItems: 'center' }}
                        >
                            {game.categories.map((category) => (
                                <Chip
                                    key={category}
                                    label={category}
                                    size="small"
                                    color="primary"
                                    variant="outlined"
                                />
                            ))}
                        </Stack>
                    </Box>
                )}

                {game.description && (
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                            {game.description}
                        </Typography>
                    </Box>
                )}

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                        Total Price
                    </Typography>
                    <Typography variant="h4" color="primary" fontWeight="bold">
                        €{game.price?.toFixed(2) || '0.00'}
                    </Typography>
                </Box>
            </Box>
        </>
    );
}
