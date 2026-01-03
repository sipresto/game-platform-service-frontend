import { Avatar, Box, Button, Chip, Paper, Typography } from '@mui/material';
import { ChatBubble, EmojiEvents as TitleIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router';
import { useCreateChat } from "../../hooks/useChats.ts";
import { useProfileImageLoader } from "../../hooks/useProfileImageLoader.ts";
import type { PublicUserProfile } from "../../model/userProfile.ts";
import { BORDER_STYLES, TITLE_LABELS } from "../../utils/perkConstants.ts";

interface ProfileHeaderProps {
    user: PublicUserProfile & {
        equippedBorderId?: string | null;
        equippedTitleId?: string | null;
        equippedThemeId?: string | null;
    };
    isOwnProfile: boolean;
}

export function ProfileHeader({ user, isOwnProfile }: ProfileHeaderProps) {
    const userId = user.id || user.keycloakId || '';
    const displayName = user.profile?.displayName || user.username;
    const initial = displayName.charAt(0).toUpperCase();
    const navigate = useNavigate();
    const { createNewChat } = useCreateChat();

    const profileImageUrl = useProfileImageLoader(userId).profileImageUrl;

    const borderStyle = user.equippedBorderId ? BORDER_STYLES[user.equippedBorderId] : {};
    const titleLabel = user.equippedTitleId ? TITLE_LABELS[user.equippedTitleId] : null;

    const handleStartChat = () => {
        createNewChat(
            { participantUserIds: [userId] },
            {
                onSuccess: (chat) => navigate(`/chat/${chat.id}`),
            }
        );
    };

    const handleProfileEdit = () => {
        navigate(`/profile/edit`);
    }

    return (
        <Paper
            sx={{
                p: 4,
                borderRadius: 2,
                flexGrow: 1,
                transition: 'background 0.3s ease',
            }}
        >
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <Avatar
                    src={profileImageUrl || undefined}
                    sx={{
                        width: 120,
                        height: 120,
                        fontSize: 48,
                        bgcolor: 'primary.main',
                        mb: 2,
                        border: '4px solid transparent',
                        ...borderStyle
                    }}
                >
                    {initial}
                </Avatar>

                {titleLabel && (
                    <Chip
                        icon={<TitleIcon sx={{ fontSize: 16 }}/>}
                        label={titleLabel}
                        size="small"
                        color="secondary"
                        variant="outlined"
                        sx={{ mb: 2, fontWeight: 'bold' }}
                    />
                )}

                <Typography variant="h4" fontWeight={700} gutterBottom>
                    {displayName}
                </Typography>
                <Typography variant="body1" gutterBottom>
                    @{user.username}
                </Typography>

                {user.profile?.bio && (
                    <Box sx={{ width: '100%', mb: 3 }}>
                        <Typography variant="overline" fontWeight={600}>
                            About
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1, whiteSpace: 'pre-wrap' }}>
                            {user.profile.bio}
                        </Typography>
                    </Box>
                )}

                {!isOwnProfile ? (
                    <Button
                        fullWidth
                        variant="contained"
                        startIcon={<ChatBubble />}
                        onClick={handleStartChat}
                        sx={{ mt: 2 }}
                    >
                        Send message
                    </Button>
                ) : (
                    <Button
                        fullWidth
                        variant="outlined"
                        onClick={handleProfileEdit}
                        sx={{ mt: 2 }}
                    >
                        Edit Profile
                    </Button>
                )}
            </Box>
        </Paper>
    );
}