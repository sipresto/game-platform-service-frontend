import axios from 'axios';
import type {Purchase} from "../model/purchase.ts";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const buyGame = async (gameId: string): Promise<Purchase> => {
    try {
        const response = await axios.post<Purchase>(`${BACKEND_URL}/purchases/${gameId}`);
        return response.data;
    } catch (error) {
        const axiosError = error as { response?: { status: number; statusText: string }; message: string };
        if (axiosError.response?.status === 401) {
            throw new Error('Authentication required to access game details');
        }
        throw new Error(`Failed to fetch game: ${axiosError.response?.statusText || axiosError.message}`);
    }
}