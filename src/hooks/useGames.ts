import {useMemo} from 'react';
import {useQuery, useSuspenseQuery} from '@tanstack/react-query';
import {fetchGames, getGames, getGameById} from '../services/gameApi.ts';
import type {Game} from '../model/game.ts';
import type {GameFilterRequest} from '../model/gameRequest.ts';

export function useFilteredGames(
    serverFilters: GameFilterRequest,
    searchText: string
) {
    const { games } = useGames(serverFilters);

    const filteredGames = useMemo(() => {
        if (!searchText) return games;

        const lowerCaseSearchTerm = searchText.toLowerCase();

        return games.filter(game =>
            game.name.toLowerCase().includes(lowerCaseSearchTerm)
        );
    }, [games, searchText]);

    return { games: filteredGames };
}

function useGames(filters: GameFilterRequest | null) {
    const { data } = useSuspenseQuery<Game[]>({
        queryKey: ['games', filters ?? {}],
        queryFn: () => getGames(filters ?? {}),
    })
    return { games: data }
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

export function useAllGames() {
    const {
        data: games = [],
        isLoading: loading,
        error,
        refetch: refresh,
    } = useQuery<Game[], Error>({
        queryKey: ['games', 'all'],
        queryFn: fetchGames,
        enabled: true,
        staleTime: 5 * 60 * 1000,
    });

    const gameNamesMap = useMemo(() => {
        const map: Record<string, string> = {};
        games.forEach(game => {
            if (game.gameId) {
                map[game.gameId] = game.name;
            }
        });
        return map;
    }, [games]);

    return {
        games,
        gameNamesMap,
        loading,
        error: error ? error.message : null,
        refresh,
    };
}