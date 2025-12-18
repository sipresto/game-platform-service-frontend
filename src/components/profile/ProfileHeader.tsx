import { Paper, Box, Avatar, Typography, Chip, Button } from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router';

interface User {
    id?: string;
    keycloakId?: string;
    username: string;
    visibility: string;
    profile?: {
        displayName?: string;
        bio?: string;
    };
}

interface ProfileHeaderProps {
    user: User;
    isOwnProfile: boolean;
}

export function ProfileHeader({ user, isOwnProfile }: ProfileHeaderProps) {
    const BACKEND_URL: string = import.meta.env.VITE_BACKEND_URL;
    const userId = user.id || user.keycloakId || '';
    const displayName = user.profile?.displayName || user.username;
    const initial = displayName.charAt(0).toUpperCase();
    const visibilityColor =
        user.visibility === 'PUBLIC' ? 'success' : user.visibility === 'FRIENDS_ONLY' ? 'warning' : 'default';

    const profileImageUrl = userId
        ? `${BACKEND_URL}/${userId}/profile-image`
        : null;

    return (
        <Paper elevation={2} sx={{ p: 4, borderRadius: 2, flexGrow: 1 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', flexGrow: 1 }}>
                <Avatar
                    src={profileImageUrl || undefined}
                    sx={{
                        width: 120,
                        height: 120,
                        fontSize: 48,
                        bgcolor: 'primary.main',
                        mb: 3,
                    }}
                >
                    {initial}
                </Avatar>
                <Typography variant="h4" fontWeight={700} gutterBottom>
                    {displayName}
                </Typography>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                    @{user.username}
                </Typography>
                <Chip
                    label={`${user.visibility.charAt(0) + user.visibility.slice(1).toLowerCase()} Profile`}
                    color={visibilityColor}
                    size="small"
                    sx={{ mt: 1, mb: 3 }}
                />
                {user.profile?.bio && (
                    <Box sx={{ width: '100%', mb: 3 }}>
                        <Typography variant="overline" color="text.secondary" fontWeight={600}>
                            About
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1, whiteSpace: 'pre-wrap' }}>
                            {user.profile.bio}
                        </Typography>
                    </Box>
                )}
                {isOwnProfile && (
                    <Button
                        fullWidth
                        variant="contained"
                        startIcon={<EditIcon />}
                        component={RouterLink}
                        to="/profile/edit"
                        sx={{
                            mt: 2,
                            '&:hover': {
                                backgroundColor: 'primary.dark',
                                color: 'white',
                            }
                        }}
                    >
                        Edit Profile
                    </Button>
                )}
            </Box>
        </Paper>
    );
}