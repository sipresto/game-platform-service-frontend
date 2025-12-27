import { Box, Button } from '@mui/material';
import { Edit } from '@mui/icons-material';
import { useNavigate } from 'react-router';
import type {PublicUserProfile} from '../../model/userProfile';
import {FriendRequestButton} from "../FriendRequestButton.tsx";

interface ProfileActionsProps {
    user: PublicUserProfile;
    isOwnProfile: boolean;
}

export function ProfileActions({ user, isOwnProfile }: ProfileActionsProps) {
    const navigate = useNavigate();

    if (isOwnProfile) {
        return (
            <Box sx={{ mt: 2 }}>
                <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<Edit />}
                    onClick={() => navigate('/profile/edit')}
                >
                    Edit Profile
                </Button>
            </Box>
        );
    }

    return (
        <Box sx={{ mt: 2 }}>
            <FriendRequestButton
                targetUserId={user.id}
                targetUserKeycloakId={user.keycloakId}
                variant="contained"
                fullWidth
            />
        </Box>
    );
}