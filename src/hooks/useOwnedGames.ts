import { useSuspenseQuery } from "@tanstack/react-query";
import { getOwnedGamesForUser } from "../services/gameApi.ts";
import type { Game } from "../model/game.ts";
import { useCurrentUser } from "./useUserProfile.ts";
import { useMemo } from "react";

export function useOwnedGames(searchText: string) {
    const { keycloakId } = useCurrentUser();

    if (!keycloakId) {
        return { games: [] };
    }

    return useOwnedGamesForUser(keycloakId, searchText);
}

export function useOwnedGamesForUser(userId: string, searchText: string) {
    const { isAuthenticated } = useCurrentUser();

    if (!isAuthenticated) {
        return { games: [] };
    }

    const { data: ownedGames } = useSuspenseQuery<Game[]>({
        queryKey: ['ownedGames', userId],
        queryFn: () => getOwnedGamesForUser(userId),
    })

    const filteredGames = useMemo(() => {
        if (!searchText) return ownedGames;

        const lowerCaseSearchTerm = searchText.toLowerCase();

        return ownedGames.filter(game =>
            game.name.toLowerCase().includes(lowerCaseSearchTerm)
        );
    }, [ownedGames, searchText]);


    return { games: filteredGames };
}