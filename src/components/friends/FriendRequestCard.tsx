import { useState } from 'react';
import { Card, CardContent } from '@mui/material';
import type { UserProfile } from '../../model/userProfile';
import { useProfileImageLoader } from '../../utils/useProfileImageLoader';
import { useAcceptFriendRequest, useRejectFriendRequest } from '../../hooks/useFriendRequests';
import { UserInfoSection } from './UserInfoSection';
import { TimeChip } from './TimeChip';
import { FriendRequestActions } from './FriendRequestActions';

interface FriendRequestCardProps {
    user: UserProfile;
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
            <CardContent sx={{ flexGrow: 1 }}>
                <UserInfoSection
                    userId={userId}
                    user={user}
                    profileImageUrl={profileImageUrl ?? undefined}
                    imageLoading={imageLoading}
                    hasError={hasError}
                />

                <TimeChip createdAt={createdAt} />
            </CardContent>

            <FriendRequestActions
                userId={userId}
                keycloakId={user.keycloakId}
                isProcessing={isProcessing}
                onAccept={handleAccept}
                onReject={handleReject}
            />
        </Card>
    );
}

const cardStyles = {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    border: '2px solid',
    borderColor: 'primary.main',
    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: 6
    }
};