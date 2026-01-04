import { Box, Card, CardContent, IconButton, Tooltip, Typography } from '@mui/material';
import { UserAvatar } from '../../users/UserAvatar';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { useProfileImageLoader } from '../../../hooks/useProfileImageLoader';
import { contentStyles } from "../../../utils/friendCardUtils";
import type { BlockedUser } from "../../../model/userProfile.ts";

interface BlockedUserCardProps {
    user: BlockedUser;
    onUnblock?: (userId: string) => void;
}

export function BlockedUserCard({ user, onUnblock }: BlockedUserCardProps) {
    const { profileImageUrl, isLoading, hasError } = useProfileImageLoader(user.id);
    const displayName = user.profile?.displayName || user.username;

    return (
        <Card
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 2,
                transition: 'all 0.2s ease',
                position: 'relative',
                overflow: 'hidden',
                '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                }
            }}
        >
            <CardContent sx={contentStyles(true)}>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 2,
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

                    <Box sx={{
                        flexGrow: 1,
                        minWidth: 0,
                        position: 'relative',
                        pt: 0.5,
                    }}>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            justifyContent: 'space-between',
                            mb: 1,
                        }}>
                            <Typography
                                variant="h6"
                                noWrap
                                fontWeight="600"
                                sx={{
                                    color: 'text.primary',
                                    fontSize: '1.1rem',
                                    lineHeight: '1.2',
                                    pr: 1,
                                }}
                            >
                                {displayName}
                            </Typography>

                            {onUnblock && (
                                <Tooltip title="Unblock User">
                                    <IconButton
                                        size="small"
                                        onClick={() => onUnblock(user.id)}
                                        sx={{
                                            color: 'text.primary',
                                            '&:hover': {
                                                color: 'destructive.main',
                                            }
                                        }}
                                    >
                                        <LockOpenIcon fontSize="small"/>
                                    </IconButton>
                                </Tooltip>
                            )}
                        </Box>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
}