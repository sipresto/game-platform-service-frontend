import {
    Card,
    CardContent,
    CardActions,
    Typography,
    Avatar,
    Button,
    Chip,
    Box,
    CircularProgress
} from '@mui/material';
import { Visibility as VisibilityIcon } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router';
import type { UserProfile } from '../../model/userProfile';
import {useEffect, useState} from "react";

interface UserCardProps {
    user: UserProfile;
}

const getProfileImageUrl = (userId: string, timestamp?: number): string | null => {
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string;
    if (!BACKEND_URL || !userId) return null;

    const url = `${BACKEND_URL}/${userId}/profile-image`;
    return timestamp ? `${url}?t=${timestamp}` : url;
};

const getInitials = (name: string): string => {
    return name
        .split(' ')
        .map(part => part.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2);
};

const useProfileImageLoader = (userId: string) => {
    const [imageTimestamp, setImageTimestamp] = useState(Date.now());
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    const profileImageUrl = getProfileImageUrl(userId, imageTimestamp);

    useEffect(() => {
        if (!profileImageUrl) {
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setHasError(false);

        const img = new Image();
        img.src = profileImageUrl;

        const handleLoad = () => {
            setIsLoading(false);
        };

        const handleError = () => {
            setIsLoading(false);
            setHasError(true);
        };

        img.addEventListener('load', handleLoad);
        img.addEventListener('error', handleError);

        return () => {
            img.removeEventListener('load', handleLoad);
            img.removeEventListener('error', handleError);
        };
    }, [profileImageUrl]);

    const refreshImage = () => {
        setImageTimestamp(Date.now());
    };

    return {
        profileImageUrl,
        isLoading,
        hasError,
        refreshImage
    };
};

export function UserCard({ user }: UserCardProps) {
    const userId = user.id;
    const { profileImageUrl, isLoading, hasError } = useProfileImageLoader(userId);

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
    const userInitials = getInitials(displayName);

    return (
        <Card sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
            '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 6
            }
        }}>
            <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ position: 'relative', mr: 2 }}>
                        <Avatar
                            src={!hasError && !isLoading ? profileImageUrl || undefined : undefined}
                            sx={{
                                width: 56,
                                height: 56,
                                bgcolor: 'primary.main',
                                fontSize: 20
                            }}
                            alt={`${displayName}'s profile picture`}
                        >
                            {userInitials}
                        </Avatar>

                        {isLoading && (
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    bgcolor: 'rgba(255, 255, 255, 0.7)',
                                    borderRadius: '50%',
                                }}
                            >
                                <CircularProgress size={20} />
                            </Box>
                        )}
                    </Box>
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
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            mb: 2,
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        }}
                    >
                        {user.profile.bio}
                    </Typography>
                )}

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <VisibilityIcon fontSize="small" color="action" />
                    <Chip
                        label={visibilityInfo.label}
                        size="small"
                        color={visibilityInfo.color}
                        variant="outlined"
                        sx={{ fontSize: '0.75rem' }}
                    />
                </Box>
            </CardContent>

            <CardActions sx={{ mt: 'auto' }}>
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