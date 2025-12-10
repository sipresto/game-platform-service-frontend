import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {useContext, useEffect, useRef, useState} from 'react';
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
        refetchInterval: 1500,
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
    const redirectAttemptedRef = useRef(false);

    const query = useQuery({
        queryKey: ['lobby', lobbyId],
        queryFn: () => getLobbyDetails(lobbyId!),
        enabled: !!lobbyId,
        refetchInterval: 2000,
    });

    const myUserId = loggedInUser?.profile?.keycloakId;
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

    // Detect when game has started and redirect using gameUrl from lobby details
    useEffect(() => {
        if (!query.data || redirectAttemptedRef.current || !lobbyId) return;

        const currentLobby = query.data;

        // Check if game has started via the started flag AND we have a gameUrl
        if (currentLobby.started && currentLobby.gameUrl && !redirectAttemptedRef.current) {
            console.log('Game started with URL from backend:', currentLobby.gameUrl);
            redirectAttemptedRef.current = true;

            // Transform the URL for platform access
            let finalUrl = currentLobby.gameUrl;

            // If it's a direct game server URL (port 5174), transform it to go through platform (port 5173)
            if (finalUrl.includes('localhost:5174')) {
                finalUrl = finalUrl.replace('http://localhost:5174', window.location.origin);
                console.log('Transformed URL for platform:', finalUrl);
            }

            // Add current user's token
            const token = loggedInUser?.accessToken ?? loggedInUser?.idToken;
            if (token) {
                try {
                    const urlObj = new URL(finalUrl);
                    urlObj.searchParams.set('token', token);

                    // Store token for the game page
                    localStorage.setItem('gameAccessToken', token);
                    sessionStorage.setItem('gameAccessToken', token);

                    finalUrl = urlObj.toString();
                    console.log('Final URL with token:', finalUrl);
                } catch (error) {
                    console.error('Failed to add token to URL:', error);
                }
            }

            // Store in localStorage for backup/consistency
            localStorage.setItem(`game_${lobbyId}_url`, finalUrl);

            setTimeout(() => {
                console.log('Redirecting non-host to game:', finalUrl);
                window.location.href = finalUrl;
            }, 300);
        } else if (currentLobby.started && !currentLobby.gameUrl) {
            // Game started but no URL in response - this shouldn't happen if backend is fixed
            console.error('Game started but gameUrl is missing from lobby details');
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
            console.log('Game URL returned by backend:', data.url);

            // Transform the URL for platform access
            let finalUrl = data.url;
            if (finalUrl.includes('localhost:5174')) {
                finalUrl = finalUrl.replace('http://localhost:5174', window.location.origin);
                console.log('Transformed URL for platform (host):', finalUrl);
            }

            // Store game URL with lobby ID as key
            localStorage.setItem(`game_${variables.lobbyId}_url`, finalUrl);

            // Also store in sessionStorage for same-tab detection
            sessionStorage.setItem(`game_started_${variables.lobbyId}`, 'true');

            // Invalidate queries to trigger refetch
            queryClient.invalidateQueries({ queryKey: ['lobbies', gameId] });
            queryClient.invalidateQueries({ queryKey: ['lobby', variables.lobbyId] });

            // Redirect host with their token
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

            console.log('Host redirecting to:', finalUrl);

            // Small delay for UX
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