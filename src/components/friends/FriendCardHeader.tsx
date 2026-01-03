import { Box, Typography } from '@mui/material';
import { UserAvatar } from '../users/UserAvatar';
import type { PublicUserProfile } from '../../model/userProfile';

interface FriendCardHeaderProps {
    user: PublicUserProfile;
    profileImageUrl: string | null | undefined;
    isLoading: boolean;
    hasError: boolean;
    displayName: string;
}

export function FriendCardHeader({
                                     user,
                                     profileImageUrl,
                                     isLoading,
                                     hasError,
                                     displayName
                                 }: FriendCardHeaderProps) {
    return (
        <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1
        }}>
            <Box>
                <UserAvatar
                    userId={user.id}
                    displayName={displayName}
                    profileImageUrl={profileImageUrl ?? null}
                    isLoading={isLoading}
                    hasError={hasError}
                    size={60}
                />
            </Box>

            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                <Box sx={{ mb: 1 }}>
                    <Typography variant="h6" noWrap fontWeight="bold" align="left">
                        {displayName}
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
}