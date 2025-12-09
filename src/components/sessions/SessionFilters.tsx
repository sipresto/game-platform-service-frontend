import {
    Box,
    Paper,
    Typography,
    Chip,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    ToggleButton,
    ToggleButtonGroup,
    Button,
    TextField,
    Grid
} from '@mui/material';
import {
    SortByAlpha,
    DateRange,
    MilitaryTech,
    Block,
    Handshake,
    SentimentVerySatisfied,
    SentimentVeryDissatisfied,
    Dangerous,
    FilterList,
    ClearAll,
    SmartToy,
    Person
} from '@mui/icons-material';
import type { Session } from '../../model/session.ts';

interface EnhancedSession extends Session {
    enhancedUserResult: 'WIN' | 'LOSS' | 'DRAW';
    isAgainstAI: boolean;
    _userResultLabel: string;
}

interface SessionFiltersProps {
    filters: {
        result: string[];
        difficulty: string[];
        opponent: string[];
        search: string;
    };
    onFilterChange: (type: 'result' | 'difficulty' | 'opponent' | 'search', value: string | string[]) => void;
    onClearFilters: () => void;
    sortField: 'date' | 'result' | 'difficulty' | 'players';
    onSortFieldChange: (field: 'date' | 'result' | 'difficulty' | 'players') => void;
    sortDirection: 'asc' | 'desc';
    onSortDirectionToggle: () => void;
    enhancedSessions: EnhancedSession[];
    filteredAndSortedSessions: EnhancedSession[];
    currentUserId?: string;
}

export function SessionFilters({
                                   filters,
                                   onFilterChange,
                                   onClearFilters,
                                   sortField,
                                   onSortFieldChange,
                                   sortDirection,
                                   onSortDirectionToggle,
                                   enhancedSessions,
                                   filteredAndSortedSessions,
                                   currentUserId
                               }: SessionFiltersProps) {

    const getSortLabel = () => {
        const labels = {
            date: 'Date',
            result: 'Your Result',
            difficulty: 'Difficulty',
            players: 'Player Count'
        };
        return `${labels[sortField]} (${sortDirection === 'asc' ? 'Ascending' : 'Descending'})`;
    };

    return (
        <>
            <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
                <Grid container spacing={3}>
                    <Grid size={{xs: 12, md: 6}}>
                        <TextField
                            fullWidth
                            placeholder="Search by session ID, game ID, or player ID..."
                            value={filters.search}
                            onChange={(e) => onFilterChange('search', e.target.value)}
                        />
                    </Grid>

                    <Grid size={{xs: 12, sm: 6, md: 3}}>
                        <FormControl fullWidth>
                            <InputLabel>Sort By</InputLabel>
                            <Select
                                value={sortField}
                                label="Sort By"
                                onChange={(e) => onSortFieldChange(e.target.value as 'date' | 'result' | 'difficulty' | 'players')}
                            >
                                <MenuItem value="date">Date</MenuItem>
                                <MenuItem value="result">Your Result</MenuItem>
                                <MenuItem value="difficulty">Difficulty</MenuItem>
                                <MenuItem value="players">Player Count</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid size={{xs: 12, sm: 6, md: 3}}>
                        <Button
                            fullWidth
                            variant="outlined"
                            onClick={onSortDirectionToggle}
                            startIcon={sortDirection === 'asc' ? <SortByAlpha /> : <DateRange />}
                            sx={{ height: '56px' }}
                        >
                            {getSortLabel()}
                        </Button>
                    </Grid>

                    <Grid size={{xs: 12}}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                            <FilterList sx={{ color: 'text.secondary' }} />
                            <Typography variant="subtitle2" color="text.secondary">
                                Filter by:
                            </Typography>
                        </Box>

                        <Box sx={{ mb: 2 }}>
                            <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                                Your Result
                            </Typography>
                            <ToggleButtonGroup
                                value={filters.result}
                                onChange={(_, value) => onFilterChange('result', value)}
                                aria-label="result filter"
                                size="small"
                                sx={{ flexWrap: 'wrap', gap: 1 }}
                            >
                                <ToggleButton value="WIN" aria-label="win">
                                    <MilitaryTech sx={{ mr: 1 }} />
                                    Win
                                </ToggleButton>
                                <ToggleButton value="LOSS" aria-label="loss">
                                    <Block sx={{ mr: 1 }} />
                                    Loss
                                </ToggleButton>
                                <ToggleButton value="DRAW" aria-label="draw">
                                    <Handshake sx={{ mr: 1 }} />
                                    Draw
                                </ToggleButton>
                            </ToggleButtonGroup>
                        </Box>

                        <Box sx={{ mb: 2 }}>
                            <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                                Difficulty
                            </Typography>
                            <ToggleButtonGroup
                                value={filters.difficulty}
                                onChange={(_, value) => onFilterChange('difficulty', value)}
                                aria-label="difficulty filter"
                                size="small"
                                sx={{ flexWrap: 'wrap', gap: 1 }}
                            >
                                <ToggleButton value="EASY" aria-label="easy">
                                    <SentimentVerySatisfied sx={{ mr: 1 }} />
                                    Easy
                                </ToggleButton>
                                <ToggleButton value="HARD" aria-label="hard">
                                    <SentimentVeryDissatisfied sx={{ mr: 1 }} />
                                    Hard
                                </ToggleButton>
                                <ToggleButton value="IMPOSSIBLE" aria-label="impossible">
                                    <Dangerous sx={{ mr: 1 }} />
                                    Impossible
                                </ToggleButton>
                            </ToggleButtonGroup>
                        </Box>

                        <Box sx={{ mb: 2 }}>
                            <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                                Opponent
                            </Typography>
                            <ToggleButtonGroup
                                value={filters.opponent}
                                onChange={(_, value) => onFilterChange('opponent', value)}
                                aria-label="opponent filter"
                                size="small"
                                sx={{ flexWrap: 'wrap', gap: 1 }}
                            >
                                <ToggleButton value="ai" aria-label="ai">
                                    <SmartToy sx={{ mr: 1 }} />
                                    vs AI
                                </ToggleButton>
                                <ToggleButton value="player" aria-label="player">
                                    <Person sx={{ mr: 1 }} />
                                    vs Player
                                </ToggleButton>
                            </ToggleButtonGroup>
                        </Box>

                        {(filters.result.length > 0 || filters.difficulty.length > 0 ||
                            filters.opponent.length > 0 || filters.search) && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
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
                                        label={`Difficulty: ${difficulty}`}
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
                                    onClick={onClearFilters}
                                    sx={{ ml: 'auto' }}
                                >
                                    Clear All
                                </Button>
                            </Box>
                        )}
                    </Grid>
                </Grid>
            </Paper>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                    <Typography variant="h6">
                        {filteredAndSortedSessions.length} {filteredAndSortedSessions.length === 1 ? 'session' : 'sessions'} found
                    </Typography>
                    {currentUserId && (
                        <Typography variant="caption" color="text.secondary">
                            Showing sessions for user: {currentUserId.slice(0, 8)}...
                        </Typography>
                    )}
                </Box>
                {filteredAndSortedSessions.length !== enhancedSessions.length && (
                    <Button
                        size="small"
                        variant="outlined"
                        onClick={onClearFilters}
                        startIcon={<ClearAll />}
                    >
                        Showing filtered results
                    </Button>
                )}
            </Box>
        </>
    );
}