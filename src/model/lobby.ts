export interface Lobby {
    id: string;
    currentPlayerCount: number;
    isPrivate: boolean;
}

export interface CreateLobbyRequest {
    password?: string | null;
    gameId: string;
}

export interface LobbyPlayer {
    id: string;
    username: string;
}

export interface LobbyDetail {
    id: string;
    gameId: string;
    hostId: string;
    currentPlayerCount: number;
    maxPlayers: number;
    isPrivate: boolean;
    started: boolean;
    gameUrl?: string;
    players: LobbyPlayer[];
}

export interface JoinLobbyRequest {
    password?: string | null;
}


export interface StartGameRequest {
    difficulty: 'EASY' | 'HARD' | 'IMPOSSIBLE';
}

export interface LobbyCreatedResponse {
    id: string;
}

export interface GameUrlResponse {
    url: string;
}