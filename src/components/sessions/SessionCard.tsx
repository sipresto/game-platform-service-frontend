import {
    Card,
    CardContent,
    Typography,
    Box,
    Chip,
    CardActionArea,
    Skeleton
} from '@mui/material';
import { CalendarToday, Gamepad, SmartToy } from '@mui/icons-material';
import { ResultBadge } from './ResultBadge';
import { formatDate } from '../../utils/dateUtils';
import type { EnhancedSession } from '../../utils/sessionEnhancer';
import { useGameDetails } from "../../hooks/useGames";

interface SessionCardProps {
    session: EnhancedSession;
    onClick: () => void;
}

export function SessionCard({ session, onClick }: SessionCardProps) {
    const { game, loading: gameLoading } = useGameDetails(session.gameId);

    const difficultyText: string = "vs (" + session.difficulty.toLowerCase() + ") AI";

    const resultColors: Record<string, string> = {
        WIN: 'success.light',
        LOSS: 'error.light',
        DRAW: 'warning.light'
    };

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
                    bgcolor: resultColors[session.enhancedUserResult],
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
                        <ResultBadge result={session.enhancedUserResult} />

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            {session.isAgainstAI && (
                                <Chip
                                    label={difficultyText}
                                    size="small"
                                    variant="outlined"
                                    color="info"
                                    icon={<SmartToy sx={{color: 'text.primary' }} fontSize="small" />}
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