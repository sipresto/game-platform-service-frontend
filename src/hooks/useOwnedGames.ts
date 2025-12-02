import {useQuery} from "@tanstack/react-query";
import {getOwnedGamesForUser} from "../services/userApi.ts";
import type {Game} from "../model/game.ts";
import {useCurrentUser} from "./useUserProfile.ts";

export function useOwnedGames(searchTerm: string) {
    const { userId, token, isAuthenticated } = useCurrentUser();

    const {
        data: ownedGames = [],
        isLoading: loading,
        error,
        refetch: refresh,
    } = useQuery<Game[], Error>({
        queryKey: ['ownedGames', userId],
        queryFn: () => getOwnedGamesForUser(userId, token),
        enabled: isAuthenticated && !!userId,
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