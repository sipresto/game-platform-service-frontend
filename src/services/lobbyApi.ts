import apiClient from './axiosInstance';
import type {
    CreateLobbyRequest,
    GameUrlResponse,
    JoinLobbyRequest,
    Lobby,
    LobbyCreatedResponse,
    LobbyDetail,
    GameStartRequest, RemoveBotRequest
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
    lobbyId: string
): Promise<string> {
    const { data } = await apiClient.post<GameUrlResponse>(
        `${BACKEND_URL}/lobbies/${lobbyId}/start`
    );
    return data.url;
}

export async function addBot(
    lobbyId: string,
    request: GameStartRequest
): Promise<void> {
    await apiClient.patch(
        `${BACKEND_URL}/lobbies/${lobbyId}/addBot`,
        request
    )
}

export async function removeBot(
    lobbyId: string,
    botNumber: RemoveBotRequest
): Promise<void> {
    await apiClient.patch(
        `${BACKEND_URL}/lobbies/${lobbyId}/removeBot`,
        botNumber
    )
}
