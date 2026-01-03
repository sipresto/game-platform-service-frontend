import { Box, Card, CardActions, CardContent } from '@mui/material';
import { useNavigate } from 'react-router';
import type { PublicUserProfile } from '../../model/userProfile';
import { UserAvatar } from './UserAvatar';
import { UserInfoSection } from './UserInfoSection';
import { UserBio } from './UserBio';
import { useProfileImageLoader } from "../../hooks/useProfileImageLoader.ts";
import { FriendRequestButton } from "../FriendRequestButton.tsx";

interface UserCardProps {
    user: PublicUserProfile;
}

export function UserCard({ user }: UserCardProps) {
    const navigate = useNavigate();
    const userId = user.id;
    const { profileImageUrl, isLoading, hasError } = useProfileImageLoader(userId);
    const displayName = user.profile?.displayName || user.username;

    function handleProfileClick() {
        navigate(`/profile/${userId}`)
    }

    return (
        <Card
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 6,
                    cursor: 'pointer',
                }
            }}
            onClick={handleProfileClick}
        >
            <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <UserAvatar
                        userId={userId}
                        displayName={displayName}
                        profileImageUrl={profileImageUrl}
                        isLoading={isLoading}
                        hasError={hasError}
                        size={56}
                    />
                    <UserInfoSection user={user}/>
                </Box>

                {user.profile?.bio && (
                    <UserBio bio={user.profile.bio}/>
                )}
            </CardContent>

            <CardActions sx={{ mt: 'auto', flexDirection: 'column', gap: 1, alignItems: 'stretch' }}>
                <FriendRequestButton
                    targetUserId={user.id}
                    targetUserKeycloakId={user.keycloakId}
                    size="small"
                    fullWidth
                />
            </CardActions>
        </Card>
    );
}