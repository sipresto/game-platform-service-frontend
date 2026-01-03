import { Box, Chip, Grid, Paper, Typography } from '@mui/material';
import { Games as GamesIcon } from '@mui/icons-material';
import type { BaseGame } from '../../model/game';
import { ProfileGameCard } from './ProfileGameCard';
import { EmptyGameLibrary } from './EmptyGameLibrary';

interface GameLibrarySectionProps {
    games: BaseGame[];
    isOwnProfile: boolean;
}

export function GameLibrarySection({ games, isOwnProfile }: GameLibrarySectionProps) {
    return (
        <Paper
            sx={{
                p: 3,
                borderRadius: 2,
                flexGrow: 1
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 3,
                    pb: 2,
                    borderBottom: 1,
                    borderColor: 'divider',
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <GamesIcon sx={{ fontSize: 28, color: 'primary.main' }}/>
                    <Typography variant="h5" fontWeight={700}>
                        Game Library
                    </Typography>
                </Box>
                <Chip label={`${games.length} ${games.length === 1 ? 'game' : 'games'}`} color="primary"/>
            </Box>
            {games.length > 0 ? (
                <Grid container spacing={2}>
                    {games.map((game) => (
                        <Grid key={game.gameId} size={{ xs: 6, sm: 4, md: 4, lg: 3 }}>
                            <ProfileGameCard game={game}/>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <EmptyGameLibrary isOwnProfile={isOwnProfile}/>
            )}
        </Paper>
    );
}