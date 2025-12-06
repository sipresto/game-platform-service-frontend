import apiClient from './axiosInstance';
import type { Game } from "../model/game.ts";
import type { UserProfile } from "../model/userProfile.ts";
import type {AxiosError} from "axios";

const BACKEND_URL: string = import.meta.env.VITE_BACKEND_URL;

export async function getOwnedGamesForUser(userId: string): Promise<Game[]> {
    try {
        const { data } = await apiClient.get<Game[]>(
            `${BACKEND_URL}/user/${userId}/games`
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

export async function updateUserPrivacy(
    visibility: 'PUBLIC' | 'FRIENDS_ONLY' | 'PRIVATE'
): Promise<void> {
    try {
        await apiClient.put(
            `${BACKEND_URL}/user/privacy`,
            `"${visibility}"`,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
    } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error(`Failed to update privacy settings: ${axiosError.response?.statusText || axiosError.message}`);
    }
}

export async function getPublicUsers(): Promise<UserProfile[]> {
    const { data } = await apiClient.get<UserProfile[]>(`${BACKEND_URL}/users`);
    return data;
}

export async function getFriendsList(): Promise<UserProfile[]> {
    const { data } = await apiClient.get<UserProfile[]>(`${BACKEND_URL}/friends`);
    return data;
}
