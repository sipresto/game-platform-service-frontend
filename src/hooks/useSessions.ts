import {useQuery} from "@tanstack/react-query";
import {getSessionsForSelf} from "../services/sessionApi.ts";
import type {Session} from "../model/session.ts";

export function useSessions() {
    const {
        data: sessions = [],
        isLoading: loading,
        error,
        refetch: refresh,
    } = useQuery<Session[], Error>({
        queryKey: ['sessions'],
        queryFn: () => getSessionsForSelf(),
    });

    return {
        sessions,
        loading,
        error: error ? error.message : null,
        refresh,
    };
}