import { useContext } from 'react';
import SecurityContext from '../context/SecurityContext';
import type {LibraryGame} from "../model/libraryGame.ts";
import {useQuery} from "@tanstack/react-query";
import {getOwnedGamesForUser} from "../services/userApi.ts";

function useCurrentUser() {
    const { loggedInUser, isAuthenticated } = useContext(SecurityContext);

    return {
        userId: loggedInUser?.profile?.userId || '',
        token: loggedInUser?.accessToken,
        isAuthenticated: isAuthenticated() && !!loggedInUser?.profile?.userId,
        user: loggedInUser
    };
}

export function useOwnedGames(searchTerm: string) {
    const { userId, token, isAuthenticated } = useCurrentUser();

    const {
        data: ownedGames = [],
        isLoading: loading,
        error,
        refetch: refresh,
    } = useQuery<LibraryGame[], Error>({
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