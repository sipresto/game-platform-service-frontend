import { Card, CardContent } from '@mui/material';
import type { PublicUserProfile } from '../../model/userProfile';
import { useProfileImageLoader } from '../../hooks/useProfileImageLoader.ts';
import { FriendCardHeader } from './FriendCardHeader';
import { FriendCardActions } from './FriendCardActions';
import { cardStyles, contentStyles } from "../../utils/friendCardUtils.ts";
import { useNavigate } from "react-router";

interface FriendCardProps {
    user: PublicUserProfile;
    onRemoveFriend?: (userId: string) => void;
    showActions?: boolean;
}

export function FriendCard({ user, onRemoveFriend, showActions = true }: FriendCardProps) {
    const navigate = useNavigate();
    const userId = user.id;
    const { profileImageUrl, isLoading, hasError } = useProfileImageLoader(userId);
    const displayName = user.profile?.displayName || user.username;

    const handleProfileClick = () => {
        navigate(`/profile/${userId}`);
    }

    return (
        <Card sx={cardStyles} onClick={handleProfileClick}>
            <CardContent sx={contentStyles(showActions)}>
                <FriendCardHeader
                    user={user}
                    profileImageUrl={profileImageUrl}
                    isLoading={isLoading}
                    hasError={hasError}
                    displayName={displayName}
                />
            </CardContent>

            {showActions && (
                <FriendCardActions
                    userId={userId}
                    keycloakId={user.keycloakId}
                    onRemoveFriend={onRemoveFriend}
                />
            )}
        </Card>
    );
}