import apiClient from './axiosInstance';
import type { UserProfile } from '../model/userProfile.ts';

const BACKEND_URL: string = import.meta.env.VITE_BACKEND_URL;

export async function getUserProfile(): Promise<UserProfile> {
    const { data } = await apiClient.get<UserProfile>(`${BACKEND_URL}/user`);
    return data;
}

export async function updateUserProfile(profileData: { displayName: string; bio: string }): Promise<UserProfile> {
    const { data } = await apiClient.put<UserProfile>(
        `${BACKEND_URL}/user/profile`,
        {
            displayName: profileData.displayName,
            bio: profileData.bio
        }
    );
    return data;
}
