import { useMutation, useQueryClient } from '@tanstack/react-query';
import { sendFriendRequest, acceptFriendRequest, rejectFriendRequest } from '../services/userApi';
import { useUserProfile } from './useUserProfile';

export function useSendFriendRequest() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ receiverId }: { receiverId: string; senderId: string }) =>
            sendFriendRequest(receiverId),
        onSuccess: () => {
            // Invalidate to refresh with updated outgoingFriendRequests
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

export function useFriendshipStatus(targetUserId: string) {
    const { data: profile } = useUserProfile();

    if (!profile) {
        return {
            isCurrentUser: false,
            isFriend: false,
            hasIncomingRequest: false,
            hasOutgoingRequest: false,
        };
    }

    const isCurrentUser = profile.id === targetUserId;

    const isFriend = profile.friends?.some(friendId => friendId === targetUserId) ?? false;

    // Check if target user sent a request to current user
    const hasIncomingRequest = profile.incomingFriendRequests?.some(
        request => request.senderId === targetUserId
    ) ?? false;

    // Check if current user sent a request to target user
    const hasOutgoingRequest = profile.outgoingFriendRequests?.some(
        request => request.receiverId === targetUserId
    ) ?? false;

    return {
        isCurrentUser,
        isFriend,
        hasIncomingRequest,
        hasOutgoingRequest,
    };
}