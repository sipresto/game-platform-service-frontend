import {useQuery} from "@tanstack/react-query";
import {getSessionsByUserId} from "../services/sessionApi.ts";
import type {Session} from "../model/session.ts";
import {useCurrentUser} from "./useUserProfile.ts";

export function useSessions() {
    const { userId, isAuthenticated } = useCurrentUser();

    const {
        data: sessions = [],
        isLoading: loading,
        error,
        refetch: refresh,
    } = useQuery<Session[], Error>({
        queryKey: ['sessions', userId],
        queryFn: () => getSessionsByUserId(userId),
        enabled: isAuthenticated && !!userId,
    });

    return {
        sessions,
        loading,
        error: error ? error.message : null,
        refresh,
    };
}