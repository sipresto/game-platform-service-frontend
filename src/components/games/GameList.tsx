import { useFilteredGames } from '../../hooks/useGames.ts';
import type { GameFilterRequest } from "../../model/gameRequest.ts";
import { useMyOwnedGames } from "../../hooks/useOwnedGames.ts";
import { GameListDisplay } from "./GameListDisplay.tsx";
import { Alert, Box, Button, CircularProgress } from "@mui/material";

interface BaseGameListProps {
    searchText: string;
}

interface StoreGameListProps extends BaseGameListProps {
    filters: GameFilterRequest;
}

export function StoreGameList({ searchText, filters }: StoreGameListProps) {
    const { games } = useFilteredGames(filters, searchText);
    const { games: ownedGames = [] } = useMyOwnedGames(searchText);

    return (
        <GameListDisplay
            games={games}
            searchText={searchText}
            filters={filters}
            ownedGameIds={ownedGames.map((game) => game.gameId)}
        />
    );
}

export function LibraryGameList({ searchText }: BaseGameListProps) {
    const { games, isLoading, error } = useMyOwnedGames(searchText);

    if (isLoading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ mt: 4, textAlign: "center" }}>
                <Alert severity="error">
                    Failed to load your library.
                    <Box mt={1}>
                        <Button
                            variant="outlined"
                            onClick={() => window.location.reload()}
                        >
                            Retry
                        </Button>
                    </Box>
                </Alert>
            </Box>
        );
    }

    return (
        <GameListDisplay
            games={games}
            searchText={searchText}
            isLibrary={true}
        />
    );
}