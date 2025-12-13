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
import { useUserProfile, useUserProfileById } from '../../hooks/useUserProfile.ts';
import {useGameDetails} from "../../hooks/useGames.ts";


interface SessionCardProps {
    session: Session;
    onClick: () => void;
}

export function SessionCard({ session, onClick }: SessionCardProps) {
    const { profile, isLoading: isUserLoading } = useUserProfile();
    const currentUserId = profile?.id;

    useUserProfileById(
        session.winnerId && session.winnerId !== currentUserId ? session.winnerId : ''
    );

    const { game, loading: gameLoading } = useGameDetails(session.gameId);

    const isAgainstAI = session.result === 'AI_WIN' || (session.playerIds && session.playerIds.length === 1);

    const getUserResult = (): 'WIN' | 'LOSS' | 'DRAW' | 'LOADING' => {
        if (isUserLoading || !currentUserId) return 'LOADING';

        if (session.result === 'AI_WIN') return 'LOSS';
        if (session.result === 'DRAW') return 'DRAW';

        if (session.result === 'PLAYER_WIN') {
            if (session.winnerId === currentUserId) return 'WIN';
            if (session.playerIds?.length === 1 && session.playerIds[0] === currentUserId) return 'WIN';
            return 'LOSS';
        }

        return 'DRAW';
    };

    const userResult = getUserResult();
    const getResultConfig = (result: 'WIN' | 'LOSS' | 'DRAW' | 'LOADING') => {
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
            case 'LOADING':
                return {
                    color: 'default' as const,
                    bgcolor: 'grey.200',
                    icon: <Skeleton variant="circular" width={24} height={24} />,
                    label: '...'
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

    // Helper function to get user-friendly difficulty display name
    const getDifficultyDisplayName = (difficulty: string): string => {
        switch (difficulty) {
            case 'EASY': return 'Easy';
            case 'HARD': return 'Medium';
            case 'IMPOSSIBLE': return 'Hard';
            default: return difficulty;
        }
    };

    const getDifficultyConfig = (difficulty: string) => {
        const displayName = getDifficultyDisplayName(difficulty);
        switch (difficulty) {
            case 'EASY': return { color: 'success' as const, label: displayName, icon: <SentimentVerySatisfied /> };
            case 'HARD': return { color: 'warning' as const, label: displayName, icon: <SentimentNeutral /> };
            case 'IMPOSSIBLE': return { color: 'error' as const, label: displayName, icon: <SentimentVeryDissatisfied /> };
            default: return { color: 'default' as const, label: displayName, icon: <Gamepad /> };
        }
    };

    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return 'Invalid date';
            const now = new Date();
            const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
            if (diffInHours < 24) {
                return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
            }
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: diffInHours > 8760 ? 'numeric' : undefined });
        } catch (e) {
            console.error(e);
            return 'Invalid date';
        }
    };

    const resultConfig = getResultConfig(userResult);
    const difficultyConfig = getDifficultyConfig(session.difficulty);
    return (
        <Card
            sx={{
                width: 320,
                position: 'relative',
                overflow: 'visible',
                transition: 'all 0.3s ease',
                '&:hover': { transform: 'translateY(-4px)', boxShadow: 8 },
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0, left: 0, right: 0, height: 4,
                    bgcolor: resultConfig.bgcolor,
                    borderRadius: '4px 4px 0 0',
                }
            }}
        >
            <CardActionArea onClick={onClick}>
                <CardContent sx={{ p: 2.5 }}>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Gamepad sx={{ fontSize: 18, color: 'text.secondary' }} />
                        {gameLoading ? (
                            <Skeleton width={120} height={20} />
                        ) : (
                            <Typography variant="subtitle2" fontWeight={600}>
                                {game?.name || 'Unknown Game'}
                            </Typography>
                        )}
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar sx={{ bgcolor: resultConfig.bgcolor, width: 40, height: 40 }}>
                                {resultConfig.icon}
                            </Avatar>
                            <Box>
                                <Typography variant="subtitle2" fontWeight={600}>
                                    {resultConfig.label}
                                </Typography>
                            </Box>
                        </Box>

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            {isAgainstAI && (
                                <Chip
                                    label={difficultyConfig.label}
                                    color={difficultyConfig.color}
                                    size="small"
                                    icon={difficultyConfig.icon}
                                />
                            )}
                            {isAgainstAI && (
                                <Chip
                                    label="vs AI"
                                    size="small"
                                    variant="outlined"
                                    color="info"
                                    icon={<SmartToy fontSize="small" />}
                                />
                            )}
                        </Box>
                    </Box>

                    <Box sx={{ borderTop: 1, pt: 1, display: 'flex', justifyContent: 'space-between', borderColor: 'divider' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                            <CalendarToday sx={{ fontSize: 14 }} />
                            <Typography variant="caption">
                                {formatDate(session.completedAt)}
                            </Typography>
                        </Box>
                        <Chip label="View Details" size="small" variant="outlined" />
                    </Box>

                </CardContent>
            </CardActionArea>
        </Card>
    );
}