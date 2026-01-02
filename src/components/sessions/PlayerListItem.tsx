import {
    ListItem,
    ListItemAvatar,
    Avatar,
    ListItemText,
    Box,
    Typography,
    Chip,
    Skeleton
} from '@mui/material';
import { EmojiEvents, SmartToy, Person, Gamepad } from '@mui/icons-material';
import { useUserProfileById } from '../../hooks/useUserProfile';

interface PlayerListItemProps {
    playerId: string;
    isWinner: boolean;
    isCurrentUser: boolean;
    isAI?: boolean;
}

export function PlayerListItem({ playerId, isWinner, isCurrentUser, isAI = false }: PlayerListItemProps) {

    const { data: profile, isLoading } = useUserProfileById(isAI ? '' : playerId);

    if (isAI) {
        return (
            <ListItem
                sx={{
                    bgcolor: isWinner ? 'info.lighter' : 'transparent',
                    borderRadius: 1,
                    mb: 0.5,
                    border: isWinner ? '1px solid' : 'none',
                    borderColor: 'info.light'
                }}
            >
                <ListItemAvatar>
                    <Avatar sx={{ bgcolor: isWinner ? 'info.main' : 'background.elevated', color: 'text.primary' }}>
                        <SmartToy />
                    </Avatar>
                </ListItemAvatar>
                <ListItemText
                    primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {isWinner && (
                                <Chip
                                    label="Winner"
                                    size="small"
                                    color="info"
                                    icon={<EmojiEvents sx={{ fontSize: 16 }} />}
                                    sx={{ height: 20, fontSize: '0.7rem', color: 'text.primary' }}
                                />
                            )}
                        </Box>
                    }
                    secondary="Computer opponent"
                />
            </ListItem>
        );
    }

    if (isLoading) {
        return (
            <ListItem>
                <ListItemAvatar>
                    <Skeleton variant="circular" width={40} height={40} />
                </ListItemAvatar>
                <ListItemText
                    primary={<Skeleton width={120} />}
                    secondary={<Skeleton width={80} />}
                />
            </ListItem>
        );
    }

    return (
        <ListItem
            sx={{
                bgcolor: isWinner ? 'warning.lighter' : 'transparent',
                borderRadius: 1,
                mb: 0.5,
                border: isCurrentUser ? '2px solid' : (isWinner ? '1px solid' : 'none'),
                borderColor: isCurrentUser ? 'primary.main' : (isWinner ? 'warning.light' : 'transparent')
            }}
        >
            <ListItemAvatar>
                <Avatar sx={{
                    bgcolor: isWinner ? 'warning.main' : (isCurrentUser ? 'primary.main' : 'secondary.main'),
                    color: 'text.primary'
                }}>
                    {isWinner ? <EmojiEvents /> : (isCurrentUser ? <Person /> : <Gamepad />)}
                </Avatar>
            </ListItemAvatar>
            <ListItemText
                primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography sx={{ color: 'text.primary' }} variant="body1" fontWeight={isWinner || isCurrentUser ? 600 : 400}>
                            {profile?.profile?.displayName ?? 'Unknown Player'}
                        </Typography>
                        {isWinner && (
                            <Chip
                                label="Winner"
                                size="small"
                                color="warning"
                                icon={<EmojiEvents sx={{ fontSize: 16 }} />}
                                sx={{ height: 20, fontSize: '0.7rem', color: 'text.primary' }}
                            />
                        )}
                        {isCurrentUser && !isWinner && (
                            <Chip
                                label="You"
                                size="small"
                                color="primary"
                                sx={{ height: 20, fontSize: '0.7rem', color: 'text.primary' }}
                            />
                        )}
                    </Box>
                }
            />
        </ListItem>
    );
}