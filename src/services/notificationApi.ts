import type {Notification} from "../model/Notification.ts";
import apiClient from "./axiosInstance.ts";
import type {NotificationChannel, NotificationPreferences, NotificationType} from "../model/notificationPreferences.ts";

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

export async function getNotificationPreferences(): Promise<NotificationPreferences> {
    const { data } = await apiClient.get<NotificationPreferences>(
        `${BACKEND_URL}/notifications/preferences`
    );
    return data;
}

export async function updateNotificationPreference(
    notificationType: NotificationType,
    channel: NotificationChannel,
    enabled: boolean
): Promise<void> {
    await apiClient.put(
        `${BACKEND_URL}/notifications/preferences/${notificationType}/${channel}`,
        null,
        {
            params: { enabled }
        }
    );
}