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

const constructGameUrl = (backendUrl: string) => {
    if (backendUrl.startsWith('http://') || backendUrl.startsWith('https://')) {
        if (backendUrl.includes('localhost:3333')) {
            return backendUrl.replace('https://', 'http://');
        }
        return backendUrl;
    }
    return window.location.origin + (backendUrl.startsWith('/') ? backendUrl : `/${backendUrl}`);
};

const shouldAttachToken = (originalBackendUrl: string) => {
    return !(originalBackendUrl.startsWith('http://') || originalBackendUrl.startsWith('https://'));
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

export function useLobbyDetail(lobbyId: string | undefined) {
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
    const isHost = !!(query.data && myUserId && (hostId === myUserId));

    useEffect(() => {
        if (!query.data || redirectAttemptedRef.current || !lobbyId) return;

        const currentLobby = query.data;

        if (currentLobby.started && currentLobby.gameUrl && !redirectAttemptedRef.current) {
            redirectAttemptedRef.current = true;

            let finalUrl = constructGameUrl(currentLobby.gameUrl);

            if (shouldAttachToken(currentLobby.gameUrl)) {
                const token = loggedInUser?.accessToken ?? loggedInUser?.idToken;
                if (token) {
                    try {
                        const urlObj = new URL(finalUrl);
                        urlObj.searchParams.set('token', token);
                        localStorage.setItem('gameAccessToken', token);
                        sessionStorage.setItem('gameAccessToken', token);
                        finalUrl = urlObj.toString();
                    } catch (error) {
                        console.error(error);
                    }
                }
            }

            localStorage.setItem(`game_${lobbyId}_url`, finalUrl);

            setTimeout(() => {
                window.location.href = finalUrl;
            }, 300);
        }
    }, [query.data, lobbyId, loggedInUser]);

    return {
        ...query,
        lobby: query.data,
        isHost,
    };
}

export function useLobbyActions(gameId: string | undefined) {
    const token = useToken();
    const queryClient = useQueryClient();

    const createMutation = useMutation({
        mutationFn: (request: CreateLobbyRequest) => createLobby(request),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['lobbies', gameId] });
        },
    });

    const joinMutation = useMutation({
        mutationFn: ({ lobbyId, request }: { lobbyId: string; request: JoinLobbyRequest }) =>
            joinLobby(lobbyId, request),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['lobbies', gameId] });
        },
    });

    const leaveMutation = useMutation({
        mutationFn: ({ lobbyId }: { lobbyId: string }) => leaveLobby(lobbyId),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['lobbies', gameId] });
        },
    });

    const startMutation = useMutation({
        mutationFn: ({ lobbyId, request }: { lobbyId: string; request: StartGameRequest }) =>
            startGame(lobbyId, request),
            
        onSuccess: async (gameUrl, variables) => {
            let finalUrl = constructGameUrl(gameUrl);

            localStorage.setItem(`game_${variables.lobbyId}_url`, finalUrl);
            sessionStorage.setItem(`game_started_${variables.lobbyId}`, 'true');

            await queryClient.invalidateQueries({ queryKey: ['lobbies', gameId] });
            await queryClient.invalidateQueries({ queryKey: ['lobby', variables.lobbyId] });

            if (shouldAttachToken(gameUrl)) {
                if (token) {
                    try {
                        const urlObj = new URL(finalUrl);
                        urlObj.searchParams.set('token', token);
                        localStorage.setItem('gameAccessToken', token);
                        finalUrl = urlObj.toString();
                    } catch (error) {
                        console.error(error);
                    }
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