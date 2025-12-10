import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useContext, useEffect, useState } from 'react';
import SecurityContext from '../context/SecurityContext';
import {createLobby, getLobbiesForGame, joinLobby, leaveLobby, startGame} from '../services/lobbyApi';
import type { CreateLobbyRequest, JoinLobbyRequest, Lobby, StartGameRequest } from '../model/lobby';

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
        if (query.data && previousLobbies.length > 0 && !hasRedirected) {
            const currentLobbyIds = new Set(query.data.map(lobby => lobby.id));
            const joinedLobby = previousLobbies.find(lobby =>
                !currentLobbyIds.has(lobby.id) &&
                localStorage.getItem('currentLobbyId') === lobby.id
            );

            if (joinedLobby && gameId) {
                setHasRedirected(true); 
                const gameUrl = `/game/${gameId}/play?lobbyId=${joinedLobby.id}`;
                console.log('Game started! Redirecting to:', gameUrl);
                window.location.href = gameUrl;
            }
        }
        setPreviousLobbies(query.data ?? []);
    }, [query.data, gameId, hasRedirected, previousLobbies]);

    return {
        ...query,
        lobbies: query.data ?? [],
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
        mutationFn: ({lobbyId}: { lobbyId: string; }) =>
            leaveLobby(lobbyId),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['lobbies', gameId]});
        }
    })

    const startMutation = useMutation({
        mutationFn: ({ lobbyId, request }: { lobbyId: string; request: StartGameRequest }) =>
            startGame(lobbyId, request, token),
        onSuccess: (data) => {
            window.location.href = data.url;
        },
    });

    return {
        createLobby: createMutation,
        joinLobby: joinMutation,
        leaveLobby: leaveMutation,
        startGame: startMutation,
    };
}