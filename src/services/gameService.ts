import axios from 'axios';
import type {Game} from '../model/game';
import type {GameFilterRequest} from "../model/gameRequest.ts";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const fetchGames = async (): Promise<Game[]> => {
    try {
        const response = await axios.get<Game[]>(`${BACKEND_URL}/games`);
        return response.data;
    } catch (error) {
        const axiosError = error as { response?: { status: number; statusText: string }; message: string };
        if (axiosError.response?.status === 404) {
            return [];
        }
        throw new Error(`Failed to fetch games: ${axiosError.response?.statusText || axiosError.message}`);
    }
};

export const filterGames = async (filter: GameFilterRequest): Promise<Game[]> => {
    try {
        const response = await axios.post<Game[]>(`${BACKEND_URL}/games/filter`, filter);
        return response.data;
    } catch (error) {
        const axiosError = error as { response?: { status: number; statusText: string }; message: string };
        if (axiosError.response?.status === 404) {
            return [];
        }
        throw new Error(`Failed to filter games: ${axiosError.response?.statusText || axiosError.message}`);
    }
};

export const getGameById = async (gameId: string): Promise<Game> => {
    try {
        const response = await axios.get<Game>(`${BACKEND_URL}/games/${gameId}`);
        return response.data;
    } catch (error) {
        const axiosError = error as { response?: { status: number; statusText: string }; message: string };
        if (axiosError.response?.status === 401) {
            throw new Error('Authentication required to access game details');
        }
        throw new Error(`Failed to fetch game: ${axiosError.response?.statusText || axiosError.message}`);
    }
};