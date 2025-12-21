import { useFilteredGames } from '../hooks/useGames';
import type { GameFilterRequest } from "../model/gameRequest";
import { useOwnedGames } from "../hooks/useOwnedGames.ts";
import { GameListDisplay } from "./GameListDisplay.tsx";

interface BaseGameListProps {
    searchText: string;
}

interface StoreGameListProps extends BaseGameListProps {
    filters: GameFilterRequest;
}

export function StoreGameList({ searchText, filters }: StoreGameListProps) {
    const { games } = useFilteredGames(filters, searchText);
    return <GameListDisplay games={games} searchText={searchText} filters={filters} />;
}

export function LibraryGameList({ searchText }: BaseGameListProps) {
    const { games } = useOwnedGames(searchText);
    return <GameListDisplay games={games} searchText={searchText} isLibrary />;
}