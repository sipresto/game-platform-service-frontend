import axios from 'axios';
import type { UserProfile } from '../model/userProfile.ts';

const BACKEND_URL: string = import.meta.env.VITE_BACKEND_URL;

export async function getUserProfile(token?: string | null) {
    const accessToken = token ?? localStorage.getItem('accessToken');

    const headers: Record<string, string> = {};
    if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const { data } = await axios.get<UserProfile>(`${BACKEND_URL}/user/profile`, {
        headers,
    });
    return data;
}
