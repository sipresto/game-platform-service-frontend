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
    Paper,
    Skeleton
} from '@mui/material';
import {
    Close,
    Group,
    CalendarToday,
    Gamepad,
    Timer,
    MilitaryTech,
    Block,
    Handshake,
    SmartToy
} from '@mui/icons-material';
import { DifficultyChip } from './DifficultyChip';
import { PlayerListItem } from './PlayerListItem';
import { formatFullDate } from '../../utils/dateUtils';
import type { EnhancedSession } from '../../utils/sessionEnhancer';
import { useUserProfile } from '../../hooks/useUserProfile';
import { useGameDetails } from '../../hooks/useGames';

interface SessionDetailDialogProps {
    open: boolean;
    onClose: () => void;
    session: EnhancedSession | null;
}

export function SessionDetailDialog({ open, onClose, session }: SessionDetailDialogProps) {
    const { profile } = useUserProfile();
    const currentUserId = profile?.id;
    const { game, loading: gameLoading } = useGameDetails(session?.gameId);

    if (!session) return null;

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

    const resultConfig = getResultConfig(session.enhancedUserResult);

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ pb: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{
                            bgcolor: `${resultConfig.color}.main`,
                            width: 56, height: 56,
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
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
                    <IconButton onClick={onClose} size="small"><Close /></IconButton>
                </Box>
            </DialogTitle>

            <DialogContent>
                <Paper elevation={0} sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Gamepad sx={{ color: 'primary.main' }} />
                            <Typography variant="subtitle2" fontWeight={600}>Game Information</Typography>
                        </Box>
                        {session.isAgainstAI && (
                            <Chip label="vs AI" color="info" size="small" icon={<SmartToy />} sx={{ height: 24 }} />
                        )}
                    </Box>
                    {gameLoading ? (
                        <Skeleton width={200} height={24} />
                    ) : (
                        <Typography variant="body1">
                            {game?.name || 'Unknown Game'} {session.isAgainstAI && '(Single Player)'}
                        </Typography>
                    )}
                </Paper>

                <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: session.isAgainstAI ? '1fr 1fr' : '1fr',
                    gap: 2,
                    mb: 2
                }}>
                    <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            <CalendarToday sx={{ fontSize: 20, color: 'text.secondary' }} />
                            <Typography variant="caption" color="text.secondary">Completed</Typography>
                        </Box>
                        <Typography variant="body2" fontWeight={600}>{formatFullDate(session.completedAt)}</Typography>
                    </Paper>

                    {session.isAgainstAI && (
                        <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                <Timer sx={{ fontSize: 20, color: 'text.secondary' }} />
                                <Typography variant="caption" color="text.secondary">Difficulty</Typography>
                            </Box>
                            <DifficultyChip difficulty={session.difficulty} />
                        </Paper>
                    )}
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                        {session.isAgainstAI ?
                            <SmartToy sx={{ color: 'info.main' }} /> :
                            <Group sx={{ color: 'primary.main' }} />
                        }
                        <Typography variant="subtitle2" fontWeight={600}>
                            {session.isAgainstAI ? 'Player vs AI' : `Players (${session.playerIds?.length || 0})`}
                        </Typography>
                    </Box>

                    <List sx={{ p: 0 }}>
                        {session.playerIds?.map((playerId) => (
                            <PlayerListItem
                                key={playerId}
                                playerId={playerId}
                                isWinner={session.winnerId === playerId}
                                isCurrentUser={playerId === currentUserId}
                                isAI={false}
                            />
                        ))}

                        {session.isAgainstAI && (
                            <PlayerListItem
                                playerId="ai"
                                isWinner={session.result === 'AI_WIN'}
                                isCurrentUser={false}
                                isAI={true}
                            />
                        )}
                    </List>
                </Box>
            </DialogContent>
        </Dialog>
    );
}