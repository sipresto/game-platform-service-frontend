import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useContext, useEffect, useRef } from 'react';
import SecurityContext from '../context/SecurityContext';
import {
    addBot,
    createLobby,
    getLobbiesForGame,
    getLobbyDetails, invitePlayer,
    joinLobby,
    leaveLobby, removeBot,
    startGame
} from '../services/lobbyApi';
import type {
    CreateLobbyRequest,
    JoinLobbyRequest,
    GameStartRequest,
    RemoveBotRequest, InvitePlayerRequest
} from '../model/lobby';
import { useUserProfile } from "./useUserProfile.ts";

const useToken = () => {
    const { loggedInUser } = useContext(SecurityContext);
    return loggedInUser?.accessToken ?? loggedInUser?.idToken;
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

    const isHost = !!(
        query.data &&
        myUserId &&
        (hostId === myUserId)
    );

    useEffect(() => {
        if (!query.data || redirectAttemptedRef.current || !lobbyId) return;

        const currentLobby = query.data;

        if (currentLobby.started && currentLobby.gameUrl && !redirectAttemptedRef.current) {
            redirectAttemptedRef.current = true;

            let finalUrl = window.location.origin + currentLobby.gameUrl;

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
        mutationFn: ({ lobbyId }: { lobbyId: string; }) =>
            startGame(lobbyId),
        onSuccess: async (gameUrl, variables) => {
            let finalUrl = window.location.origin + gameUrl;

            localStorage.setItem(`game_${variables.lobbyId}_url`, finalUrl);
            sessionStorage.setItem(`game_started_${variables.lobbyId}`, 'true');

            await queryClient.invalidateQueries({ queryKey: ['lobbies', gameId] });
            await queryClient.invalidateQueries({ queryKey: ['lobby', variables.lobbyId] });

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

    const addBotMutation = useMutation({
        mutationFn: ({ lobbyId, request }: { lobbyId: string; request: GameStartRequest }) =>
            addBot(lobbyId, request),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['lobbies', gameId] });
        },
    });

    const removeBotMutation = useMutation({
        mutationFn: ({ lobbyId, request }: { lobbyId: string; request: RemoveBotRequest }) =>
            removeBot(lobbyId, request),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['lobbies', gameId] });
        },
    });

    const invitePlayerMutation = useMutation({
        mutationFn: ({lobbyId, request}: { lobbyId: string; request: InvitePlayerRequest }) =>
            invitePlayer(lobbyId, request),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['lobbies', gameId] });
        },
    })

    return {
        createLobby: createMutation,
        joinLobby: joinMutation,
        leaveLobby: leaveMutation,
        startGame: startMutation,
        addBot: addBotMutation,
        removeBot: removeBotMutation,
        invitePlayer: invitePlayerMutation,
    };
}