import apiClient from './axiosInstance';
import type { Game, LibraryGame } from '../model/game';
import type { GameFilterRequest } from '../model/gameRequest';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const getGames = async (
    filter: GameFilterRequest | null
): Promise<Game[]> => {
    const response = await apiClient.post<Game[]>(
        `${BACKEND_URL}/games/browse/filter`,
        filter ?? {}
    );
    return response.data;
};

export const getGameById = async (gameId: string): Promise<Game> => {
    const response = await apiClient.get<Game>(
        `${BACKEND_URL}/games/browse/${gameId}`
    );
    return response.data;
};

export async function getMyOwnedGames(): Promise<LibraryGame[]> {
    const { data } = await apiClient.get<LibraryGame[]>(
        `${BACKEND_URL}/games/library`
    );
    return data;
}


export async function getOwnedGamesForUser(userId: string): Promise<LibraryGame[]> {
    const { data } = await apiClient.get<LibraryGame[]>(
        `${BACKEND_URL}/games/library/user/${userId}`
    );
    return data;
}
