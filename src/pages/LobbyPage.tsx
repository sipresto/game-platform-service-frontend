import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import {
    Container,
    Alert,
    Box,
    CircularProgress,
    Typography
} from '@mui/material';
import { People as PeopleIcon } from '@mui/icons-material';
import { LobbyHeader } from '../components/lobby/LobbyHeader';
import { CreateLobbyDialog } from '../components/lobby/CreateLobbyDialog';
import { JoinLobbyDialog } from '../components/lobby/JoinLobbyDialog';
import { StartGameDialog } from '../components/lobby/StartGameDialog';
import { NotificationAlert } from '../components/NotificationAlert.tsx';
import { LobbyGrid } from '../components/lobby/LobbyGrid';
import { useLobbies, useLobbyActions } from "../hooks/useLobby";
import { useGameDetails } from "../hooks/useGames";
import type { CreateLobbyRequest, JoinLobbyRequest, StartGameRequest } from '../model/lobby';

export const LobbyPage = () => {
    const { gameId } = useParams<{ gameId: string }>();

    const { lobbies, isLoading, error, refetch } = useLobbies(gameId);
    const { createLobby, joinLobby, leaveLobby, startGame } = useLobbyActions(gameId);
    const { game, loading: gameLoading, error: gameError } = useGameDetails(gameId);

    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [joinDialogOpen, setJoinDialogOpen] = useState(false);
    const [startDialogOpen, setStartDialogOpen] = useState(false);
    const [selectedLobbyId, setSelectedLobbyId] = useState<string | null>(null);

    const [maxPlayers, setMaxPlayers] = useState(2);
    const [isPrivate, setIsPrivate] = useState(false);
    const [password, setPassword] = useState('');
    const [joinPassword, setJoinPassword] = useState('');
    const [difficulty, setDifficulty] = useState<'EASY' | 'MEDIUM' | 'HARD'>('MEDIUM');

    const [notification, setNotification] = useState<{
        type: 'success' | 'error';
        message: string;
    } | null>(null);

    const handleJoinLobby = (lobbyId: string, isPrivateLobby: boolean) => {
        setSelectedLobbyId(lobbyId);
        if (isPrivateLobby) {
            setJoinDialogOpen(true);
        } else {
            const request: JoinLobbyRequest = { password: null };

            joinLobby.mutate(
                { lobbyId, request },
                {
                    onSuccess: () => {
                        setNotification({
                            type: 'success',
                            message: 'Successfully joined lobby! Waiting for game to start...',
                        });
                        localStorage.setItem('currentLobbyId', lobbyId);
                        setJoinPassword('');
                    },
                    onError: () => {
                        setNotification({
                            type: 'error',
                            message: 'Failed to join lobby. Check your password and try again.',
                        });
                    },
                }
            );
        }
    };

    const handleJoinWithPassword = () => {
        if (!selectedLobbyId) return;

        const request: JoinLobbyRequest = { password: joinPassword };

        joinLobby.mutate(
            { lobbyId: selectedLobbyId, request },
            {
                onSuccess: () => {
                    setNotification({
                        type: 'success',
                        message: 'Successfully joined lobby! Waiting for game to start...',
                    });
                    localStorage.setItem('currentLobbyId', selectedLobbyId);
                    setJoinDialogOpen(false);
                    setJoinPassword('');
                },
                onError: () => {
                    setNotification({
                        type: 'error',
                        message: 'Failed to join lobby. Check your password and try again.',
                    });
                },
            }
        );
    };

    const handleLeaveLobby = (lobbyId: string) => {
        setSelectedLobbyId(null);

        leaveLobby.mutate(
            { lobbyId },
            {
                onSuccess: () => {
                    setNotification({
                        type: 'success',
                        message: 'Successfully left lobby!',
                    });
                    localStorage.removeItem('currentLobbyId');
                },
                onError: () => {
                    setNotification({
                        type: 'error',
                        message: 'Failed to leave lobby.',
                    })
                }
            }
        )
    };

    useEffect(() => {
        return () => {

        };
    }, []);

    const resetCreateForm = () => {
        setMaxPlayers(2);
        setIsPrivate(false);
        setPassword('');
    };

    const handleCreateLobby = () => {
        if (!gameId) return;

        const request: CreateLobbyRequest = {
            gameId,
            maxPlayers,
            password: isPrivate && password ? password : null,
        };

        createLobby.mutate(request, {
            onSuccess: () => {
                setNotification({
                    type: 'success',
                    message: `Lobby created successfully!`,
                });
                setCreateDialogOpen(false);
                resetCreateForm();
            },
            onError: () => {
                setNotification({
                    type: 'error',
                    message: 'Failed to create lobby. Please try again.',
                });
            },
        });
    };

    const handleStartGame = (lobbyId: string) => {
        setSelectedLobbyId(lobbyId);
        setStartDialogOpen(true);
    };

    const handleStartGameConfirm = () => {
        if (!selectedLobbyId || !gameId) return;

        let aiDifficulty: StartGameRequest['difficulty'];

        switch (difficulty) {
            case 'EASY':
                aiDifficulty = 'EASY';
                break;
            case 'MEDIUM':
                aiDifficulty = 'HARD';
                break;
            case 'HARD':
                aiDifficulty = 'IMPOSSIBLE';
                break;
        }

        const request: StartGameRequest = {
            gameId,
            players: [],
            difficulty: aiDifficulty,
        };

        startGame.mutate(
            { lobbyId: selectedLobbyId, request },
            {
                onSuccess: (data) => {
                    setNotification({
                        type: 'success',
                        message: 'Game started successfully! Redirecting...',
                    });
                    setTimeout(() => {
                        window.location.href = data.url;
                    }, 1000);
                },
                onError: () => {
                    setNotification({
                        type: 'error',
                        message: 'Failed to start game. Please try again.',
                    });
                },
            }
        );
    };

    if (!gameId) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Alert severity="error">No game selected</Alert>
            </Container>
        );
    }

    if (gameLoading) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    if (gameError) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Alert severity="error">
                    Failed to load game details: {gameError.message}
                </Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <LobbyHeader
                game={game}
                onCreateLobby={() => setCreateDialogOpen(true)}
                onRefresh={refetch}
            />

            <NotificationAlert
                notification={notification}
                onClose={() => setNotification(null)}
            />

            {isLoading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                    <CircularProgress />
                </Box>
            )}

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    Failed to load lobbies. Please try again.
                </Alert>
            )}

            {!isLoading && !error && lobbies && lobbies.length === 0 && (
                <LobbyEmptyState gameName={game?.name} />
            )}

            {!isLoading && !error && lobbies && lobbies.length > 0 && (
                <LobbyGrid
                    lobbies={lobbies}
                    onJoinLobby={handleJoinLobby}
                    onLeaveLobby={handleLeaveLobby}
                    onStartGame={handleStartGame}
                    isJoining={joinLobby.isPending}
                    isLeaving={leaveLobby.isPending}
                    isStarting={startGame.isPending}
                />
            )}

            <CreateLobbyDialog
                open={createDialogOpen}
                onClose={() => setCreateDialogOpen(false)}
                gameName={game?.name}
                maxPlayers={maxPlayers}
                isPrivate={isPrivate}
                password={password}
                onMaxPlayersChange={setMaxPlayers}
                onIsPrivateChange={setIsPrivate}
                onPasswordChange={setPassword}
                onCreateLobby={handleCreateLobby}
                isCreating={createLobby.isPending}
            />

            <JoinLobbyDialog
                open={joinDialogOpen}
                onClose={() => setJoinDialogOpen(false)}
                password={joinPassword}
                onPasswordChange={setJoinPassword}
                onJoinLobby={handleJoinWithPassword}
                isJoining={joinLobby.isPending}
            />

            <StartGameDialog
                open={startDialogOpen}
                onClose={() => setStartDialogOpen(false)}
                gameName={game?.name}
                difficulty={difficulty}
                onDifficultyChange={setDifficulty}
                onStartGame={handleStartGameConfirm}
                isStarting={startGame.isPending}
            />
        </Container>
    );
};

const LobbyEmptyState = ({ gameName }: { gameName?: string }) => (
    <Box sx={{ py: 8, textAlign: 'center' }}>
        <PeopleIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
            No lobbies available for {gameName || 'this game'}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Create one to get started!
        </Typography>
    </Box>
);