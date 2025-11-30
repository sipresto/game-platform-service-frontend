import axios, { AxiosError } from 'axios';
import type { Purchase } from "../model/purchase";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function getAuthHeaders(token?: string | null): Record<string, string> {
    const accessToken = token ?? localStorage.getItem('accessToken');
    return accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
}

function extractError(error: unknown): { status?: number; statusText?: string; message: string } {
    const axiosError = error as AxiosError;
    return {
        status: axiosError.response?.status,
        statusText: axiosError.response?.statusText,
        message: axiosError.message
    };
}

export const buyGame = async (
    gameId: string,
    token?: string | null
): Promise<Purchase> => {
    try {
        const response = await axios.post<Purchase>(
            `${BACKEND_URL}/purchases/${gameId}`,
            null,
            { headers: getAuthHeaders(token) }
        );
        return response.data;
    } catch (error) {
        const err = extractError(error);

        if (err.status === 401) {
            throw new Error('Authentication required to access game details');
        }

        throw new Error(`Failed to purchase game: ${err.statusText || err.message}`);
    }
};
