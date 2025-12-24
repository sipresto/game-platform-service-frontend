import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { getMyOwnedGames, getOwnedGamesForUser } from "../services/gameApi.ts";
import { useMemo } from "react";
import { filterAndSortLibraryGames } from "../utils/gameFilters.ts";

export function useMyOwnedGames(searchText: string) {
    const { data } = useSuspenseQuery({
        queryKey: ['myOwnedGames'],
        queryFn: () => getMyOwnedGames(),
    });

    const games = useMemo(
        () => filterAndSortLibraryGames(data, searchText),
        [data, searchText]
    );

    return { games };
}

export function useUserLibrary(userId: string | undefined) {
    const { data, isLoading, error } = useQuery({
        queryKey: ['userLibrary', userId],
        queryFn: () => getOwnedGamesForUser(userId!),
        enabled: !!userId
    });
    return {
        games: data,
        isLoading,
        error
    };
}
