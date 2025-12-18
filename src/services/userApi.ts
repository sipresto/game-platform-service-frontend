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

export async function uploadProfileImage(file: File): Promise<void> {
    const formData = new FormData();
    formData.append('image', file);

    try {
        await apiClient.put(
            `${BACKEND_URL}/me/profile-image`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
    } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error(`Failed to upload profile image: ${axiosError.response?.statusText || axiosError.message}`);
    }
}

export async function removeProfileImage(): Promise<void> {
    try {
        await apiClient.delete(`${BACKEND_URL}/me/delete/profile-image`);
    } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error(`Failed to remove profile image: ${axiosError.response?.statusText || axiosError.message}`);
    }
}
