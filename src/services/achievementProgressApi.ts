import apiClient from './axiosInstance';
import type {AchievementProgress} from "../model/achievementProgress.ts";

const BACKEND_URL: string = import.meta.env.VITE_BACKEND_URL;

export async function getAchievementProgressByUserId(userId: string): Promise<AchievementProgress[]> {
    const {data} = await apiClient.get<AchievementProgress[]>(
        `${BACKEND_URL}/achievements/user/${userId}`,
    );
    return data;
}