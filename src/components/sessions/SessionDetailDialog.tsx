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
    SentimentVeryDissatisfied,
    SmartToy,
    Person
} from '@mui/icons-material';
import type { Session } from "../../model/session.ts";
import {useCurrentUser, useUserProfileById} from '../../hooks/useUserProfile';

interface SessionDetailDialogProps {
    open: boolean;
    onClose: () => void;
    session: Session | null;
}

function PlayerListItem({ playerId, isWinner, isCurrentUser, isAI = false }: {
    playerId: string;
    isWinner: boolean;
    isCurrentUser: boolean;
    isAI?: boolean;
}) {
    const { data: profile, isLoading } = useUserProfileById(isAI ? '' : playerId);

    if (isAI) {
        return (
            <ListItem
                sx={{
                    bgcolor: isWinner ? 'info.lighter' : 'transparent',
                    borderRadius: 1,
                    mb: 0.5
                }}
            >
                <ListItemAvatar>
                    <Avatar sx={{
                        bgcolor: isWinner ? 'info.main' : 'grey.500'
                    }}>
                        <SmartToy />
                    </Avatar>
                </ListItemAvatar>
                <ListItemText
                    primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body1" fontWeight={isWinner ? 600 : 400}>
                                AI Opponent
                            </Typography>
                            {isWinner && (
                                <Chip
                                    label="Winner"
                                    size="small"
                                    color="info"
                                    icon={<EmojiEvents sx={{ fontSize: 16 }} />}
                                    sx={{ height: 20, fontSize: '0.7rem' }}
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
                border: isCurrentUser ? '2px solid #1976d2' : 'none'
            }}
        >
            <ListItemAvatar>
                <Avatar sx={{
                    bgcolor: isWinner ? 'warning.main' : (isCurrentUser ? 'primary.main' : 'secondary.main')
                }}>
                    {isWinner ? <EmojiEvents /> : (isCurrentUser ? <Person /> : <Gamepad />)}
                </Avatar>
            </ListItemAvatar>
            <ListItemText
                primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body1" fontWeight={isWinner || isCurrentUser ? 600 : 400}>
                            {isCurrentUser ? 'You' : (profile?.profile?.displayName || 'Unknown Player')}
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
                        {isCurrentUser && !isWinner && (
                            <Chip
                                label="You"
                                size="small"
                                color="primary"
                                sx={{ height: 20, fontSize: '0.7rem' }}
                            />
                        )}
                    </Box>
                }
                secondary={`ID: ${playerId?.slice(0, 8) || 'unknown'}...`}
            />
        </ListItem>
    );
}

export function SessionDetailDialog({ open, onClose, session }: SessionDetailDialogProps) {
    const { userId: currentUserId } = useCurrentUser();

    if (!session) return null;

    // Determine if against AI
    const isAgainstAI = session.result === 'AI_WIN' || session.playerIds.length === 1;

    // Determine user's result
    const getUserResult = (): 'WIN' | 'LOSS' | 'DRAW' => {
        if (!currentUserId) return 'DRAW';

        if (session.result === 'DRAW') return 'DRAW';

        if (session.result === 'PLAYER_WIN') {
            return session.winnerId === currentUserId ? 'WIN' : 'LOSS';
        }

        if (session.result === 'AI_WIN') {
            return 'LOSS';
        }

        return 'DRAW';
    };

    const userResult = getUserResult();

    const getResultConfig = (result: 'WIN' | 'LOSS' | 'DRAW') => {
        switch (result) {
            case 'WIN':
                return {
                    color: 'success' as const,
                    icon: <MilitaryTech />,
                    text: 'Victory!',
                    description: 'You won this game'
                };
            case 'LOSS':
                return {
                    color: 'error' as const,
                    icon: <Block />,
                    text: 'Defeat',
                    description: 'You lost this game'
                };
            case 'DRAW':
                return {
                    color: 'warning' as const,
                    icon: <Handshake />,
                    text: 'Draw',
                    description: 'The game ended in a draw'
                };
            default:
                return {
                    color: 'default' as const,
                    icon: <Gamepad />,
                    text: 'Unknown',
                    description: 'Game result unknown'
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

    const resultConfig = getResultConfig(userResult);
    const difficultyConfig = getDifficultyConfig(session.difficulty);

    const formatFullDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return 'Invalid date';

            return date.toLocaleString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (e) {
            console.warn(e);
            return 'Invalid date';
        }
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
                                {resultConfig.description}
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
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Gamepad sx={{ color: 'primary.main' }} />
                            <Typography variant="subtitle2" fontWeight={600}>
                                Game Information
                            </Typography>
                        </Box>
                        {isAgainstAI && (
                            <Chip
                                label="vs AI"
                                color="info"
                                size="small"
                                icon={<SmartToy />}
                                sx={{ height: 24 }}
                            />
                        )}
                    </Box>
                    <Typography variant="body1">
                        Tic Tac Toe {isAgainstAI && '(Single Player)'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        Game ID: {session.gameId || 'Unknown'}
                    </Typography>
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
                        {isAgainstAI ? (
                            <SmartToy sx={{ color: 'info.main' }} />
                        ) : (
                            <Group sx={{ color: 'primary.main' }} />
                        )}
                        <Typography variant="subtitle2" fontWeight={600}>
                            {isAgainstAI ? 'Player vs AI' : `Players (${session.playerIds?.length || 0})`}
                        </Typography>
                    </Box>

                    <List sx={{ p: 0 }}>
                        {/* Human players */}
                        {session.playerIds?.map((playerId) => (
                            <PlayerListItem
                                key={playerId}
                                playerId={playerId}
                                isWinner={session.winnerId === playerId}
                                isCurrentUser={playerId === currentUserId}
                                isAI={false}
                            />
                        ))}

                        {/* AI opponent (if applicable) */}
                        {isAgainstAI && (
                            <PlayerListItem
                                playerId="ai"
                                isWinner={session.result === 'AI_WIN'}
                                isCurrentUser={false}
                                isAI={true}
                            />
                        )}
                    </List>
                </Box>

                <Paper elevation={0} sx={{ p: 1.5, bgcolor: 'grey.100', textAlign: 'center' }}>
                    <Typography variant="caption" color="text.secondary" display="block">
                        Session ID
                    </Typography>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                        {session.id || 'Unknown'}
                    </Typography>
                </Paper>
            </DialogContent>
        </Dialog>
    );
}