import { useState, useEffect, useCallback, useMemo } from 'react';
import {fetchGames, filterGames, getGameById} from '../services/gameApi.ts';
import type {Game} from "../model/game.ts";
import type {GameFilterRequest} from "../model/gameRequest.ts";
import {useQuery} from "@tanstack/react-query";

function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

export function useFilteredStoreGames(
    searchTerm: string,
    activeFilters: GameFilterRequest
) {
    const [structurallyFilteredGames, setStructurallyFilteredGames] = useState<Game[]>([]);

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    const isFilterEmpty = useMemo(() => {
        return !activeFilters.minPrice &&
            !activeFilters.maxPrice &&
            (!activeFilters.categories || activeFilters.categories.length === 0);
    }, [activeFilters]);

    const loadGames = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            let data: Game[];

            if (isFilterEmpty) {
                data = await fetchGames();
                setStructurallyFilteredGames(data);
            } else if (structurallyFilteredGames.length === 0) {
                data = await filterGames(activeFilters);
                setStructurallyFilteredGames(data);
            } else {
                setLoading(false);
                return;
            }

        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unexpected error occurred');
            }
        } finally {
            setLoading(false);
        }
    }, [isFilterEmpty, activeFilters, structurallyFilteredGames.length]);

    useEffect(() => {
        void loadGames();
    }, [loadGames]);

    const finalFilteredGames = useMemo(() => {
        let currentGames = structurallyFilteredGames;

        if (debouncedSearchTerm) {
            const lowerCaseSearchTerm = debouncedSearchTerm.toLowerCase();
            currentGames = currentGames.filter(game =>
                game.name.toLowerCase().includes(lowerCaseSearchTerm)
            );
        }

        return currentGames;

    }, [structurallyFilteredGames, debouncedSearchTerm]);


    return {
        games: finalFilteredGames,
        loading,
        error,
        refresh: loadGames
    };
}

export function useGameDetails(gameId: string | undefined) {
    const {
        data: game,
        isLoading: loading,
        error,
        refetch: refresh
    } = useQuery<Game, Error>({
        queryKey: ['game', gameId],
        queryFn: () => getGameById(gameId!),
        enabled: true,
    })

    return {
        game,
        loading,
        error: error,
        refresh
    }
}