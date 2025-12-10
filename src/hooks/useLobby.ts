import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useContext, useEffect, useState } from 'react';
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
    Lobby,
    StartGameRequest
} from '../model/lobby';

const useToken = () => {
    const { loggedInUser } = useContext(SecurityContext);
    return loggedInUser?.accessToken ?? loggedInUser?.idToken ?? localStorage.getItem('accessToken');
};


export function useLobbies(gameId: string | undefined) {
    const token = useToken();
    const [previousLobbies, setPreviousLobbies] = useState<Lobby[]>([]);
    const [hasRedirected, setHasRedirected] = useState(false);

    const query = useQuery({
        queryKey: ['lobbies', gameId],
        queryFn: () => getLobbiesForGame(gameId!),
        enabled: !!gameId && !!token,
        refetchInterval: 1000,
    });

    useEffect(() => {
        if (!query.data || previousLobbies.length === 0 || hasRedirected) {
            setPreviousLobbies(query.data ?? []);
            return;
        }

        const currentLobbyIds = new Set(query.data.map(lobby => lobby.id));
        const currentLobbyId = localStorage.getItem('currentLobbyId');

        if (!currentLobbyId) {
            setPreviousLobbies(query.data);
            return;
        }

        const joinedLobby = previousLobbies.find(
            lobby => !currentLobbyIds.has(lobby.id) && lobby.id === currentLobbyId
        );

        if (joinedLobby && gameId) {
            setHasRedirected(true);
            localStorage.removeItem('currentLobbyId');
            window.location.href = `/game/${gameId}/play?lobbyId=${joinedLobby.id}`;
        }

        setPreviousLobbies(query.data);
    }, [query.data, gameId, hasRedirected, previousLobbies]);

    return {
        ...query,
        lobbies: query.data ?? [],
    };
}

export function useLobbyDetail(lobbyId: string | undefined) {
    const { loggedInUser } = useContext(SecurityContext);

    const query = useQuery({
        queryKey: ['lobby', lobbyId],
        queryFn: () => getLobbyDetails(lobbyId!),
        enabled: !!lobbyId,
        refetchInterval: 2000,
    });

    const myUserId = loggedInUser?.profile?.userId;
    const myUsername = loggedInUser?.username;
    const hostId = query.data?.hostId;

    const isHost = !!(
        query.data &&
        loggedInUser &&
        (
            hostId === myUserId ||
            hostId === myUsername ||
            query.data.players?.some(
                (player) =>
                    player.id === hostId &&
                    (player.id === myUserId || player.username === myUsername)
            )
        )
    );

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
    });

    return {
        createLobby: createMutation,
        joinLobby: joinMutation,
        leaveLobby: leaveMutation,
        startGame: startMutation,
    };
}