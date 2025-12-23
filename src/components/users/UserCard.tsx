import {
    Card,
    CardContent,
    CardActions,
    Button,
    Box
} from '@mui/material';
import { Link as RouterLink } from 'react-router';
import type { UserProfile } from '../../model/userProfile';
import { UserAvatar } from './UserAvatar';
import { UserInfoSection } from './UserInfoSection';
import { UserBio } from './UserBio';
import { VisibilityChip } from './VisibilityChip';
import { useProfileImageLoader } from "../../hooks/useProfileImageLoader.ts";
import {FriendRequestButton} from "../FriendRequestButton.tsx";

interface UserCardProps {
    user: UserProfile;
}

export function UserCard({ user }: UserCardProps) {
    const userId = user.id;
    const { profileImageUrl, isLoading, hasError } = useProfileImageLoader(userId);
    const displayName = user.profile?.displayName || user.username;

    return (
        <Card sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
            '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: 6
            }
        }}>
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
                    <UserInfoSection user={user} />
                </Box>

                {user.profile?.bio && (
                    <UserBio bio={user.profile.bio} />
                )}

                <VisibilityChip visibility={user.visibility} />
            </CardContent>

            <CardActions sx={{ mt: 'auto', flexDirection: 'column', gap: 1, alignItems: 'stretch' }}>
                <FriendRequestButton
                    targetUserId={user.id}
                    targetUserKeycloakId={user.keycloakId}
                    size="small"
                    fullWidth
                />
                <Button
                    size="small"
                    component={RouterLink}
                    to={`/profile/${user.keycloakId}`}
                >
                    View Profile
                </Button>
            </CardActions>
        </Card>
    );
}