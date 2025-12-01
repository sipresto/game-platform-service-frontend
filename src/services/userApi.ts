import axios from 'axios';
import type {Game} from "../model/game.ts";

const BACKEND_URL: string = import.meta.env.VITE_BACKEND_URL;

const getAuthHeaders = (token?: string | null) => {
    const accessToken = token ?? localStorage.getItem('accessToken');
    return accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
};

export async function getOwnedGamesForUser(userId: string, token?: string | null): Promise<Game[]> {
    try {
        const { data } = await axios.get<Game[]>(
            `${BACKEND_URL}/user/${userId}/games`,
            { headers: getAuthHeaders(token) }
        );
        return data;
    } catch (error) {
        const axiosError = error as { response?: { status: number; statusText: string }; message: string };
        if (axiosError.response?.status === 404) {
            return [];
        }
        throw new Error(`Failed to fetch owned games: ${axiosError.response?.statusText || axiosError.message}`);
    }
}

export async function updateUserPrivacy(
    visibility: 'PUBLIC' | 'FRIENDS_ONLY' | 'PRIVATE',
    token?: string | null
): Promise<void> {
    try {
        await axios.put(
            `${BACKEND_URL}/user/privacy`,
            `"${visibility}"`,
            {
                headers: {
                    ...getAuthHeaders(token),
                    'Content-Type': 'application/json',
                },
            }
        );
    } catch (error) {
        const axiosError = error as { response?: { status: number; statusText: string }; message: string };
        throw new Error(`Failed to update privacy settings: ${axiosError.response?.statusText || axiosError.message}`);
    }
}