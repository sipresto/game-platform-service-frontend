import { useMutation, useQueryClient } from '@tanstack/react-query';
import { sendFriendRequest, acceptFriendRequest, rejectFriendRequest } from '../services/userApi';
import { useUserProfile } from './useUserProfile';

export function useSendFriendRequest() {
    const queryClient = useQueryClient();

    const { mutate: sendFriendRequestMutate, isPending } = useMutation({
        mutationFn: ({ receiverId }: { receiverId: string; senderId: string }) =>
            sendFriendRequest(receiverId),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['userProfile'] });
            await queryClient.invalidateQueries({ queryKey: ['publicUsers'] });
            await queryClient.invalidateQueries({ queryKey: ['friends'] });
        },
    });

    return { sendFriendRequest: sendFriendRequestMutate, isPending };
}

export function useAcceptFriendRequest() {
    const queryClient = useQueryClient();

    const { mutate: acceptFriendRequestMutate, isPending } = useMutation({
        mutationFn: (senderId: string) => acceptFriendRequest(senderId),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['userProfile'] });
            await queryClient.invalidateQueries({ queryKey: ['friends'] });
            await queryClient.invalidateQueries({ queryKey: ['publicUsers'] });
        },
    });

    return { acceptFriendRequest: acceptFriendRequestMutate, isPending };
}

export function useRejectFriendRequest() {
    const queryClient = useQueryClient();

    const { mutate: rejectFriendRequestMutate, isPending } = useMutation({
        mutationFn: (senderId: string) => rejectFriendRequest(senderId),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['userProfile'] });
            await queryClient.invalidateQueries({ queryKey: ['friends'] });
        },
    });

    return { rejectFriendRequest: rejectFriendRequestMutate, isPending };
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

    const hasIncomingRequest = profile.incomingFriendRequests?.some(
        request => request.senderId === targetUserId
    ) ?? false;

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