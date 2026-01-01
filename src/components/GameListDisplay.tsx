import { Box, Grid, Typography, } from '@mui/material';
import { GameCard } from './GameCard';
import type { GameFilterRequest } from "../model/gameRequest";
import type { Game, LibraryGame } from "../model/game";

type GameListDisplayProps =
    | {
    games: Game[];
    searchText: string;
    filters?: GameFilterRequest;
    isLibrary?: false;
    ownedGameIds?: string[];
}
    | {
    games: LibraryGame[];
    searchText: string;
    isLibrary: true;
};


export function GameListDisplay(props: GameListDisplayProps) {
    const { games, searchText, isLibrary = false } = props;
    const ownedGameIds = 'ownedGameIds' in props ? props.ownedGameIds : [];

    const hasSearch = searchText.trim().length > 0;
    const hasFilters =
        !isLibrary && 'filters' in props && props.filters && Object.keys(props.filters).length > 0;

    const isFilteredView = hasSearch || hasFilters;

    if (games.length === 0) {
        return (
            <Grid container spacing={2} justifyContent="center" sx={{ mt: 10, opacity: 0.6 }}>
                <Grid size={{ xs: 12 }}>
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h5" gutterBottom>
                            {isFilteredView
                                ? 'No games found matching your criteria.'
                                : isLibrary
                                    ? 'Your library is empty.'
                                    : 'No games available'}
                        </Typography>

                        <Typography variant="body1">
                            {isFilteredView
                                ? 'Try modifying your search term or filter settings.'
                                : isLibrary
                                    ? 'Time to check out the store!'
                                    : 'Check back later for new releases.'}
                        </Typography>
                    </Box>
                </Grid>
            </Grid>
        );
    }

    return (
        <Grid container spacing={2} sx={{ overflowX: 'hidden' }}>
            {isLibrary
                ? (games as LibraryGame[]).map((game) => (
                    <Grid key={game.gameId} size={{ xs: 12, md: 6, lg: 3 }}>
                        <GameCard game={game} isLibrary={true} />
                    </Grid>
                ))
                : (games as Game[]).map((game) => (
                    <Grid key={game.gameId} size={{ xs: 12, md: 6, lg: 3 }}>
                        <GameCard game={game} isOwned={ownedGameIds?.includes(game.gameId)} />
                    </Grid>
                ))}
        </Grid>
    );
}