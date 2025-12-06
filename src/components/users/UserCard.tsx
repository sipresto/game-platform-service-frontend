import {
    Card,
    CardContent,
    CardActions,
    Typography,
    Avatar,
    Button,
    Chip,
    Box
} from '@mui/material';
import { Visibility as VisibilityIcon } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router';
import type { UserProfile } from '../../model/userProfile';

interface UserCardProps {
    user: UserProfile;
}

export function UserCard({ user }: UserCardProps) {
    const getVisibilityInfo = () => {
        switch (user.visibility) {
            case 'PUBLIC': return { label: 'Public', color: 'success' as const };
            case 'FRIENDS_ONLY': return { label: 'Friends Only', color: 'warning' as const };
            case 'PRIVATE': return { label: 'Private', color: 'default' as const };
            default: return { label: 'Unknown', color: 'default' as const };
        }
    };

    const visibilityInfo = getVisibilityInfo();
    const displayName = user.profile?.displayName || user.username;
    const userInitials = displayName.charAt(0).toUpperCase();

    return (
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                        {userInitials}
                    </Avatar>
                    <Box>
                        <Typography variant="h6" component="div">
                            {displayName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            @{user.username}
                        </Typography>
                    </Box>
                </Box>

                {user.profile?.bio && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {user.profile.bio.length > 100
                            ? `${user.profile.bio.substring(0, 100)}...`
                            : user.profile.bio}
                    </Typography>
                )}

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <VisibilityIcon fontSize="small" color="action" />
                    <Chip
                        label={visibilityInfo.label}
                        size="small"
                        color={visibilityInfo.color}
                        variant="outlined"
                    />
                </Box>
            </CardContent>

            <CardActions>
                <Button
                    size="small"
                    component={RouterLink}
                    to={`/profile/${user.keycloakId}`}
                    sx={{ ml: 'auto' }}
                >
                    View Profile
                </Button>
            </CardActions>
        </Card>
    );
}