import axios from 'axios';
import type {
    Lobby,
    CreateLobbyRequest,
    JoinLobbyRequest,
    StartGameRequest,
    LobbyCreatedResponse,
    GameUrlResponse
} from '../model/lobby';

const BACKEND_URL: string = import.meta.env.VITE_BACKEND_URL;

const getAuthHeaders = (token?: string | null) => {
    const accessToken = token ?? localStorage.getItem('accessToken');
    return accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
};

export async function getLobbiesForGame(gameId: string, token?: string | null): Promise<Lobby[]> {
    const { data } = await axios.get<Lobby[]>(
        `${BACKEND_URL}/lobbies/${gameId}`,
        { headers: getAuthHeaders(token) }
    );
    return data;
}

export async function createLobby(
    request: CreateLobbyRequest,
    token?: string | null
): Promise<LobbyCreatedResponse> {
    const { data } = await axios.post<LobbyCreatedResponse>(
        `${BACKEND_URL}/lobbies`,
        request,
        { headers: getAuthHeaders(token) }
    );
    return data;
}

export async function joinLobby(
    lobbyId: string,
    request: JoinLobbyRequest,
    token?: string | null
): Promise<void> {
    await axios.post(
        `${BACKEND_URL}/lobbies/${lobbyId}/join`,
        request,
        { headers: getAuthHeaders(token) }
    );
}

export async function startGame(
    lobbyId: string,
    request: StartGameRequest,
    token?: string | null
): Promise<GameUrlResponse> {
    const { data } = await axios.post<GameUrlResponse>(
        `${BACKEND_URL}/lobbies/${lobbyId}/start`,
        request,
        { headers: getAuthHeaders(token) }
    );

    let finalUrl = data.url;

    if (token) {
        try {
            localStorage.setItem('gameAccessToken', token);
            sessionStorage.setItem('gameAccessToken', token);
        } catch (error) {
            console.warn('Failed to store game access token:', error);
        }
    }

    if (token && data.url) {
        try {
            let baseUrl = data.url;

            if (data.url.startsWith('/')) {
                baseUrl = window.location.origin + data.url;
            }

            const urlObj = new URL(baseUrl);
            urlObj.searchParams.set('token', token);
            finalUrl = urlObj.toString();

        } catch (error) {
            console.warn('Failed to construct game URL with token:', error);
            finalUrl = data.url;
        }
    }

    return {
        ...data,
        url: finalUrl
    };
}