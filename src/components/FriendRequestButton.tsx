import { useState } from 'react';
import { Button, CircularProgress, Box } from '@mui/material';
import { PersonAdd, Check, Close, HourglassEmpty } from '@mui/icons-material';
import {
    useAcceptFriendRequest,
    useSendFriendRequest,
    useRejectFriendRequest
} from "../hooks/useFriendRequests.ts";
import { useAllUsers, useUserProfile } from "../hooks/useUserProfile.ts";

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
    const rejectMutation = useRejectFriendRequest();

    const isCurrentUser = currentUser?.id === targetUserId || currentUser?.keycloakId === targetUserKeycloakId;

    const isFriend = friends.some(friend =>
        friend.id === targetUserId || friend.keycloakId === targetUserKeycloakId
    );

    const hasIncomingRequest = currentUser?.friendRequests?.some(
        request => request.senderId === targetUserId
    );

    const handleAccept = async () => {
        setIsProcessing(true);
        try {
            await acceptMutation.mutateAsync(targetUserId);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleReject = async () => {
        setIsProcessing(true);
        try {
            await rejectMutation.mutateAsync(targetUserId);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleSendRequest = async () => {
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
    };

    // Early returns for non-actionable states
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

    // Handle incoming friend requests with reject button
    if (hasIncomingRequest) {
        return (
            <Box sx={{
                display: 'flex',
                gap: 1,
                width: fullWidth ? '100%' : 'auto',
                flexDirection: { xs: 'column', sm: 'row' } // Responsive: column on mobile, row on desktop
            }}>
                <Button
                    size={size}
                    variant="contained"
                    color="success"
                    fullWidth={fullWidth}
                    startIcon={isProcessing ? <CircularProgress size={16} /> : <Check />}
                    disabled={isProcessing}
                    onClick={handleAccept}
                    sx={{ flex: 1 }} // Equal flex value for both buttons
                >
                    Accept
                </Button>
                <Button
                    size={size}
                    variant="outlined"
                    color="error"
                    fullWidth={fullWidth}
                    startIcon={isProcessing ? <CircularProgress size={16} /> : <Close />}
                    disabled={isProcessing}
                    onClick={handleReject}
                    sx={{ flex: 1 }} // Equal flex value for both buttons
                >
                    Reject
                </Button>
            </Box>
        );
    }

    // No existing relationship - show "Add Friend" button
    return (
        <Button
            size={size}
            variant={variant}
            fullWidth={fullWidth}
            startIcon={isProcessing ? <CircularProgress size={16} /> : <PersonAdd />}
            disabled={isProcessing}
            onClick={handleSendRequest}
        >
            Add Friend
        </Button>
    );
}