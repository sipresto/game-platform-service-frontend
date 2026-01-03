export interface Lobby {
    id: string;
    currentPlayerCount: number;
    isPrivate: boolean;
}

export interface CreateLobbyRequest {
    password?: string | null;
    maxPlayers: number;
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
    bots: BotDifficulty[]
}

export interface JoinLobbyRequest {
    password?: string | null;
}

export interface GameStartRequest {
    difficulty: 'EASY' | 'HARD' | 'IMPOSSIBLE';
}

export type BotDifficulty = 'EASY' | 'HARD' | 'IMPOSSIBLE';

export interface RemoveBotRequest {
    botNumber: number;
}

export interface LobbyCreatedResponse {
    id: string;
}

export interface GameUrlResponse {
    url: string;
}