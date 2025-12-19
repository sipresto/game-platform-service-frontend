import { useState } from 'react';
import { Button, CircularProgress } from '@mui/material';
import { PersonAdd, Check, HourglassEmpty } from '@mui/icons-material';
import {useAcceptFriendRequest, useSendFriendRequest} from "../hooks/useFriendRequests.ts";
import {useAllUsers, useUserProfile} from "../hooks/useUserProfile.ts";

interface FriendRequestButtonProps {
    targetUserId: string;
    targetUserKeycloakId: string;
    size?: 'small' | 'medium' | 'large';
    variant?: 'contained' | 'outlined' | 'text';
    fullWidth?: boolean;
}

export function FriendRequestButton({
                                        targetUserId,
                                        targetUserKeycloakId,
                                        size = 'medium',
                                        variant = 'outlined',
                                        fullWidth = false
                                    }: FriendRequestButtonProps) {
    const { profile: currentUser } = useUserProfile();
    const { friends } = useAllUsers();
    const [isProcessing, setIsProcessing] = useState(false);
    const [requestSent, setRequestSent] = useState(false);

    const sendMutation = useSendFriendRequest();
    const acceptMutation = useAcceptFriendRequest();

    const isCurrentUser = currentUser?.id === targetUserId || currentUser?.keycloakId === targetUserKeycloakId;

    const isFriend = friends.some(friend =>
        friend.id === targetUserId || friend.keycloakId === targetUserKeycloakId
    );

    const hasIncomingRequest = currentUser?.friendRequests?.some(
        request => request.senderId === targetUserId
    );

    if (isCurrentUser || !currentUser) {
        return null;
    }

    if (isFriend) {
        return (
            <Button
                size={size}
                variant={variant}
                fullWidth={fullWidth}
                disabled
                startIcon={<Check />}
            >
                Friends
            </Button>
        );
    }

    if (hasIncomingRequest) {
        return (
            <Button
                size={size}
                variant="contained"
                color="success"
                fullWidth={fullWidth}
                startIcon={isProcessing ? <CircularProgress size={16} /> : <Check />}
                disabled={isProcessing}
                onClick={async () => {
                    setIsProcessing(true);
                    try {
                        await acceptMutation.mutateAsync(targetUserId);
                    } finally {
                        setIsProcessing(false);
                    }
                }}
            >
                Accept Request
            </Button>
        );
    }

    if (requestSent) {
        return (
            <Button
                size={size}
                variant={variant}
                fullWidth={fullWidth}
                disabled
                startIcon={<HourglassEmpty />}
            >
                Request Pending
            </Button>
        );
    }

    return (
        <Button
            size={size}
            variant={variant}
            fullWidth={fullWidth}
            startIcon={isProcessing ? <CircularProgress size={16} /> : <PersonAdd />}
            disabled={isProcessing}
            onClick={async () => {
                if (!currentUser?.id) return;

                setIsProcessing(true);
                try {
                    await sendMutation.mutateAsync({
                        receiverId: targetUserId,
                        senderId: currentUser.id
                    });
                    setRequestSent(true);
                } finally {
                    setIsProcessing(false);
                }
            }}
        >
            Add Friend
        </Button>
    );
}