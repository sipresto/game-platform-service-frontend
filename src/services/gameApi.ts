import apiClient from './axiosInstance';
import type { Game } from '../model/game';
import type { GameFilterRequest } from '../model/gameRequest';
import type {AxiosError} from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function extractError(error: unknown): { status?: number; statusText?: string; message: string } {
    const axiosError = error as AxiosError;
    return {
        status: axiosError.response?.status,
        statusText: axiosError.response?.statusText,
        message: axiosError.message,
    };
}

export const fetchGames = async (): Promise<Game[]> => {
    try {
        const response = await apiClient.get<Game[]>(
            `${BACKEND_URL}/games`
        );
        return response.data;
    } catch (error) {
        const err = extractError(error);
        if (err.status === 404) {
            return [];
        }
        throw new Error(`Failed to fetch games: ${err.statusText || err.message}`);
    }
};

export const filterGames = async (
    filter: GameFilterRequest
): Promise<Game[]> => {
    try {
        const response = await apiClient.post<Game[]>(
            `${BACKEND_URL}/games/filter`,
            filter
        );
        return response.data;
    } catch (error) {
        const err = extractError(error);
        if (err.status === 404) {
            return [];
        }
        throw new Error(`Failed to filter games: ${err.statusText || err.message}`);
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
        if (err.status === 401) {
            throw new Error('Authentication required to access game details');
        }
        throw new Error(`Failed to fetch game: ${err.statusText || err.message}`);
    }
};

export async function getOwnedGamesForUser(userId: string): Promise<Game[]> {
    try {
        const { data } = await apiClient.get<Game[]>(
            `${BACKEND_URL}/games/user/${userId}`
        );
        return data;
    } catch (error) {
        const axiosError = error as AxiosError;
        if (axiosError.response?.status === 404) {
            return [];
        }
        throw new Error(`Failed to fetch owned games: ${axiosError.response?.statusText || axiosError.message}`);
    }
}
