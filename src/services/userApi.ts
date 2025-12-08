import apiClient from './axiosInstance';
import type { UserProfile } from "../model/userProfile.ts";
import type {AxiosError} from "axios";

const BACKEND_URL: string = import.meta.env.VITE_BACKEND_URL;

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
