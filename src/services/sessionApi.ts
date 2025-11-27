import axios from 'axios';
import type { Session } from "../model/session.ts";

const BACKEND_URL: string = import.meta.env.VITE_BACKEND_URL;

const getAuthHeaders = (token?: string | null) => {
    const accessToken = token ?? localStorage.getItem('accessToken');
    return accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
};

export async function getSessionsByUserId(userId: string, token?: string | null): Promise<Session[]> {
    try {
        const { data } = await axios.get<Session[]>(
            `${BACKEND_URL}/session/${userId}`,
            { headers: getAuthHeaders(token) }
        );
        return data;
    } catch (error) {
        const axiosError = error as { response?: { status: number; statusText: string }; message: string };
        if (axiosError.response?.status === 404) {
            return [];
        }
        throw new Error(`Failed to fetch sessions: ${axiosError.response?.statusText || axiosError.message}`);
    }
}