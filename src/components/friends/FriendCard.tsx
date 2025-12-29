import { Card, CardContent } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import type {PublicUserProfile} from '../../model/userProfile';
import { useProfileImageLoader } from '../../hooks/useProfileImageLoader.ts';
import { FriendCardHeader } from './FriendCardHeader';
import { FriendCardActions } from './FriendCardActions';
import {cardStyles, contentStyles} from "../../utils/friendCardUtils.ts";

interface FriendCardProps {
    user: PublicUserProfile;
    onRemoveFriend?: (userId: string) => void;
    onMessage?: (userId: string) => void;
    showActions?: boolean;
}

export function FriendCard({ user, onRemoveFriend, onMessage, showActions = true }: FriendCardProps) {
    const theme = useTheme();
    const userId = user.id;
    const { profileImageUrl, isLoading, hasError } = useProfileImageLoader(userId);
    const displayName = user.profile?.displayName || user.username;

    return (
        <Card sx={cardStyles(theme)}>
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
                    onMessage={onMessage}
                />
            )}
        </Card>
    );
}