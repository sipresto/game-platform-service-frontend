import {useContext} from "react";
import SecurityContext from "../context/SecurityContext.ts";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
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

const useToken = () => {
    const { loggedInUser } = useContext(SecurityContext);
    return loggedInUser?.accessToken ?? loggedInUser?.idToken;
};

export function useNotifications() {
    const token = useToken();

    const query = useQuery({
        queryKey: ['notifications'],
        queryFn: () => getNotifications(),
        enabled: !!token,
        refetchInterval: 60 * 1000,
    });

    const markReadMutation = useMutation({
        mutationFn: (notificationId: string) => markNotificationRead(notificationId),
        onSuccess: () => {
            query.refetch();
        }
    });

    return {
        ...query,
        notifications: query.data ?? [],
        markNotificationRead: markReadMutation.mutate,
    };
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