import {
    Paper,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText, Tooltip
} from '@mui/material';
import SmartToyIcon from "@mui/icons-material/SmartToy";
import DoNotDisturbOnIcon from '@mui/icons-material/DoNotDisturbOn';
import type {BotDifficulty} from "../../model/lobby.ts";

interface BotListProps {
    bots: BotDifficulty[];
    onRemove: (bot: number) => void;
}

export const BotList = ({ bots, onRemove }: BotListProps) => {
    const difficultyLabels: Record<BotDifficulty, string> = {
        EASY: 'Easy',
        HARD: 'Medium',
        IMPOSSIBLE: 'Hard',
    };

    const botColorMap: Record<BotDifficulty, string> = {
        EASY: 'success.main',
        HARD: 'warning.main',
        IMPOSSIBLE: 'error.main',
    };

    return (
        <Paper variant="outlined" sx={{ mb: 4, maxHeight: 300, overflow: 'auto' }}>
            <List>
                {bots.map((difficulty, key) => {
                    return (
                        <ListItem key={key}>
                            <ListItemAvatar>
                                <SmartToyIcon sx={{color:botColorMap[difficulty]}}/>
                            </ListItemAvatar>
                            <ListItemText
                                primary="Bot"
                                secondary={difficultyLabels[difficulty]}
                            />
                            <Tooltip sx={{scale:1.25}} title="Remove Bot?" arrow>
                                <DoNotDisturbOnIcon color="error" cursor="pointer" onClick={() => onRemove(key)} />
                            </Tooltip>
                        </ListItem>
                    );
                })}
            </List>
        </Paper>
    );
};