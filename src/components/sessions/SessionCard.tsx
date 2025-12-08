import {
    Card,
    CardContent,
    Typography,
    Box,
    Chip,
    CardActionArea,
    Avatar,
    Skeleton
} from '@mui/material';
import {
    EmojiEvents,
    Group,
    CalendarToday,
    MilitaryTech,
    Block,
    Handshake,
    SentimentVerySatisfied,
    SentimentNeutral,
    SentimentVeryDissatisfied,
    Gamepad,
    SmartToy
} from '@mui/icons-material';
import type { Session } from "../../model/session.ts";
import {useCurrentUser, useUserProfileById} from '../../hooks/useUserProfile.ts';

interface SessionCardProps {
    session: Session;
    onClick: () => void;
}

export function SessionCard({ session, onClick }: SessionCardProps) {
    const { userId: currentUserId } = useCurrentUser();
    const { data: winnerProfile, isLoading: winnerLoading } = useUserProfileById(
        session.winnerId || ''
    );

    // Determine if session is against AI
    const isAgainstAI = session.result === 'AI_WIN' || session.playerIds.length === 1;

    // Determine user's result
    const getUserResult = (): 'WIN' | 'LOSS' | 'DRAW' => {
        if (!currentUserId) return 'DRAW';

        if (session.result === 'DRAW') return 'DRAW';

        if (session.result === 'PLAYER_WIN') {
            // Check if current user is the winner
            return session.winnerId === currentUserId ? 'WIN' : 'LOSS';
        }

        if (session.result === 'AI_WIN') {
            // User loses against AI, unless they're not a player (shouldn't happen)
            return 'LOSS';
        }

        return 'DRAW';
    };

    const userResult = getUserResult();
    const isUserWinner = userResult === 'WIN';

    const getResultConfig = (result: 'WIN' | 'LOSS' | 'DRAW') => {
        switch (result) {
            case 'WIN':
                return {
                    color: 'success' as const,
                    bgcolor: 'success.light',
                    icon: <MilitaryTech />,
                    label: 'Win'
                };
            case 'LOSS':
                return {
                    color: 'error' as const,
                    bgcolor: 'error.light',
                    icon: <Block />,
                    label: 'Loss'
                };
            case 'DRAW':
                return {
                    color: 'warning' as const,
                    bgcolor: 'warning.light',
                    icon: <Handshake />,
                    label: 'Draw'
                };
            default:
                return {
                    color: 'default' as const,
                    bgcolor: 'grey.300',
                    icon: <Gamepad />,
                    label: 'Unknown'
                };
        }
    };

    const getDifficultyConfig = (difficulty: string) => {
        switch (difficulty) {
            case 'EASY':
                return {
                    color: 'success' as const,
                    label: 'Easy',
                    icon: <SentimentVerySatisfied />
                };
            case 'MEDIUM':
                return {
                    color: 'warning' as const,
                    label: 'Medium',
                    icon: <SentimentNeutral />
                };
            case 'HARD':
                return {
                    color: 'error' as const,
                    label: 'Hard',
                    icon: <SentimentVeryDissatisfied />
                };
            default:
                return {
                    color: 'default' as const,
                    label: difficulty,
                    icon: <Gamepad />
                };
        }
    };

    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return 'Invalid date';

            const now = new Date();
            const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

            if (diffInHours < 24) {
                return date.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                });
            }
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: diffInHours > 8760 ? 'numeric' : undefined
            });
        } catch (e) {
            console.warn(e);
            return 'Invalid date';
        }
    };

    const resultConfig = getResultConfig(userResult);
    const difficultyConfig = getDifficultyConfig(session.difficulty);

    return (
        <Card
            sx={{
                width: 320,
                height: 'fit-content',
                position: 'relative',
                overflow: 'visible',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 8,
                },
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    bgcolor: resultConfig.bgcolor,
                    borderRadius: '4px 4px 0 0',
                }
            }}
        >
            <CardActionArea onClick={onClick}>
                <CardContent sx={{ p: 2.5 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar
                                sx={{
                                    bgcolor: resultConfig.bgcolor,
                                    width: 40,
                                    height: 40,
                                    fontSize: '1.2rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                {resultConfig.icon}
                            </Avatar>
                            <Box>
                                <Typography variant="subtitle2" fontWeight={600}>
                                    {resultConfig.label}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                                    <CalendarToday sx={{ fontSize: 14 }} />
                                    <Typography variant="caption">
                                        {formatDate(session.completedAt)}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>

                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
                            <Chip
                                label={difficultyConfig.label}
                                color={difficultyConfig.color}
                                size="small"
                                icon={difficultyConfig.icon}
                                sx={{ fontWeight: 500 }}
                            />
                            {isAgainstAI && (
                                <Chip
                                    label="vs AI"
                                    size="small"
                                    variant="outlined"
                                    color="info"
                                    icon={<SmartToy fontSize="small" />}
                                    sx={{ fontSize: '0.7rem' }}
                                />
                            )}
                        </Box>
                    </Box>

                    <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: 1.5,
                        mb: 2,
                        p: 1.5,
                        bgcolor: 'grey.50',
                        borderRadius: 1
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {isAgainstAI ? (
                                <SmartToy sx={{ fontSize: 20, color: 'info.main' }} />
                            ) : (
                                <Group sx={{ fontSize: 20, color: 'primary.main' }} />
                            )}
                            <Box>
                                <Typography variant="caption" color="text.secondary" display="block">
                                    {isAgainstAI ? 'Opponent' : 'Players'}
                                </Typography>
                                <Typography variant="body2" fontWeight={600}>
                                    {isAgainstAI ? 'AI' : `${session.playerIds?.length || 0} players`}
                                </Typography>
                            </Box>
                        </Box>

                        {session.winnerId && !isUserWinner && userResult !== 'DRAW' && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <EmojiEvents sx={{ fontSize: 20, color: 'warning.main' }} />
                                <Box sx={{ minWidth: 0, flex: 1 }}>
                                    <Typography variant="caption" color="text.secondary" display="block">
                                        Winner
                                    </Typography>
                                    {winnerLoading ? (
                                        <Skeleton width={80} height={20} />
                                    ) : (
                                        <Typography
                                            variant="body2"
                                            fontWeight={600}
                                            sx={{
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            {isAgainstAI ? 'AI' : (winnerProfile?.profile?.displayName || 'Opponent')}
                                        </Typography>
                                    )}
                                </Box>
                            </Box>
                        )}
                        {isUserWinner && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <MilitaryTech sx={{ fontSize: 20, color: 'success.main' }} />
                                <Box sx={{ minWidth: 0, flex: 1 }}>
                                    <Typography variant="caption" color="text.secondary" display="block">
                                        Result
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        fontWeight={600}
                                        sx={{
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        You Won!
                                    </Typography>
                                </Box>
                            </Box>
                        )}
                        {userResult === 'DRAW' && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Handshake sx={{ fontSize: 20, color: 'warning.main' }} />
                                <Box sx={{ minWidth: 0, flex: 1 }}>
                                    <Typography variant="caption" color="text.secondary" display="block">
                                        Result
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        fontWeight={600}
                                        sx={{
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        Draw
                                    </Typography>
                                </Box>
                            </Box>
                        )}
                    </Box>

                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        pt: 1,
                        borderTop: 1,
                        borderColor: 'divider'
                    }}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
                            #{session.id?.slice(0, 8) || 'unknown'}
                        </Typography>
                        <Chip
                            label="View Details"
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: '0.7rem', height: 22 }}
                        />
                    </Box>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}