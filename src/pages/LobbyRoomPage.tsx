import { useState, useEffect } from 'react';
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

    const { lobby, isHost, isLoading, error, gameUrl, isFetchingGameUrl, refetchGameUrl } = useLobbyDetail(lobbyId);
    const { leaveLobby, startGame } = useLobbyActions(gameId);

    const [startDialogOpen, setStartDialogOpen] = useState(false);
    const [difficulty, setDifficulty] = useState<'EASY' | 'MEDIUM' | 'HARD'>('MEDIUM');
    const [notification, setNotification] = useState<{
        type: 'success' | 'error';
        message: string;
    } | null>(null);

    // Game started detection using the started flag from lobby details
    useEffect(() => {
        if (!lobbyId || isHost) return;

        // If lobby shows started, try to get game URL and redirect
        if (lobby?.started) {
            const storedUrl = localStorage.getItem(`game_${lobbyId}_url`);

            if (storedUrl) {
                console.log(`Game started! Found URL in localStorage, redirecting to: ${storedUrl}`);

                setNotification({
                    type: 'success',
                    message: 'Game started! Redirecting...'
                });

                setTimeout(() => {
                    window.location.href = storedUrl;
                }, 800);
            } else if (gameUrl) {
                // Use the URL fetched/constructed by the hook
                console.log(`Game started! Using constructed URL, redirecting to: ${gameUrl}`);

                setNotification({
                    type: 'success',
                    message: 'Game started! Redirecting...'
                });

                setTimeout(() => {
                    window.location.href = gameUrl;
                }, 800);
            } else {
                // No URL found, show error or try to fetch
                setNotification({
                    type: 'success',
                    message: 'Game started but URL not found. Trying to fetch...'
                });

                // Try to fetch the URL
                refetchGameUrl();
            }
        }
    }, [lobby, lobbyId, isHost, gameUrl, refetchGameUrl]);

    const handleLeave = () => {
        if (!lobbyId) return;

        leaveLobby.mutate(
            { lobbyId },
            {
                onSuccess: () => {
                    // Clean up stored URLs
                    localStorage.removeItem(`game_${lobbyId}_url`);
                    localStorage.removeItem('currentLobbyId');
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
                onSuccess: (data) => {
                    console.log(`Host: Game started for lobby ${lobbyId}, URL: ${data.url}`);

                    setNotification({
                        type: 'success',
                        message: 'Game started! Redirecting...',
                    });

                    // Small delay for UX
                    setTimeout(() => {
                        window.location.href = data.url;
                    }, 800);
                },
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

    const handleRetryGameUrl = () => {
        if (!lobbyId) return;

        setNotification({
            type: 'success',
            message: 'Retrying to fetch game URL...'
        });

        refetchGameUrl();
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

                    {!isHost && (
                        <>
                            {lobby.started ? (
                                <Box sx={{ textAlign: 'center', mt: 2 }}>
                                    {isFetchingGameUrl ? (
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <CircularProgress size={20} />
                                            <Typography
                                                variant="body2"
                                                color="info.main"
                                                sx={{ fontStyle: 'italic' }}
                                            >
                                                Fetching game URL...
                                            </Typography>
                                        </Box>
                                    ) : gameUrl ? (
                                        <>
                                            <Typography
                                                variant="body2"
                                                color="success.main"
                                                sx={{ fontStyle: 'italic', mb: 1 }}
                                            >
                                                Game has started! Redirecting to game...
                                            </Typography>
                                            <Typography
                                                variant="caption"
                                                color="text.secondary"
                                                sx={{ display: 'block' }}
                                            >
                                                URL: {gameUrl}
                                            </Typography>
                                        </>
                                    ) : (
                                        <>
                                            <Typography
                                                variant="body2"
                                                color="warning.main"
                                                sx={{ fontStyle: 'italic', mb: 1 }}
                                            >
                                                Game started but URL not found.
                                            </Typography>
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                onClick={handleRetryGameUrl}
                                                sx={{ mt: 1 }}
                                            >
                                                Retry Fetching URL
                                            </Button>
                                        </>
                                    )}
                                </Box>
                            ) : (
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ fontStyle: 'italic', mt: 1 }}
                                >
                                    Waiting for the host to start the game...
                                </Typography>
                            )}
                        </>
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