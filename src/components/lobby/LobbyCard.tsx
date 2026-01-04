import {Card, CardContent, CardActions, Button, Box, Typography, Chip, Stack} from '@mui/material';
import { People as PeopleIcon, Lock as LockIcon, LockOpen as LockOpenIcon } from '@mui/icons-material';

interface LobbyCardProps {
    lobby: {
        id: string;
        currentPlayerCount: number;
        isPrivate: boolean;
    };
    onJoinLobby: (lobbyId: string, isPrivate: boolean) => void;
    isJoining?: boolean;
    amount: number;
    children?: React.ReactNode;
}

export const LobbyCard = ({ lobby, onJoinLobby, isJoining, amount, children }: LobbyCardProps) => {
    const getLobbyName = (lobbyId: string) => {
        const idSuffix = lobbyId.slice(-6).toUpperCase();
        return `Game Room ${idSuffix}`;
    };

    if (children) {
        return <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>{children}</Card>;
    }

    return (
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
                <Stack>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Typography variant="h6" component="h3" gutterBottom>
                            {getLobbyName(lobby.id)}
                        </Typography>
                        {lobby.isPrivate ? (
                            <LockIcon color="warning" />
                        ) : (
                            <LockOpenIcon color="success" />
                        )}
                    </Box>
                    <Chip
                        icon={<PeopleIcon />}
                        label={`${lobby.currentPlayerCount}/${amount} Players`}
                        color="primary"
                        variant="outlined"
                        size="small"
                    />
                </Stack>
            </CardContent>
            <CardActions sx={{ p: 2, pt: 0 }}>
                <Button
                    fullWidth
                    variant="contained"
                    color="success"
                    onClick={() => onJoinLobby(lobby.id, lobby.isPrivate)}
                    disabled={isJoining}
                >
                    {isJoining ? 'Joining...' : 'Join'}
                </Button>
            </CardActions>
        </Card>
    );
};