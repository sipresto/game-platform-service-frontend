import { Grid } from '@mui/material';
import { LobbyCard } from './LobbyCard';
import type {Lobby} from "../../model/lobby.ts";

interface LobbyGridProps {
    lobbies: Lobby[];
    onJoinLobby: (lobbyId: string, isPrivate: boolean) => void;
    isJoining?: boolean;
    amount: number;
}

export const LobbyGrid = ({ lobbies, onJoinLobby, isJoining, amount }: LobbyGridProps) => {
    return (
        <Grid container spacing={3}>
            {lobbies.map((lobby) => (
                <Grid size={{xs: 12, md: 6, lg: 4}} key={lobby.id}>
                    <LobbyCard
                        lobby={lobby}
                        onJoinLobby={onJoinLobby}
                        isJoining={isJoining}
                        amount={amount}
                    />
                </Grid>
            ))}
        </Grid>
    );
};