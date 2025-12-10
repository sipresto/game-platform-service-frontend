import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import {
    Container,
    Box,
    Typography,
    Button,
    Paper,
    CircularProgress,
    Alert
} from '@mui/material';
import { ExitToApp as ExitIcon, PlayArrow as PlayIcon } from '@mui/icons-material';

import { useLobbyDetail, useLobbyActions } from "../hooks/useLobby";
import { StartGameDialog } from '../components/lobby/StartGameDialog';
import { LobbyRoomHeader } from '../components/lobby/LobbyRoomHeader';
import { PlayerList } from '../components/lobby/PlayerList';
import { NotificationAlert } from '../components/NotificationAlert';
import type { StartGameRequest } from '../model/lobby';

export const LobbyRoomPage = () => {
    const { gameId, lobbyId } = useParams<{ gameId: string; lobbyId: string }>();
    const navigate = useNavigate();

    const { lobby, isHost, isLoading, error } = useLobbyDetail(lobbyId);
    const { leaveLobby, startGame } = useLobbyActions(gameId);

    const [startDialogOpen, setStartDialogOpen] = useState(false);
    const [difficulty, setDifficulty] = useState<'EASY' | 'MEDIUM' | 'HARD'>('MEDIUM');
    const [notification, setNotification] = useState<{
        type: 'success' | 'error';
        message: string;
    } | null>(null);

    const handleLeave = () => {
        if (!lobbyId) return;

        leaveLobby.mutate(
            { lobbyId },
            {
                onSuccess: () => {
                    localStorage.removeItem(`game_${lobbyId}_url`);
                    navigate(`/game/${gameId}/lobbies`);
                },
                onError: () => {
                    setNotification({
                        type: 'error',
                        message: 'Failed to leave lobby. Please try again.',
                    });
                }
            }
        );
    };

    const handleStartGameConfirm = () => {
        if (!lobbyId || !gameId || !lobby) return;

        const aiDifficultyMap: Record<string, StartGameRequest['difficulty']> = {
            'EASY': 'EASY',
            'MEDIUM': 'HARD',
            'HARD': 'IMPOSSIBLE'
        };

        const request: StartGameRequest = {
            gameId,
            players: lobby.players.map((player) => player.id),
            difficulty: aiDifficultyMap[difficulty],
        };

        startGame.mutate(
            { lobbyId, request },
            {
                onError: () => {
                    setNotification({
                        type: 'error',
                        message: 'Failed to start game. Please try again.',
                    });
                    setStartDialogOpen(false);
                }
            }
        );
    };

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error || !lobby) {
        return (
            <Container maxWidth="sm" sx={{ mt: 4 }}>
                <Alert
                    severity="error"
                    action={
                        <Button
                            color="inherit"
                            size="small"
                            onClick={() => navigate(`/game/${gameId}/lobbies`)}
                        >
                            Return to lobbies
                        </Button>
                    }
                >
                    Lobby not found. The game may have started or the lobby was closed.
                </Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ py: 8 }}>
            <NotificationAlert
                notification={notification}
                onClose={() => setNotification(null)}
            />

            <Paper elevation={3} sx={{ p: 4 }}>
                <LobbyRoomHeader
                    lobby={lobby}
                    currentPlayerCount={lobby.currentPlayerCount}
                    maxPlayers={lobby.maxPlayers}
                />

                <PlayerList
                    players={lobby.players}
                    hostId={lobby.hostId}
                />

                <Box sx={{
                    display: 'flex',
                    gap: 2,
                    justifyContent: 'center',
                    flexDirection: 'column',
                    alignItems: 'center',
                    mt: 4
                }}>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                            variant="outlined"
                            color="error"
                            startIcon={<ExitIcon />}
                            onClick={handleLeave}
                            disabled={leaveLobby.isPending}
                        >
                            Leave Lobby
                        </Button>

                        {isHost && (
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<PlayIcon />}
                                onClick={() => setStartDialogOpen(true)}
                                disabled={startGame.isPending || lobby.started}
                            >
                                {lobby.started ? 'Game Started' : 'Start Game'}
                            </Button>
                        )}
                    </Box>

                    {!isHost && !lobby.started && (
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontStyle: 'italic', mt: 1 }}
                        >
                            Waiting for the host to start the game...
                        </Typography>
                    )}
                </Box>
            </Paper>

            {!lobby.started && (
                <StartGameDialog
                    open={startDialogOpen}
                    onClose={() => setStartDialogOpen(false)}
                    difficulty={difficulty}
                    onDifficultyChange={setDifficulty}
                    onStartGame={handleStartGameConfirm}
                    isStarting={startGame.isPending}
                />
            )}
        </Container>
    );
};