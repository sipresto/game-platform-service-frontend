import {
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Box,
    Typography,
    Chip,
    Avatar,
    Divider,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Skeleton,
    Paper
} from '@mui/material';
import {
    Close,
    EmojiEvents,
    Group,
    CalendarToday,
    Gamepad,
    Timer,
    MilitaryTech,
    Block,
    Handshake,
    SentimentVerySatisfied,
    SentimentNeutral,
    SentimentVeryDissatisfied
} from '@mui/icons-material';
import type { Session } from "../../model/session.ts";
import { useUserProfileById } from '../../hooks/useUserProfile';
import { useGameDetails } from '../../hooks/useGames';

interface SessionDetailDialogProps {
    open: boolean;
    onClose: () => void;
    session: Session | null;
}

function PlayerListItem({ playerId, isWinner }: { playerId: string; isWinner: boolean }) {
    const { data: profile, isLoading } = useUserProfileById(playerId);

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
                mb: 0.5
            }}
        >
            <ListItemAvatar>
                <Avatar sx={{ bgcolor: isWinner ? 'warning.main' : 'primary.main' }}>
                    {isWinner ? <EmojiEvents /> : <Gamepad />}
                </Avatar>
            </ListItemAvatar>
            <ListItemText
                primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body1" fontWeight={isWinner ? 600 : 400}>
                            {profile?.profile?.displayName || 'Unknown Player'}
                        </Typography>
                        {isWinner && (
                            <Chip
                                label="Winner"
                                size="small"
                                color="warning"
                                icon={<EmojiEvents sx={{ fontSize: 16 }} />}
                                sx={{ height: 20, fontSize: '0.7rem' }}
                            />
                        )}
                    </Box>
                }
                secondary={`ID: ${playerId.slice(0, 8)}...`}
            />
        </ListItem>
    );
}

export function SessionDetailDialog({ open, onClose, session }: SessionDetailDialogProps) {
    const { game, loading: gameLoading } = useGameDetails(session?.gameId);

    if (!session) return null;

    const getResultConfig = (result: string) => {
        switch (result) {
            case 'WIN':
                return {
                    color: 'success' as const,
                    icon: <MilitaryTech />,
                    text: 'Victory!'
                };
            case 'LOSS':
                return {
                    color: 'error' as const,
                    icon: <Block />,
                    text: 'Defeat'
                };
            case 'DRAW':
                return {
                    color: 'warning' as const,
                    icon: <Handshake />,
                    text: 'Draw'
                };
            default:
                return {
                    color: 'default' as const,
                    icon: <Gamepad />,
                    text: result
                };
        }
    };

    const getDifficultyConfig = (difficulty: string) => {
        switch (difficulty) {
            case 'EASY':
                return {
                    color: 'success' as const,
                    icon: <SentimentVerySatisfied />
                };
            case 'MEDIUM':
                return {
                    color: 'warning' as const,
                    icon: <SentimentNeutral />
                };
            case 'HARD':
                return {
                    color: 'error' as const,
                    icon: <SentimentVeryDissatisfied />
                };
            default:
                return {
                    color: 'default' as const,
                    icon: <Gamepad />
                };
        }
    };

    const resultConfig = getResultConfig(session.result);
    const difficultyConfig = getDifficultyConfig(session.difficulty);

    const formatFullDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle sx={{ pb: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{
                            bgcolor: `${resultConfig.color}.main`,
                            width: 56,
                            height: 56,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            {resultConfig.icon}
                        </Avatar>
                        <Box>
                            <Typography variant="h5" fontWeight={600}>
                                {resultConfig.text}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Session Details
                            </Typography>
                        </Box>
                    </Box>
                    <IconButton onClick={onClose} size="small">
                        <Close />
                    </IconButton>
                </Box>
            </DialogTitle>

            <DialogContent>
                <Paper elevation={0} sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Gamepad sx={{ color: 'primary.main' }} />
                        <Typography variant="subtitle2" fontWeight={600}>
                            Game Information
                        </Typography>
                    </Box>
                    {gameLoading ? (
                        <Skeleton width="100%" height={24} />
                    ) : (
                        <Typography variant="body1">
                            {game?.name || 'Unknown Game'}
                        </Typography>
                    )}
                </Paper>

                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
                    <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            <CalendarToday sx={{ fontSize: 20, color: 'text.secondary' }} />
                            <Typography variant="caption" color="text.secondary">
                                Completed
                            </Typography>
                        </Box>
                        <Typography variant="body2" fontWeight={600}>
                            {formatFullDate(session.completedAt)}
                        </Typography>
                    </Paper>

                    <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            <Timer sx={{ fontSize: 20, color: 'text.secondary' }} />
                            <Typography variant="caption" color="text.secondary">
                                Difficulty
                            </Typography>
                        </Box>
                        <Chip
                            label={session.difficulty}
                            color={difficultyConfig.color}
                            size="small"
                            icon={difficultyConfig.icon}
                        />
                    </Paper>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                        <Group sx={{ color: 'primary.main' }} />
                        <Typography variant="subtitle2" fontWeight={600}>
                            Players ({session.playerIds.length})
                        </Typography>
                    </Box>
                    <List sx={{ p: 0 }}>
                        {session.playerIds.map((playerId) => (
                            <PlayerListItem
                                key={playerId}
                                playerId={playerId}
                                isWinner={playerId === session.winnerId}
                            />
                        ))}
                    </List>
                </Box>

                <Paper elevation={0} sx={{ p: 1.5, bgcolor: 'grey.100', textAlign: 'center' }}>
                    <Typography variant="caption" color="text.secondary" display="block">
                        Session ID
                    </Typography>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                        {session.id}
                    </Typography>
                </Paper>
            </DialogContent>
        </Dialog>
    );
}