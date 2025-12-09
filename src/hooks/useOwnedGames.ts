import {useQuery} from "@tanstack/react-query";
import {getOwnedGamesForUser} from "../services/gameApi.ts";
import type {Game} from "../model/game.ts";
import {useCurrentUser} from "./useUserProfile.ts";

export function useOwnedGames(searchTerm: string) {
    const { keycloakId, isAuthenticated } = useCurrentUser();

    const {
        data: ownedGames = [],
        isLoading: loading,
        error,
        refetch: refresh,
    } = useQuery<Game[], Error>({
        queryKey: ['ownedGames', keycloakId],
        queryFn: () => getOwnedGamesForUser(keycloakId),
        enabled: isAuthenticated && !!keycloakId,
    });

    const filteredGames = ownedGames.filter(game =>
        game.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return {
        games: filteredGames,
        loading,
        error: error ? error.message : null,
        refresh,
    };
}

export function useOwnedGamesForUser(userId: string, searchTerm: string = "") {
    const { isAuthenticated } = useCurrentUser();

    const {
        data: ownedGames = [],
        isLoading: loading,
        error,
    } = useQuery<Game[], Error>({
        queryKey: ['ownedGames', userId],
        queryFn: () => getOwnedGamesForUser(userId),
        enabled: isAuthenticated && !!userId,
    });

    const filteredGames = ownedGames.filter(game =>
        game.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return {
        games: filteredGames,
        loading,
        error: error ? error.message : null,
    };
}