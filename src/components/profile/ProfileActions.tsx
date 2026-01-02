import {Box, Paper} from '@mui/material';
import type {PublicUserProfile} from '../../model/userProfile';
import {FriendRequestButton} from "../FriendRequestButton.tsx";
import {ProfileActionButtons} from "./ProfileActionButtons.tsx";

interface ProfileActionsProps {
    user: PublicUserProfile;
    isOwnProfile: boolean;
}

export function ProfileActions({user, isOwnProfile}: ProfileActionsProps) {

    if (isOwnProfile) {
        return null;
    }

    return (
        <Paper sx={{p: 2, mt: 2}}>
            <Box sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
                <FriendRequestButton
                    targetUserId={user.id}
                    targetUserKeycloakId={user.keycloakId}
                    variant="outlined"
                    fullWidth
                />

                <ProfileActionButtons user={user}/>
            </Box>
        </Paper>
    );
}