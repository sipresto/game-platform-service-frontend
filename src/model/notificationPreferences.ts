export type NotificationType = 'FRIEND_REQUEST' | 'ACHIEVEMENT' | 'YOUR_TURN' | 'CHAT_MESSAGE';
export type NotificationChannel = 'IN_APP' | 'EMAIL';

export type NotificationPreferences = {
    [key in NotificationType]: {
        [channel in NotificationChannel]: boolean;
    };
};

export interface NotificationPreferenceUpdate {
    notificationType: NotificationType;
    channel: NotificationChannel;
    enabled: boolean;
}

export const notificationTypeLabels: Record<NotificationType, string> = {
    FRIEND_REQUEST: 'Friend Requests',
    ACHIEVEMENT: 'Achievements',
    YOUR_TURN: 'Your Turn',
    CHAT_MESSAGE: 'Chat Message'
};

export const notificationChannelLabels: Record<NotificationChannel, string> = {
    IN_APP: 'In-App',
    EMAIL: 'Email'
};

export const NOTIFICATION_TYPES = {
    FRIEND_REQUEST: 'FRIEND_REQUEST' as NotificationType,
    ACHIEVEMENT: 'ACHIEVEMENT' as NotificationType,
    YOUR_TURN: 'YOUR_TURN' as NotificationType,
    CHAT_MESSAGE: 'CHAT_MESSAGE' as NotificationType
};

export const NOTIFICATION_CHANNELS = {
    IN_APP: 'IN_APP' as NotificationChannel,
    EMAIL: 'EMAIL' as NotificationChannel,
};