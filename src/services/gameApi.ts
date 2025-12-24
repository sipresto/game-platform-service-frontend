import apiClient from './axiosInstance';
import type { Game, LibraryGame } from '../model/game';
import type { GameFilterRequest } from '../model/gameRequest';
import type { AxiosError } from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function extractError(error: unknown): { status?: number; statusText?: string; message: string } {
    const axiosError = error as AxiosError;
    return {
        status: axiosError.response?.status,
        statusText: axiosError.response?.statusText,
        message: axiosError.message,
    };
}

export const getGames = async (
    filter: GameFilterRequest | null
): Promise<Game[]> => {
    try {
        const response = await apiClient.post<Game[]>(
            `${BACKEND_URL}/games/filter`,
            filter ?? {}
        );

        return response.data;
    } catch (error) {
        const err = extractError(error);

        throw new Error(`Failed to fetch games: ${err.statusText || err.message}`);
    }
};

export const getGameById = async (gameId: string): Promise<Game> => {
    try {
        const response = await apiClient.get<Game>(
            `${BACKEND_URL}/games/${gameId}`
        );

        return response.data;
    } catch (error) {
        const err = extractError(error);

        throw new Error(`Failed to fetch game: ${err.statusText || err.message}`);
    }
};

export async function getOwnedGamesForUser(userId: string): Promise<LibraryGame[]> {
    try {
        const { data } = await apiClient.get<LibraryGame[]>(
            `${BACKEND_URL}/games/user/${userId}`
        );

        return data;
    } catch (error) {
        const axiosError = error as AxiosError;

        throw new Error(`Failed to fetch owned games: ${axiosError.response?.statusText || axiosError.message}`);
    }
}
