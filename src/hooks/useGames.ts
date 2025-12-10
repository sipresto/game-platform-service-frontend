import {useMemo} from 'react';
import {useQuery} from '@tanstack/react-query';
import {fetchGames, filterGames, getGameById} from '../services/gameApi.ts';
import type {Game} from '../model/game.ts';
import type {GameFilterRequest} from '../model/gameRequest.ts';

export function useFilteredStoreGames(
    searchTerm: string,
    activeFilters: GameFilterRequest
) {
    const isFilterEmpty = useMemo(() => {
        return !activeFilters.minPrice &&
            !activeFilters.maxPrice &&
            (!activeFilters.categories || activeFilters.categories.length === 0);
    }, [activeFilters]);

    const {
        data: games = [],
        isLoading: loading,
        error,
        refetch: refresh,
    } = useQuery<Game[], Error>({
        queryKey: ['games', isFilterEmpty ? 'all' : activeFilters],
        queryFn: () => isFilterEmpty ? fetchGames() : filterGames(activeFilters),
        enabled: true,
    });

    const filteredGames = useMemo(() => {
        if (!searchTerm) return games;

        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        return games.filter(game =>
            game.name.toLowerCase().includes(lowerCaseSearchTerm)
        );
    }, [games, searchTerm]);

    return {
        games: filteredGames,
        loading,
        error: error ? error.message : null,
        refresh,
    };
}

export function useGameDetails(gameId: string | undefined) {
    const {
        data: game,
        isLoading: loading,
        error,
        refetch: refresh,
    } = useQuery<Game, Error>({
        queryKey: ['game', gameId],
        queryFn: () => getGameById(gameId!),
        enabled: !!gameId,
    });

    return {
        game,
        loading,
        error: error ? error.message : null,
        refresh,
    };
}