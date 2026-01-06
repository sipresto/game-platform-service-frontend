import { Typography, Box } from '@mui/material';
import type { PublicUserProfile } from '../../model/userProfile';

interface UserInfoSectionProps {
    user: PublicUserProfile;
}

export const UserInfoSection = ({ user }: UserInfoSectionProps) => {
    const displayName = user.profile?.displayName || user.username;

    return (
        <Box sx={{
            ml: 2,
            flex: 1,
            minWidth: 0,
        }}>
            <Typography
                variant="subtitle1"
                component="div"
                sx={{
                    fontWeight: 600,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                }}
            >
                {displayName}
            </Typography>
            <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                }}
            >
                @{user.username}
            </Typography>
        </Box>
    );
};