import { Box, Card, CardMedia, Chip, Typography } from '@mui/material';
import type { BaseGame } from '../../model/game';

interface GameCardProps {
    game: BaseGame;
}

export function ProfileGameCard({ game }: GameCardProps) {
    return (
        <Card>
            <CardMedia
                component="img"
                height="140"
                image={game.imageUrl || `https://placehold.co/400x200/1B2838/FFFFFF?text=${encodeURIComponent(game.name)}`}
                alt={game.name}
                sx={{ objectFit: 'contain' }}
            />
            <Box sx={{ p: 2, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    sx={{
                        mb: 1,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                    }}
                >
                    {game.name}
                </Typography>
                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 'auto' }}>
                    {game.categories?.slice(0, 2).map((category) => (
                        <Chip key={category} label={category} size="small"/>
                    ))}
                </Box>
            </Box>
        </Card>
    );
}