import {useContext} from "react";
import SecurityContext from "../context/SecurityContext.ts";
import {useMutation, useQuery} from "@tanstack/react-query";
import {getNotifications, markNotificationRead} from "../services/notificationApi.ts";

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