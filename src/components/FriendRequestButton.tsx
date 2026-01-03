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

    const { sendFriendRequest, isPending: sendIsPending } = useSendFriendRequest();
    const { acceptFriendRequest, isPending: acceptIsPending } = useAcceptFriendRequest();
    const { rejectFriendRequest, isPending: rejectIsPending } = useRejectFriendRequest();

    const handleAccept = () => {
        acceptFriendRequest(targetUserId);
    };

    const handleReject = () => {
        rejectFriendRequest(targetUserId);
    };

    const handleSendRequest = () => {
        if (!currentUser?.id) return;

        sendFriendRequest({ receiverId: targetUserId, senderId: currentUser.id });
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
                    startIcon={acceptIsPending ? <CircularProgress size={16}/> : <Check/>}
                    disabled={acceptIsPending || rejectIsPending}
                    onClick={(e) => {
                        e.stopPropagation();
                        handleAccept();
                    }}
                    sx={{ flex: 1 }}
                >
                    Accept
                </Button>
                <Button
                    size={size}
                    variant="outlined"
                    color="error"
                    fullWidth={fullWidth}
                    startIcon={rejectIsPending ? <CircularProgress size={16}/> : <Close/>}
                    disabled={acceptIsPending || rejectIsPending}
                    onClick={(e) => {
                        e.stopPropagation();
                        handleReject();
                    }}
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
            startIcon={sendIsPending ? <CircularProgress size={16}/> : <PersonAdd/>}
            disabled={sendIsPending}
            onClick={(e) => {
                e.stopPropagation();
                handleSendRequest();
            }}
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