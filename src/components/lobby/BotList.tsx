import {
    Paper,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText
} from '@mui/material';
import type {Bot} from "../../model/lobby.ts";
import SmartToyIcon from "@mui/icons-material/SmartToy";

interface BotListProps {
    bots: Bot[];
    onRemove: (bot: number) => void;
}

export const BotList = ({ bots }: BotListProps) => {
    return (
        <Paper variant="outlined" sx={{ mb: 4, maxHeight: 300, overflow: 'auto' }}>
            <List>
                {bots.map((bot, key) => {
                    return (
                        <ListItem key={key}>
                            <ListItemAvatar>
                                <SmartToyIcon
                                    sx={{
                                        bgcolor: 'primary.main',
                                    }}
                                >
                                    B
                                </SmartToyIcon>
                            </ListItemAvatar>
                            <ListItemText
                                primary="BOT"
                                secondary={bot.difficulty.difficulty}
                            />
                        </ListItem>
                    );
                })}
            </List>
        </Paper>
    );
};