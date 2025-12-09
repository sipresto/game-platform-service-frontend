import {
    Paper,
    List,
    ListItem,
    ListItemAvatar,
    Avatar,
    ListItemText
} from '@mui/material';
import { Person as PersonIcon, Star as HostIcon } from '@mui/icons-material';

interface Player {
    id: string;
    username: string;
}

interface PlayerListProps {
    players: Player[];
    hostId: string;
}

export const PlayerList = ({ players, hostId }: PlayerListProps) => {
    return (
        <Paper variant="outlined" sx={{ mb: 4, maxHeight: 300, overflow: 'auto' }}>
            <List>
                {players.map((player) => (
                    <ListItem key={player.id}>
                        <ListItemAvatar>
                            <Avatar>
                                <PersonIcon />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary={player.username}
                            secondary={player.id === hostId ? "Host" : "Player"}
                        />
                        {player.id === hostId && <HostIcon color="warning" />}
                    </ListItem>
                ))}
            </List>
        </Paper>
    );
};