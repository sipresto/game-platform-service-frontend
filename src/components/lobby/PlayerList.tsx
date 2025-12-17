import {
    Paper,
    List,
    ListItem,
    ListItemAvatar,
    Avatar,
    ListItemText
} from '@mui/material';
import { Star as HostIcon } from '@mui/icons-material';

interface Player {
    id: string;
    username: string;
}

interface PlayerListProps {
    players: Player[];
    hostId: string;
}

export const PlayerList = ({ players, hostId }: PlayerListProps) => {
    const BACKEND_URL: string = import.meta.env.VITE_BACKEND_URL;

    return (
        <Paper variant="outlined" sx={{ mb: 4, maxHeight: 300, overflow: 'auto' }}>
            <List>
                {players.map((player) => {
                    const profileImageUrl = `${BACKEND_URL}/${player.id}/profile-image`;
                    const initials = player.username.charAt(0).toUpperCase();

                    return (
                        <ListItem key={player.id}>
                            <ListItemAvatar>
                                <Avatar
                                    src={profileImageUrl}
                                    sx={{
                                        bgcolor: 'primary.main',
                                    }}
                                >
                                    {initials}
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={player.username}
                                secondary={player.id === hostId ? "Host" : "Player"}
                            />
                            {player.id === hostId && <HostIcon color="warning" />}
                        </ListItem>
                    );
                })}
            </List>
        </Paper>
    );
};