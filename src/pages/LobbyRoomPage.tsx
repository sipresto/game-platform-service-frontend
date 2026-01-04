import {useEffect, useState} from 'react';
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
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useLobbyDetail, useLobbyActions } from "../hooks/useLobby";
import { useGameDetails } from "../hooks/useGames";
import { StartGameDialog } from '../components/lobby/StartGameDialog';
import { LobbyRoomHeader } from '../components/lobby/LobbyRoomHeader';
import { PlayerList } from '../components/lobby/PlayerList';
import { NotificationAlert } from '../components/lobby/NotificationAlert.tsx';
import type {GameStartRequest, InvitePlayerRequest, RemoveBotRequest} from '../model/lobby';
import { AddBotDialog } from "../components/lobby/AddBotDialog.tsx";
import { InviteFriendDialog } from "../components/lobby/InviteFriendDialog.tsx";
import { BotList } from "../components/lobby/BotList.tsx";
import {getFriendsList} from "../services/userApi.ts";
import type {PublicUserProfile} from "../model/userProfile.ts";

export const LobbyRoomPage = () => {
    const { gameId, lobbyId } = useParams<{ gameId: string; lobbyId: string }>();
    const navigate = useNavigate();
    const [friends, setFriends] = useState<PublicUserProfile[]>([]);

    const { game, loading: gameLoading, error: gameError } = useGameDetails(gameId);
    const { lobby, isHost, isLoading, error } = useLobbyDetail(lobbyId);
    const { leaveLobby, startGame, addBot, removeBot, invitePlayer } = useLobbyActions(gameId);

    const [startDialogOpen, setStartDialogOpen] = useState(false);
    const [botDialogOpen, setBotDialogOpen] = useState(false);
    const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
    const [difficulty, setDifficulty] = useState<'EASY' | 'MEDIUM' | 'HARD'>('MEDIUM');
    const [notification, setNotification] = useState<{
        type: 'success' | 'error';
        message: string;
    } | null>(null);

    useEffect(() => {
        // Fetch friends when component is mounted
        const fetchFriends = async () => {
            try {
                const friendsList = await getFriendsList();
                setFriends(friendsList);
            } catch (error) {
                console.error('Error fetching friends list:', error);
            }
        };

        fetchFriends();
    }, []);

    const handleLeave = () => {
        if (!lobbyId) return;

        leaveLobby.mutate(
            { lobbyId },
            {
                onSuccess: () => {
                    localStorage.removeItem(`game_${lobbyId}_url`);
                    navigate(`/lobby/${gameId}`);
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

    const hanleAddBot = () => {
        if (!lobbyId) return;

        const aiDifficultyMap: Record<string, GameStartRequest['difficulty']> = {
            'EASY': 'EASY',
            'MEDIUM': 'HARD',
            'HARD': 'IMPOSSIBLE'
        };

        const request: GameStartRequest = {
            difficulty: aiDifficultyMap[difficulty],
        };

        addBot.mutate(
            { lobbyId, request },
            {
                onSuccess: () => {
                    setBotDialogOpen(false);
                },
                onError: () => {
                    setNotification({
                        type: 'error',
                        message: 'Failed to add bot. Please try again.',
                    });
                    setBotDialogOpen(false);
                }
            }
        )
    }

    const handleRemoveBot = (bot: number) => {
        if (!lobbyId) return;

        const request: RemoveBotRequest = {
            botNumber: bot,
        }

        removeBot.mutate(
            { lobbyId, request },
            {
                onError: () => {
                    setNotification({
                        type: 'error',
                        message: 'Failed to remove bot. Please try again.',
                    });
                    setStartDialogOpen(false);
                }
            }
        )
    }

    const handleInvitePlayer = (id: string) => {
        if (!lobbyId || !gameId || !lobby || !game) return;

        const request: InvitePlayerRequest = {
            userId: id,
        }

        invitePlayer.mutate(
            { lobbyId, request },
            {
                onSuccess: () => {
                    setNotification({
                        type: 'success',
                        message: 'Invitation sent!'
                    });
                    setInviteDialogOpen(true);
                },
                onError: () => {
                    setNotification({
                        type: 'error',
                        message: 'Failed to invite user. Please try again.',
                    });
                    setInviteDialogOpen(false);
                }
            }
        )
    }

    const handleStartGameConfirm = () => {
        if (!lobbyId || !gameId || !lobby || !game) return;

        startGame.mutate(
            { lobbyId },
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

    if (gameLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (gameError || !game) {
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
                    Failed to load game details: {gameError || 'Unknown error'}
                </Alert>
            </Container>
        );
    }

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

                {lobby.bots.length !== 0 && (
                    <BotList
                        bots={lobby.bots}
                        onRemove={handleRemoveBot}
                    />
                )}

                <Box sx={{
                    display: 'flex',
                    gap: 2,
                    justifyContent: 'center',
                    flexDirection: 'column',
                    alignItems: 'center',
                    mt: 4
                }}>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        {isHost && (
                            <>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    startIcon={<PersonAddIcon/>}
                                    onClick={() => setInviteDialogOpen(true)}
                                    disabled={lobby.currentPlayerCount === lobby.maxPlayers}
                                >
                                    Invite a friend
                                </Button>

                                <Button
                                    variant="outlined"
                                    color="primary"
                                    startIcon={<SmartToyIcon/>}
                                    onClick={() => setBotDialogOpen(true)}
                                    disabled={lobby.currentPlayerCount === lobby.maxPlayers}
                                >
                                    Add a bot
                                </Button>
                            </>
                        )}
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
                                disabled={startGame.isPending || lobby.started || lobby.currentPlayerCount !== lobby.maxPlayers}
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
                    gameName={game.name}
                    onStartGame={handleStartGameConfirm}
                    isStarting={startGame.isPending}
                />
            )}

            {!lobby.started && (
                <AddBotDialog
                    open={botDialogOpen}
                    onClose={() => setBotDialogOpen(false)}
                    difficulty={difficulty}
                    onDifficultyChange={setDifficulty}
                    onAddBot={hanleAddBot}
                    isAdding={addBot.isPending}
                />
            )}

            {!lobby.started && (
                <InviteFriendDialog
                    open={inviteDialogOpen}
                    onClose={() => setInviteDialogOpen(false)}
                    onInviteUser={handleInvitePlayer}
                    friends={friends}
                    isInviting={addBot.isPending}
                />
            )}
        </Container>
    );
};