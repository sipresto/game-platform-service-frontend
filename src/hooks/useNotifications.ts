import { useContext } from "react";
import SecurityContext from "../context/SecurityContext.ts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    getNotificationPreferences,
    getNotifications,
    markNotificationRead,
    updateNotificationPreference
} from "../services/notificationApi.ts";
import type {
    NotificationChannel,
    NotificationPreferenceUpdate,
    NotificationType
} from "../model/notificationPreferences.ts";
import type { Notification } from "../model/notification.ts";
import { useCurrentUser } from "./useUserProfile.ts";

const useToken = () => {
    const { loggedInUser } = useContext(SecurityContext);
    return loggedInUser?.accessToken ?? loggedInUser?.idToken;
};

export function useNotifications() {
    const { isAuthenticated } = useCurrentUser();

    const { data: notifications, isLoading, error } = useQuery<Notification[]>({
        queryKey: ['notifications'],
        queryFn: getNotifications,
        enabled: isAuthenticated,
        refetchInterval: 10 * 1000,
    })
    return {
        notifications,
        isLoading,
        error
    }
}

export function useReadNotifications() {
    const queryClient = useQueryClient();

    const { mutate: readNotification } = useMutation({
        mutationFn: (notificationId: string) => markNotificationRead(notificationId),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['notifications'] });
        }
    })

    return { readNotification };
}

export function useNotificationPreferences() {
    const token = useToken();
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ['notificationPreferences'],
        queryFn: () => getNotificationPreferences(),
        enabled: !!token,
    });

    const updateMutation = useMutation({
        mutationFn: ({ notificationType, channel, enabled }: NotificationPreferenceUpdate) =>
            updateNotificationPreference(notificationType, channel, enabled),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notificationPreferences'] });
        }
    });

    const togglePreference = (
        notificationType: NotificationType,
        channel: NotificationChannel,
        enabled: boolean
    ) => {
        updateMutation.mutate({ notificationType, channel, enabled });
    };

    return {
        preferences: query.data,
        isLoading: query.isLoading,
        error: query.error,
        isUpdating: updateMutation.isPending,
        updateError: updateMutation.error,
        togglePreference,
    };
}