import {useContext} from 'react';
import SecurityContext from '../context/SecurityContext';
import {useQuery} from "@tanstack/react-query";
import {getSessionsByUserId} from "../services/sessionApi.ts";
import type {Session} from "../model/session.ts";

function useCurrentUser() {
    const { loggedInUser, isAuthenticated } = useContext(SecurityContext);

    return {
        userId: loggedInUser?.profile?.userId || '',
        token: loggedInUser?.accessToken,
        isAuthenticated: isAuthenticated() && !!loggedInUser?.profile?.userId,
        user: loggedInUser
    };
}

export function useSessions() {
    const { userId, token, isAuthenticated } = useCurrentUser();

    const {
        data: sessions = [],
        isLoading: loading,
        error,
        refetch: refresh,
    } = useQuery<Session[], Error>({
        queryKey: ['sessions', userId],
        queryFn: () => getSessionsByUserId(userId, token),
        enabled: isAuthenticated && !!userId,
    });

    return {
        sessions,
        loading,
        error: error ? error.message : null,
        refresh,
    };
}