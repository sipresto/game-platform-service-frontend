import { Box, Typography, Chip, LinearProgress, Divider } from '@mui/material';
import { Lock as LockIcon, LockOpen as LockOpenIcon } from '@mui/icons-material';
import type { LobbyDetail } from '../../model/lobby';

interface LobbyRoomHeaderProps {
    lobby: LobbyDetail;
    currentPlayerCount: number;
    maxPlayers: number;
}

export const LobbyRoomHeader = ({ lobby, currentPlayerCount, maxPlayers }: LobbyRoomHeaderProps) => {
    return (
        <>
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2
            }}>
                <Typography variant="h4" component="h1" fontWeight="bold">
                    Waiting Room
                </Typography>
                <Chip
                    label={lobby.isPrivate ? "Private" : "Public"}
                    icon={lobby.isPrivate ? <LockIcon /> : <LockOpenIcon />}
                    color={lobby.isPrivate ? "warning" : "success"}
                    variant="outlined"
                />
            </Box>

            <Box sx={{ my: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Players Joined</Typography>
                    <Typography variant="body2" fontWeight="bold">
                        {currentPlayerCount} / {maxPlayers}
                    </Typography>
                </Box>
                <LinearProgress
                    variant="determinate"
                    value={(currentPlayerCount / maxPlayers) * 100}
                    sx={{ height: 10, borderRadius: 5 }}
                />
            </Box>

            <Divider sx={{ mb: 3 }} />
        </>
    );
};
