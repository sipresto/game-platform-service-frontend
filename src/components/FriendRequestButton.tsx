import { Box, Button, CircularProgress } from '@mui/material';
import { Check, Close, HourglassEmpty, PersonAdd } from '@mui/icons-material';
import {
    useAcceptFriendRequest,
    useFriendshipStatus,
    useRejectFriendRequest,
    useSendFriendRequest
} from "../hooks/useFriendRequests.ts";
import { useUserProfile } from "../hooks/useUserProfile.ts";

interface FriendRequestButtonProps {
    targetUserId: string;
    targetUserKeycloakId: string;
    size?: 'small' | 'medium' | 'large';
    variant?: 'contained' | 'outlined' | 'text';
    fullWidth?: boolean;
}

export function FriendRequestButton({
                                        targetUserId,
                                        size = 'medium',
                                        variant = 'outlined',
                                        fullWidth = false
                                    }: FriendRequestButtonProps) {
    const { profile: currentUser } = useUserProfile();
    const {
        isCurrentUser,
        isFriend,
        hasIncomingRequest,
        hasOutgoingRequest
    } = useFriendshipStatus(targetUserId);

    const sendMutation = useSendFriendRequest();
    const acceptMutation = useAcceptFriendRequest();
    const rejectMutation = useRejectFriendRequest();

    const handleAccept = async () => {
        try {
            await acceptMutation.mutateAsync(targetUserId);
        } catch (error) {
            console.error('Failed to accept friend request:', error);
        }
    };

    const handleReject = async () => {
        try {
            await rejectMutation.mutateAsync(targetUserId);
        } catch (error) {
            console.error('Failed to reject friend request:', error);
        }
    };

    const handleSendRequest = async () => {
        if (!currentUser?.id) return;

        try {
            await sendMutation.mutateAsync({
                receiverId: targetUserId,
                senderId: currentUser.id
            });
        } catch (error) {
            console.error('Failed to send friend request:', error);
        }
    };

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
                startIcon={<Check/>}
            >
                Friends
            </Button>
        );
    }

    if (hasOutgoingRequest) {
        return (
            <Button
                size={size}
                variant={variant}
                fullWidth={fullWidth}
                disabled
                startIcon={<HourglassEmpty/>}
            >
                Request Pending
            </Button>
        );
    }

    if (hasIncomingRequest) {
        return (
            <Box sx={{
                display: 'flex',
                gap: 1,
                width: fullWidth ? '100%' : 'auto',
                flexDirection: { xs: 'column', sm: 'row' }
            }}>
                <Button
                    size={size}
                    variant="contained"
                    color="success"
                    fullWidth={fullWidth}
                    startIcon={acceptMutation.isPending ? <CircularProgress size={16}/> : <Check/>}
                    disabled={acceptMutation.isPending || rejectMutation.isPending}
                    onClick={handleAccept}
                    sx={{ flex: 1 }}
                >
                    Accept
                </Button>
                <Button
                    size={size}
                    variant="outlined"
                    color="error"
                    fullWidth={fullWidth}
                    startIcon={rejectMutation.isPending ? <CircularProgress size={16}/> : <Close/>}
                    disabled={acceptMutation.isPending || rejectMutation.isPending}
                    onClick={handleReject}
                    sx={{ flex: 1 }}
                >
                    Reject
                </Button>
            </Box>
        );
    }

    return (
        <Button
            size={size}
            variant={variant}
            fullWidth={fullWidth}
            startIcon={sendMutation.isPending ? <CircularProgress size={16}/> : <PersonAdd/>}
            disabled={sendMutation.isPending}
            onClick={handleSendRequest}
            sx={{
                color: 'success.main',
                borderColor: 'success.main',
                '&:hover': {
                    borderColor: 'success.dark',
                }
            }}
        >
            Add Friend
        </Button>
    );
}