import axios, { AxiosError } from 'axios';
import type { Game } from '../model/game';
import type { GameFilterRequest } from '../model/gameRequest';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function authHeaders(token?: string | null): Record<string, string> {
    const accessToken = token ?? localStorage.getItem('accessToken');
    const headers: Record<string, string> = {};

    if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
    }

    return headers;
}

function extractError(error: unknown): { status?: number; statusText?: string; message: string } {
    const axiosError = error as AxiosError;

    return {
        status: axiosError.response?.status,
        statusText: axiosError.response?.statusText,
        message: axiosError.message,
    };
}

export const fetchGames = async (token?: string | null): Promise<Game[]> => {
    try {
        const response = await axios.get<Game[]>(
            `${BACKEND_URL}/games`,
            { headers: authHeaders(token) }
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
    filter: GameFilterRequest,
    token?: string | null
): Promise<Game[]> => {
    try {
        const response = await axios.post<Game[]>(
            `${BACKEND_URL}/games/filter`,
            filter,
            { headers: authHeaders(token) }
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

export const getGameById = async (gameId: string, token?: string | null): Promise<Game> => {
    try {
        const response = await axios.get<Game>(
            `${BACKEND_URL}/games/${gameId}`,
            { headers: authHeaders(token) }
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
