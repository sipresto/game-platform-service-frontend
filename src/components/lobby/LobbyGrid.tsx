import { Grid } from '@mui/material';
import { LobbyCard } from './LobbyCard';

interface LobbyGridProps {
    lobbies: Array<{
        id: string;
        currentPlayerCount: number;
        isPrivate: boolean;
    }>;
    onJoinLobby: (lobbyId: string, isPrivate: boolean) => void;
    onStartGame: (lobbyId: string) => void;
    isJoining?: boolean;
    isStarting?: boolean;
}

export const LobbyGrid = ({ lobbies, onJoinLobby, onStartGame, isJoining, isStarting }: LobbyGridProps) => {
    return (
        <Grid container spacing={3}>
            {lobbies.map((lobby) => (
                <Grid size={{xs: 12, md: 6, lg: 4}} key={lobby.id}>
                    <LobbyCard
                        lobby={lobby}
                        onJoinLobby={onJoinLobby}
                        onStartGame={onStartGame}
                        isJoining={isJoining}
                        isStarting={isStarting}
                    />
                </Grid>
            ))}
        </Grid>
    );
};