import apiClient from './axiosInstance';
import type { Purchase } from "../model/purchase.ts";
import type {AxiosError} from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const buyGame = async (gameId: string): Promise<Purchase> => {
    try {
        const response = await apiClient.post<Purchase>(
            `${BACKEND_URL}/purchases/${gameId}`
        );
        return response.data;
    } catch (error) {
        const axiosError = error as AxiosError;
        if (axiosError.response?.status === 401) {
            throw new Error('Authentication required to access game details');
        }
        throw new Error(`Failed to fetch game: ${axiosError.response?.statusText || axiosError.message}`);
    }
}
