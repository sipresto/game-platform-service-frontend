import apiClient from './axiosInstance';
import type {
    Lobby,
    CreateLobbyRequest,
    JoinLobbyRequest,
    StartGameRequest,
    LobbyCreatedResponse,
    GameUrlResponse, LobbyDetail
} from '../model/lobby';

const BACKEND_URL: string = import.meta.env.VITE_BACKEND_URL;

export async function getLobbiesForGame(gameId: string): Promise<Lobby[]> {
    const { data } = await apiClient.get<Lobby[]>(
        `${BACKEND_URL}/lobbies/game/${gameId}`
    );
    return data;
}

export async function getLobbyDetails(lobbyId: string): Promise<LobbyDetail> {
    const { data } = await apiClient.get<LobbyDetail>(
        `${BACKEND_URL}/lobbies/${lobbyId}`
    );
    return data;
}

export async function createLobby(
    request: CreateLobbyRequest
): Promise<LobbyCreatedResponse> {
    const { data } = await apiClient.post<LobbyCreatedResponse>(
        `${BACKEND_URL}/lobbies`,
        request
    );
    return data;
}

export async function joinLobby(
    lobbyId: string,
    request: JoinLobbyRequest
): Promise<void> {
    await apiClient.post(
        `${BACKEND_URL}/lobbies/${lobbyId}/join`,
        request
    );
}

export async function leaveLobby(
    lobbyId: string
): Promise<void> {
    await apiClient.post(
        `${BACKEND_URL}/lobbies/${lobbyId}/leave`
    );
}

export async function startGame(
    lobbyId: string,
    request: StartGameRequest,
    token?: string | null
): Promise<GameUrlResponse> {
    const { data } = await apiClient.post<GameUrlResponse>(
        `${BACKEND_URL}/lobbies/${lobbyId}/start`,
        request
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
            console.log("redirecting too url: ", urlObj.toString());
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
