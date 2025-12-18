import { Typography, Box } from '@mui/material';
import type { UserProfile } from '../../model/userProfile';

interface UserInfoSectionProps {
    user: UserProfile;
}

export const UserInfoSection = ({ user }: UserInfoSectionProps) => {
    const displayName = user.profile?.displayName || user.username;

    return (
        <Box>
            <Typography variant="h6" component="div">
                {displayName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
                @{user.username}
            </Typography>
        </Box>
    );
};