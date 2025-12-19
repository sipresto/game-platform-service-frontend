import { Box, Typography, Chip, Tooltip } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import PublicIcon from '@mui/icons-material/Public';
import LockIcon from '@mui/icons-material/Lock';
import PeopleIcon from '@mui/icons-material/People';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { UserAvatar } from '../users/UserAvatar';
import type { UserProfile } from '../../model/userProfile';
import {getFriendCountText, getVisibilityLabel} from "../../utils/friendCardUtils.ts";

interface FriendCardHeaderProps {
    user: UserProfile;
    profileImageUrl: string | null | undefined;
    isLoading: boolean;
    hasError: boolean;
    displayName: string;
}

const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
        case 'PUBLIC':
            return <PublicIcon fontSize="small" />;
        case 'FRIENDS_ONLY':
            return <PeopleIcon fontSize="small" />;
        case 'PRIVATE':
            return <LockIcon fontSize="small" />;
        default:
            return <VisibilityIcon fontSize="small" />;
    }
};

export function FriendCardHeader({
                                     user,
                                     profileImageUrl,
                                     isLoading,
                                     hasError,
                                     displayName
                                 }: FriendCardHeaderProps) {
    const theme = useTheme();
    const friendCount = user.friends?.length || 0;

    return (
        <Box sx={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 2,
            mb: 2,
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
                    <Typography
                        variant="h6"
                        noWrap
                        fontWeight="600"
                        sx={{
                            color: theme.palette.text.primary,
                            fontSize: '1.1rem',
                        }}
                        align="left"
                    >
                        {displayName}
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Tooltip title={`Profile: ${getVisibilityLabel(user.visibility)}`}>
                        <Chip
                            icon={getVisibilityIcon(user.visibility)}
                            label={getVisibilityLabel(user.visibility)}
                            size="small"
                            variant="outlined"
                            sx={{
                                height: 22,
                                fontSize: '0.65rem',
                                borderColor: alpha(theme.palette.primary.main, 0.2),
                                color: theme.palette.text.secondary,
                                '& .MuiChip-icon': {
                                    fontSize: 12,
                                    marginLeft: 0.5,
                                }
                            }}
                        />
                    </Tooltip>

                    {friendCount > 0 && (
                        <Tooltip title="Friends">
                            <Chip
                                label={getFriendCountText(friendCount)}
                                size="small"
                                variant="outlined"
                                sx={{
                                    height: 22,
                                    fontSize: '0.65rem',
                                    borderColor: alpha(theme.palette.secondary.main, 0.2),
                                    color: theme.palette.text.secondary,
                                }}
                            />
                        </Tooltip>
                    )}
                </Box>
            </Box>
        </Box>
    );
}