import { useSuspenseQuery } from "@tanstack/react-query";
import { getOwnedGamesForUser } from "../services/gameApi.ts";
import type { LibraryGame } from "../model/game.ts";
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
    const { data: ownedGames } = useSuspenseQuery<LibraryGame[]>({
        queryKey: ['ownedGames', userId],
        queryFn: () => getOwnedGamesForUser(userId),
    })

    const filteredGames = useMemo(() => {
        let games = ownedGames;

        if (searchText) {
            const lowerCaseSearchTerm = searchText.toLowerCase();
            games = games.filter(game =>
                game.name.toLowerCase().includes(lowerCaseSearchTerm)
            );
        }

        return games.sort((a, b) => {
            if (a.isFavorited === b.isFavorited) return 0;
            return a.isFavorited ? -1 : 1;
        });
    }, [ownedGames, searchText]);


    return { games: filteredGames };
}