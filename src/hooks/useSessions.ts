import {useQuery} from "@tanstack/react-query";
import {getSessionsByUserId} from "../services/sessionApi.ts";
import type {Session} from "../model/session.ts";
import {useCurrentUser, useUserProfile} from "./useUserProfile.ts";

export function useSessions() {
    const { data: profile } = useUserProfile()
    const { keycloakId, isAuthenticated } = useCurrentUser();

    const {
        data: sessions = [],
        isLoading: loading,
        error,
        refetch: refresh,
    } = useQuery<Session[], Error>({
        queryKey: ['sessions', profile?.id],
        queryFn: () => getSessionsByUserId(profile?.id ?? keycloakId),
        enabled: isAuthenticated && !!keycloakId,
    });

    return {
        sessions,
        loading,
        error: error ? error.message : null,
        refresh,
    };
}