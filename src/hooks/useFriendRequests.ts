import { useMutation, useQueryClient } from '@tanstack/react-query';
import { sendFriendRequest, acceptFriendRequest, rejectFriendRequest } from '../services/userApi';
import {useUserProfile} from './useUserProfile';

export function useSendFriendRequest() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ receiverId, senderId }: { receiverId: string; senderId: string }) =>
            sendFriendRequest(receiverId, senderId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['userProfile'] });
            queryClient.invalidateQueries({ queryKey: ['publicUsers'] });
            queryClient.invalidateQueries({ queryKey: ['friends'] });
        },
        onError: (error) => {
            console.error('Failed to send friend request:', error);
        },
    });
}

export function useAcceptFriendRequest() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (senderId: string) => acceptFriendRequest(senderId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['userProfile'] });
            queryClient.invalidateQueries({ queryKey: ['friends'] });
            queryClient.invalidateQueries({ queryKey: ['publicUsers'] });
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
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['userProfile'] });
            queryClient.invalidateQueries({ queryKey: ['friends'] });
        },
        onError: (error) => {
            console.error('Failed to reject friend request:', error);
        },
    });
}

export function useFriendshipStatus(userId: string) {
    const { data: profile } = useUserProfile();

    const isCurrentUser = profile?.id === userId;

    const isFriend = profile?.friends?.some(friend => friend === userId) ?? false;

    const hasIncomingRequest = profile?.friendRequests?.some(
        (request: { senderId: string; }) => request.senderId === userId
    ) ?? false;

    return {
        isCurrentUser,
        isFriend,
        hasIncomingRequest,
    };
}