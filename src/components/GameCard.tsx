import {
    Card,
    CardContent,
    CardMedia,
    Typography,
    Box,
    Chip,
    Divider
} from '@mui/material';
import type {Game} from "../model/game.ts";

interface GameCardProps {
    game: Game;
}

export function GameCard({ game }: GameCardProps) {
    return (
        <Card
            variant="outlined"
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderColor: 'text.secondary',
                borderWidth: 1,
                borderRadius: 0,
                transition: 'transform 0.2s',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 3
                }
            }}
        >
            <CardMedia
                component="img"
                height="200"
                image={game.imageUrl || `https://placehold.co/600x400/EEE/31343C?text=${encodeURIComponent(game.name)}`}
                alt={game.name}
                sx={{ borderBottom: '1px solid', borderColor: 'text.secondary' }}
            />

            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 0 }}>
                <Box sx={{ display: 'flex', height: '100%', minHeight: '100px' }}>

                    <Box sx={{ p: 2, flexGrow: 1 }}>
                        <Typography variant="subtitle1" component="h2" fontWeight="bold" lineHeight={1.2} gutterBottom>
                            {game.name}
                        </Typography>

                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                            {game.description.substring(0, 60)}{game.description.length > 60 ? '...' : ''}
                        </Typography>

                        <Chip
                            label={game.category}
                            size="small"
                            variant="outlined"
                            sx={{ borderRadius: 1, height: 20, fontSize: '0.7rem' }}
                        />
                    </Box>

                    <Divider orientation="vertical" flexItem />

                    <Box
                        sx={{
                            p: 2,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            minWidth: '80px',
                            bgcolor: 'grey.50'
                        }}
                    >
                        <Typography variant="h6" color="text.primary" fontWeight="bold">
                            {game.price}$
                        </Typography>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
}