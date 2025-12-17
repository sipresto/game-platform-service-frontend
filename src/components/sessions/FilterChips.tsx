import { Box, Typography, Chip, Button } from '@mui/material';
import { ClearAll } from '@mui/icons-material';
import { getDifficultyDisplayName } from '../../utils/difficultyUtils';
import type { Filters } from '../../utils/sessionFilter';

interface FilterChipsProps {
    filters: Filters;
    onFilterChange: (type: keyof Filters, value: string | string[]) => void;
    onClearAll: () => void;
}

export function FilterChips({ filters, onFilterChange, onClearAll }: FilterChipsProps) {
    const hasActiveFilters = filters.result.length > 0 ||
        filters.difficulty.length > 0 ||
        filters.opponent.length > 0 ||
        filters.search.trim().length > 0;

    if (!hasActiveFilters) return null;

    return (
        <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                <Typography variant="caption" color="text.secondary">
                    Active filters:
                </Typography>
                {filters.result.map(result => (
                    <Chip
                        key={result}
                        label={`Result: ${result === 'WIN' ? 'Win' : result === 'LOSS' ? 'Loss' : 'Draw'}`}
                        size="small"
                        onDelete={() => onFilterChange('result', filters.result.filter(r => r !== result))}
                    />
                ))}
                {filters.difficulty.map(difficulty => (
                    <Chip
                        key={difficulty}
                        label={`Difficulty: ${getDifficultyDisplayName(difficulty)}`}
                        size="small"
                        onDelete={() => onFilterChange('difficulty', filters.difficulty.filter(d => d !== difficulty))}
                    />
                ))}
                {filters.opponent.map(opponent => (
                    <Chip
                        key={opponent}
                        label={`Opponent: ${opponent === 'ai' ? 'AI' : 'Player'}`}
                        size="small"
                        onDelete={() => onFilterChange('opponent', filters.opponent.filter(o => o !== opponent))}
                    />
                ))}
                {filters.search && (
                    <Chip
                        label={`Search: "${filters.search}"`}
                        size="small"
                        onDelete={() => onFilterChange('search', '')}
                    />
                )}
                <Button
                    size="small"
                    startIcon={<ClearAll />}
                    onClick={onClearAll}
                    sx={{ ml: 'auto' }}
                >
                    Clear All
                </Button>
            </Box>
        </Box>
    );
}