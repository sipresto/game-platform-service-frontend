import { Box, Typography } from '@mui/material';
import { UserAvatar } from '../users/UserAvatar.tsx';
import type { PublicUserProfile } from '../../model/userProfile';

interface UserInfoSectionProps {
    userId: string;
    user: PublicUserProfile;
    profileImageUrl?: string;
    imageLoading: boolean;
    hasError: boolean;
}

export function UserInfoSection({
                                    userId,
                                    user,
                                    profileImageUrl,
                                    imageLoading,
                                    hasError
                                }: UserInfoSectionProps) {
    const displayName = user.profile?.displayName || user.username;

    return (
        <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1
        }}>
            <UserAvatar
                userId={userId}
                displayName={displayName}
                profileImageUrl={profileImageUrl ?? null}
                isLoading={imageLoading}
                hasError={hasError}
                size={60}
            />
            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                <Typography variant="h6" noWrap fontWeight="bold" align="left">
                    {displayName}
                </Typography>
            </Box>
        </Box>
    );
}