import { useMutation, useQueryClient } from '@tanstack/react-query';
import { sendFriendRequest, acceptFriendRequest, rejectFriendRequest } from '../services/userApi';
import { useUserProfile } from './useUserProfile';
import React from "react";

const SENT_REQUESTS_KEY = 'sent-friend-requests';

/**
 * Retrieve the list of sent friend requests from local storage.
 */
function getStoredSentRequests(): string[] {
    try {
        const stored = localStorage.getItem(SENT_REQUESTS_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
}

/**
 * Store the list of sent friend requests in local storage.
 */
function storeSentRequests(requests: string[]) {
    localStorage.setItem(SENT_REQUESTS_KEY, JSON.stringify(requests));
}

export function useAcceptFriendRequest() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (senderId: string) => acceptFriendRequest(senderId),
        onSuccess: (_, senderId) => {
            queryClient.invalidateQueries({ queryKey: ['userProfile'] });
            queryClient.invalidateQueries({ queryKey: ['friends'] });
            queryClient.invalidateQueries({ queryKey: ['publicUsers'] });

            queryClient.setQueryData(['sentFriendRequests'], (old: string[] = []) =>
                old.filter(id => id !== senderId)
            );

            const stored = getStoredSentRequests();
            storeSentRequests(stored.filter(id => id !== senderId));
        },
        onError: (error) => {
            console.error('Failed to accept friend request:', error);
        },
    });
}

export function useRejectFriendRequest() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (senderId: string) => rejectFriendRequest(senderId),
        onSuccess: (_, senderId) => {
            queryClient.invalidateQueries({ queryKey: ['userProfile'] });
            queryClient.invalidateQueries({ queryKey: ['friends'] });

            queryClient.setQueryData(['sentFriendRequests'], (old: string[] = []) =>
                old.filter(id => id !== senderId)
            );

            const stored = getStoredSentRequests();
            storeSentRequests(stored.filter(id => id !== senderId));
        },
        onError: (error) => {
            console.error('Failed to reject friend request:', error);
        },
    });
}

export function useSendFriendRequest() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ receiverId }: { receiverId: string; senderId: string }) =>
            sendFriendRequest(receiverId),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['userProfile'] });
            queryClient.invalidateQueries({ queryKey: ['publicUsers'] });
            queryClient.invalidateQueries({ queryKey: ['friends'] });

            queryClient.setQueryData(['sentFriendRequests'], (old: string[] = []) =>
                [...old.filter(id => id !== variables.receiverId), variables.receiverId]
            );

            const current = getStoredSentRequests();
            storeSentRequests([...current.filter(id => id !== variables.receiverId), variables.receiverId]);
        },
        onError: (error) => {
            console.error('Failed to send friend request:', error);
        },
    });
}

export function useFriendshipStatus(userId: string) {
    const { data: profile } = useUserProfile();
    const queryClient = useQueryClient();

    React.useEffect(() => {
        const stored = getStoredSentRequests();
        queryClient.setQueryData(['sentFriendRequests'], stored);
    }, [queryClient]);

    useCleanupSentRequests();

    const sentRequests = queryClient.getQueryData<string[]>(['sentFriendRequests']) || [];

    const isCurrentUser = profile?.id === userId;

    const isFriend = profile?.friends?.some(friend => friend === userId) ?? false;

    const hasIncomingRequest = profile?.friendRequests?.some(
        (request: { senderId: string }) => request.senderId === userId
    ) ?? false;

    const hasOutgoingRequest = sentRequests.includes(userId);

    return {
        isCurrentUser,
        isFriend,
        hasIncomingRequest,
        hasOutgoingRequest,
    };
}

export function useCleanupSentRequests() {
    const { data: profile } = useUserProfile();
    const queryClient = useQueryClient();

    React.useEffect(() => {
        if (profile?.friends) {
            const sentRequests = queryClient.getQueryData<string[]>(['sentFriendRequests']) || [];
            const friends = profile.friends;

            const requestsToRemove = sentRequests.filter(requestId =>
                friends.includes(requestId)
            );

            if (requestsToRemove.length > 0) {
                const newSentRequests = sentRequests.filter(id => !requestsToRemove.includes(id));
                queryClient.setQueryData(['sentFriendRequests'], newSentRequests);

                const stored = getStoredSentRequests();
                const newStored = stored.filter(id => !requestsToRemove.includes(id));
                storeSentRequests(newStored);
            }
        }
    }, [profile?.friends, queryClient]);
}