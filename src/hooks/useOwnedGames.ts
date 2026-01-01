import { useQuery } from "@tanstack/react-query";
import { getMyOwnedGames, getOwnedGamesForUser } from "../services/gameApi.ts";
import { useMemo } from "react";
import { filterAndSortLibraryGames } from "../utils/gameFilters.ts";
import { useCurrentUser } from "./useUserProfile.ts";

export function useMyOwnedGames(searchText: string) {
    const { isAuthenticated } = useCurrentUser();

    const { data, isLoading, error } = useQuery({
        queryKey: ['myOwnedGames'],
        queryFn: () => getMyOwnedGames(),
        enabled: isAuthenticated,
    });

    const games = useMemo(
        () => filterAndSortLibraryGames(data ?? [], searchText),
        [data, searchText]
    );

    return {
        games,
        isLoading,
        error
    };
}

export function useUserLibrary(userId: string | undefined) {
    const query = useQuery({
        queryKey: ['userLibrary', userId],
        queryFn: () => getOwnedGamesForUser(userId!),
        enabled: !!userId
    });
    return {
        games: query.data,
        isLoading: query.isLoading,
        error: query.error,
        refetch: query.refetch
    };
}
