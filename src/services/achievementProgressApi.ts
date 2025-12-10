import apiClient from './axiosInstance';
import type { AxiosError } from "axios";
import type {AchievementProgress} from "../model/achievementProgress.ts";

const BACKEND_URL: string = import.meta.env.VITE_BACKEND_URL;

export async function getAchievementProgressByUserId(userId: string): Promise<AchievementProgress[]> {
    try {
        const { data } = await apiClient.get<AchievementProgress[]>(
            `${BACKEND_URL}/achievements/user/${userId}`,
        );
        return data;
    } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error(`Failed to fetch achievement progress: ${axiosError.response?.statusText || axiosError.message}`);
    }
}