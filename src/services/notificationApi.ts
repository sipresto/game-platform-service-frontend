import type {Notification} from "../model/Notification.ts";
import apiClient from "./axiosInstance.ts";

const BACKEND_URL: string = import.meta.env.VITE_BACKEND_URL;

export async function getNotifications(): Promise<Notification[]> {
    const { data } = await apiClient.get<Notification[]>(
        `${BACKEND_URL}/notifications`,
    );
    return data;
}

export async function markNotificationRead(notificationId: string): Promise<void> {
    await apiClient.patch(`${BACKEND_URL}/notifications/${notificationId}/read`);
}