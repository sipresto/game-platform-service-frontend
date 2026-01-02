import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Container, Alert, Box, CircularProgress } from '@mui/material';
import { LobbyHeader } from '../components/lobby/LobbyHeader';
import { CreateLobbyDialog } from '../components/lobby/CreateLobbyDialog';
import { JoinLobbyDialog } from '../components/lobby/JoinLobbyDialog';
import { NotificationAlert } from '../components/NotificationAlert';
import { LobbyGrid } from '../components/lobby/LobbyGrid';
import { LobbyEmptyState } from '../components/lobby/LobbyEmptyState';
import { useLobbies, useLobbyActions } from "../hooks/useLobby";
import { useGameDetails } from "../hooks/useGames";
import type {
    CreateLobbyRequest,
    JoinLobbyRequest,
    LobbyCreatedResponse
} from '../model/lobby';

export const LobbyPage = () => {
    const { gameId } = useParams<{ gameId: string }>();
    const navigate = useNavigate();

    const { lobbies, isLoading, error, refetch } = useLobbies(gameId);
    const { game, loading: gameLoading, error: gameError } = useGameDetails(gameId);
    const { createLobby, joinLobby } = useLobbyActions(gameId);

    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [joinDialogOpen, setJoinDialogOpen] = useState(false);
    const [selectedLobbyId, setSelectedLobbyId] = useState<string | null>(null);

    const [password, setPassword] = useState('');
    const [joinPassword, setJoinPassword] = useState('');

    const [notification, setNotification] = useState<{
        type: 'success' | 'error';
        message: string;
    } | null>(null);

    const showNotification = (type: 'success' | 'error', message: string) => {
        setNotification({ type, message });
    };

    const handleJoinLobby = (lobbyId: string, isPrivateLobby: boolean) => {
        setSelectedLobbyId(lobbyId);

        if (isPrivateLobby) {
            setJoinDialogOpen(true);
            return;
        }

        const request: JoinLobbyRequest = { password: null };
        joinLobby.mutate(
            { lobbyId, request },
            {
                onSuccess: () => {
                    localStorage.setItem('currentLobbyId', lobbyId);
                    setJoinPassword('');
                    navigate(`/game/${gameId}/lobby/${lobbyId}`);
                },
                onError: () => {
                    showNotification('error', 'Failed to join lobby. Please try again.');
                },
            }
        );
    };

    const handleJoinWithPassword = () => {
        if (!selectedLobbyId) return;

        const request: JoinLobbyRequest = { password: joinPassword };
        joinLobby.mutate(
            { lobbyId: selectedLobbyId, request },
            {
                onSuccess: () => {
                    localStorage.setItem('currentLobbyId', selectedLobbyId);
                    setJoinDialogOpen(false);
                    setJoinPassword('');
                    navigate(`/game/${gameId}/lobby/${selectedLobbyId}`);
                },
                onError: () => {
                    showNotification('error', 'Failed to join lobby. Check your password and try again.');
                },
            }
        );
    };

    const resetCreateForm = () => {
        setPassword('');
    };

    const handleCreateLobby = () => {
        if (!gameId || !game) return;

        const request: CreateLobbyRequest = {
            gameId,
            password: password ? password : null,
        };

        createLobby.mutate(request, {
            onSuccess: (data: LobbyCreatedResponse) => {
                setCreateDialogOpen(false);
                resetCreateForm();
                localStorage.setItem('currentLobbyId', data.id);
                navigate(`/game/${gameId}/lobby/${data.id}`);
            },
            onError: () => {
                showNotification('error', 'Failed to create lobby. Please try again.');
            },
        });
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

    if (gameError || !game) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Alert severity="error">
                    Failed to load game details: {gameError || 'Unknown error'}
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

            {!isLoading && !error && lobbies.length === 0 && (
                <LobbyEmptyState gameName={game.name} />
            )}

            {!isLoading && !error && lobbies.length > 0 && (
                <LobbyGrid
                    lobbies={lobbies}
                    onJoinLobby={handleJoinLobby}
                    isJoining={joinLobby.isPending}
                />
            )}

            <CreateLobbyDialog
                open={createDialogOpen}
                onClose={() => setCreateDialogOpen(false)}
                gameName={game.name}
                password={password}
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
        </Container>
    );
};