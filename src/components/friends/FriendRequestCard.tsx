import { useState } from 'react';
import { Card, CardContent, Box } from '@mui/material';
import type {PublicUserProfile} from '../../model/userProfile';
import { useProfileImageLoader } from '../../hooks/useProfileImageLoader.ts';
import { useAcceptFriendRequest, useRejectFriendRequest } from '../../hooks/useFriendRequests';
import { UserInfoSection } from './UserInfoSection';
import { TimeChip } from './TimeChip';
import { FriendRequestActions } from './FriendRequestActions';

interface FriendRequestCardProps {
    user: PublicUserProfile;
    createdAt: string;
}

export function FriendRequestCard({ user, createdAt }: FriendRequestCardProps) {
    const userId = user.id;
    const { profileImageUrl, isLoading: imageLoading, hasError } = useProfileImageLoader(userId);
    const [isProcessing, setIsProcessing] = useState(false);

    const acceptMutation = useAcceptFriendRequest();
    const rejectMutation = useRejectFriendRequest();

    const handleAccept = async () => {
        setIsProcessing(true);
        try {
            await acceptMutation.mutateAsync(userId);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleReject = async () => {
        setIsProcessing(true);
        try {
            await rejectMutation.mutateAsync(userId);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <Card sx={cardStyles}>
            <CardContent sx={{ flexGrow: 1, p: 2 }}>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 1,
                    mb: 1
                }}>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <UserInfoSection
                            userId={userId}
                            user={user}
                            profileImageUrl={profileImageUrl ?? undefined}
                            imageLoading={imageLoading}
                            hasError={hasError}
                        />
                    </Box>

                    <Box>
                        <TimeChip createdAt={createdAt} />
                    </Box>
                </Box>

                <Box sx={{ mt: 1 }}>
                    <FriendRequestActions
                        userId={userId}
                        isProcessing={isProcessing}
                        onAccept={handleAccept}
                        onReject={handleReject}
                    />
                </Box>
            </CardContent>
        </Card>
    );
}

const cardStyles = {
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: 4
    }
};