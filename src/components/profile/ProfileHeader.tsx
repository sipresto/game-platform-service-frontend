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
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: 2
            }}>
                <Avatar
                    src={profileImageUrl || undefined}
                    sx={{
                        width: 120,
                        height: 120,
                        fontSize: 48,
                        bgcolor: 'primary.main',
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
                        sx={{ fontWeight: 'bold' }}
                    />
                )}

                <Box sx={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}>
                    <Typography
                        variant="h4"
                        fontWeight={700}
                        sx={{
                            width: '100%',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        {displayName}
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{
                            width: '100%',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        @{user.username}
                    </Typography>
                </Box>

                {user.profile?.bio && (
                    <Box sx={{
                        width: '100%',
                        textAlign: 'left',
                        mt: 1
                    }}>
                        <Typography
                            variant="overline"
                            fontWeight={600}
                            display="block"
                        >
                            About
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{
                                mt: 1,
                                whiteSpace: 'pre-wrap',
                                overflowWrap: 'break-word',
                                maxHeight: '200px',
                                overflow: 'auto'
                            }}
                        >
                            {user.profile.bio}
                        </Typography>
                    </Box>
                )}

                <Box sx={{ width: '100%', mt: 2 }}>
                    {!isOwnProfile ? (
                        <Button
                            fullWidth
                            variant="contained"
                            startIcon={<ChatBubble />}
                            onClick={handleStartChat}
                        >
                            Send message
                        </Button>
                    ) : (
                        <Button
                            fullWidth
                            variant="outlined"
                            onClick={handleProfileEdit}
                        >
                            Edit Profile
                        </Button>
                    )}
                </Box>
            </Box>
        </Paper>
    );
}