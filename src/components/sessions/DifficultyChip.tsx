import { Chip } from '@mui/material';
import {
    SentimentVerySatisfied,
    SentimentNeutral,
    SentimentVeryDissatisfied,
    Gamepad
} from '@mui/icons-material';
import { getDifficultyDisplayName } from '../../utils/difficultyUtils';

interface DifficultyChipProps {
    difficulty: string;
}

export function DifficultyChip({ difficulty }: DifficultyChipProps) {
    const getDifficultyConfig = (difficulty: string) => {
        const displayName = getDifficultyDisplayName(difficulty);
        switch (difficulty) {
            case 'EASY':
                return { color: 'success' as const, label: displayName, icon: <SentimentVerySatisfied sx={{ color: 'text.primary' }} /> };
            case 'HARD':
                return { color: 'warning' as const, label: displayName, icon: <SentimentNeutral sx={{ color: 'text.primary' }} /> };
            case 'IMPOSSIBLE':
                return { color: 'error' as const, label: displayName, icon: <SentimentVeryDissatisfied sx={{ color: 'text.primary' }} /> };
            default:
                return { color: 'default' as const, label: displayName, icon: <Gamepad sx={{ color: 'text.primary' }} /> };
        }
    };

    const config = getDifficultyConfig(difficulty);

    return (
        <Chip
            label={config.label}
            color={config.color}
            size="small"
            icon={config.icon}
            sx={{ color: 'text.primary' }}
        />
    );
}