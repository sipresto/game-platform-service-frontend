import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useContext, useEffect, useRef } from 'react';
import SecurityContext from '../context/SecurityContext';
import {
    createLobby,
    getLobbiesForGame,
    getLobbyDetails,
    joinLobby,
    leaveLobby,
    startGame
} from '../services/lobbyApi';
import type {
    CreateLobbyRequest,
    JoinLobbyRequest,
    StartGameRequest
} from '../model/lobby';
import { useUserProfile } from "./useUserProfile.ts";

const useToken = () => {
    const { loggedInUser } = useContext(SecurityContext);
    return loggedInUser?.accessToken ?? loggedInUser?.idToken;
};

const normalizeGameUrl = (gameUrl: string, gameName: string): string => {
    try {
        const url = new URL(gameUrl);

        const pathAndQuery = url.pathname + url.search + url.hash;

        const gameBasePath = `/games/${gameName.toLowerCase()}/`;

        let finalPath = pathAndQuery;

        if (!finalPath.startsWith(gameBasePath)) {
            if (finalPath.startsWith('/')) {
                finalPath = gameBasePath + finalPath.substring(1);
            } else {
                finalPath = gameBasePath + finalPath;
            }
        }

        return window.location.origin + finalPath;
    } catch (error) {
        console.warn(error);
        let finalPath = gameUrl;
        const gameBasePath = `/games/${gameName.toLowerCase()}/`;

        if (!finalPath.startsWith(gameBasePath)) {
            if (finalPath.startsWith('/')) {
                finalPath = gameBasePath + finalPath.substring(1);
            } else {
                finalPath = gameBasePath + finalPath;
            }
        }

        return window.location.origin + finalPath;
    }
};

const extractGameNameFromUrl = (gameUrl: string): string | null => {
    try {
        const url = new URL(gameUrl);
        const pathParts = url.pathname.split('/').filter(Boolean);

        if (pathParts.length >= 2 && pathParts[0] === 'games') {
            return pathParts[1];
        }
    } catch (error) {
        console.warn(error);
        const pathParts = gameUrl.split('/').filter(Boolean);
        if (pathParts.length >= 2 && pathParts[0] === 'games') {
            return pathParts[1];
        }
    }
    return null;
};

export function useLobbies(gameId: string | undefined) {
    const token = useToken();

    const query = useQuery({
        queryKey: ['lobbies', gameId],
        queryFn: () => getLobbiesForGame(gameId!),
        enabled: !!gameId && !!token,
        refetchInterval: 1500,
    });

    return {
        ...query,
        lobbies: query.data ?? [],
    };
}

export function useLobbyDetail(lobbyId: string | undefined, gameName: string) {
    const { profile } = useUserProfile();
    const { loggedInUser } = useContext(SecurityContext);
    const redirectAttemptedRef = useRef(false);

    const query = useQuery({
        queryKey: ['lobby', lobbyId],
        queryFn: () => getLobbyDetails(lobbyId!),
        enabled: !!lobbyId,
        refetchInterval: 2000,
    });

    const myUserId = profile?.id;
    const hostId = query.data?.hostId;

    const isHost = !!(
        query.data &&
        myUserId &&
        (hostId === myUserId)
    );

    useEffect(() => {
        if (!query.data || redirectAttemptedRef.current || !lobbyId || !gameName) return;

        const currentLobby = query.data;

        if (currentLobby.started && currentLobby.gameUrl && !redirectAttemptedRef.current) {
            redirectAttemptedRef.current = true;

            const extractedGameName = extractGameNameFromUrl(currentLobby.gameUrl) || gameName;

            let finalUrl = normalizeGameUrl(currentLobby.gameUrl, extractedGameName);

            const token = loggedInUser?.accessToken ?? loggedInUser?.idToken;
            if (token) {
                try {
                    const urlObj = new URL(finalUrl);
                    urlObj.searchParams.set('token', token);

                    localStorage.setItem('gameAccessToken', token);
                    sessionStorage.setItem('gameAccessToken', token);

                    finalUrl = urlObj.toString();
                } catch (error) {
                    console.error('Failed to add token to URL:', error);
                }
            }

            localStorage.setItem(`game_${lobbyId}_url`, finalUrl);

            setTimeout(() => {
                window.location.href = finalUrl;
            }, 300);
        }
    }, [query.data, lobbyId, loggedInUser, gameName]);

    return {
        ...query,
        lobby: query.data,
        isHost,
    };
}

export function useLobbyActions(gameId: string | undefined, gameName: string) {
    const token = useToken();
    const queryClient = useQueryClient();

    const createMutation = useMutation({
        mutationFn: (request: CreateLobbyRequest) => createLobby(request),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['lobbies', gameId] });
        },
    });

    const joinMutation = useMutation({
        mutationFn: ({ lobbyId, request }: { lobbyId: string; request: JoinLobbyRequest }) =>
            joinLobby(lobbyId, request),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['lobbies', gameId] });
        },
    });

    const leaveMutation = useMutation({
        mutationFn: ({ lobbyId }: { lobbyId: string }) => leaveLobby(lobbyId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['lobbies', gameId] });
        },
    });

    const startMutation = useMutation({
        mutationFn: ({ lobbyId, request }: { lobbyId: string; request: StartGameRequest }) =>
            startGame(lobbyId, request, token),
        onSuccess: (data, variables) => {
            const extractedGameName = extractGameNameFromUrl(data.url) || gameName;

            let finalUrl = normalizeGameUrl(data.url, extractedGameName);

            localStorage.setItem(`game_${variables.lobbyId}_url`, finalUrl);
            sessionStorage.setItem(`game_started_${variables.lobbyId}`, 'true');

            queryClient.invalidateQueries({ queryKey: ['lobbies', gameId] });
            queryClient.invalidateQueries({ queryKey: ['lobby', variables.lobbyId] });

            if (token) {
                try {
                    const urlObj = new URL(finalUrl);
                    urlObj.searchParams.set('token', token);
                    localStorage.setItem('gameAccessToken', token);
                    finalUrl = urlObj.toString();
                } catch (error) {
                    console.error('Failed to add token to URL:', error);
                }
            }

            setTimeout(() => {
                window.location.href = finalUrl;
            }, 800);
        },
    });

    return {
        createLobby: createMutation,
        joinLobby: joinMutation,
        leaveLobby: leaveMutation,
        startGame: startMutation,
    };
}