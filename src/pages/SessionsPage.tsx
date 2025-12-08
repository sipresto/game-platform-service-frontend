import { useState, useMemo } from 'react';
import {
    Box,
    Paper,
    Typography,
    Chip,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    type SelectChangeEvent,
    Grid,
    ToggleButton,
    ToggleButtonGroup,
    Button,
    TextField
} from '@mui/material';
import {
    SortByAlpha,
    DateRange,
    MilitaryTech,
    Block,
    Handshake,
    SentimentVerySatisfied,
    SentimentNeutral,
    SentimentVeryDissatisfied,
    FilterList,
    ClearAll
} from '@mui/icons-material';
import {SessionList} from "../components/sessions/SessionList.tsx";
import { useSessions } from '../hooks/useSessions.ts'; // Import your hook

export function SessionsPage() {
    // Use your existing useSessions hook
    const { sessions, loading, error, refresh } = useSessions();

    const [sortField, setSortField] = useState<'date' | 'result' | 'difficulty' | 'players'>('date');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
    const [filters, setFilters] = useState({
        result: [] as string[],
        difficulty: [] as string[],
        search: ''
    });

    const handleSortFieldChange = (event: SelectChangeEvent) => {
        setSortField(event.target.value as 'date' | 'result' | 'difficulty' | 'players');
    };

    const handleSortDirectionToggle = () => {
        setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    };

    const handleFilterChange = (type: keyof typeof filters, value: string | string[]) => {
        setFilters(prev => ({
            ...prev,
            [type]: value
        }));
    };

    const clearFilters = () => {
        setFilters({
            result: [],
            difficulty: [],
            search: ''
        });
    };

    const filteredAndSortedSessions = useMemo(() => {
        let result = [...sessions];

        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            result = result.filter(session =>
                session.id.toLowerCase().includes(searchLower) ||
                session.gameId.toLowerCase().includes(searchLower) ||
                session.playerIds.some(id => id.toLowerCase().includes(searchLower))
            );
        }

        if (filters.result.length > 0) {
            result = result.filter(session => filters.result.includes(session.result));
        }

        if (filters.difficulty.length > 0) {
            result = result.filter(session => filters.difficulty.includes(session.difficulty));
        }

        result.sort((a, b) => {
            let comparison = 0;

            switch (sortField) {
                case 'date':
                    comparison = new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime();
                    break;
                case 'result':
                    comparison = a.result.localeCompare(b.result);
                    break;
                case 'difficulty':
                    { const difficultyOrder = { EASY: 1, MEDIUM: 2, HARD: 3 };
                    comparison = (difficultyOrder[a.difficulty as keyof typeof difficultyOrder] || 0) -
                        (difficultyOrder[b.difficulty as keyof typeof difficultyOrder] || 0);
                    break; }
                case 'players':
                    comparison = a.playerIds.length - b.playerIds.length;
                    break;
            }

            return sortDirection === 'asc' ? comparison : -comparison;
        });

        return result;
    }, [sessions, filters, sortField, sortDirection]);

    const getSortLabel = () => {
        const labels = {
            date: 'Date',
            result: 'Result',
            difficulty: 'Difficulty',
            players: 'Player Count'
        };
        return `${labels[sortField]} (${sortDirection === 'asc' ? 'Ascending' : 'Descending'})`;
    };

    return (
        <Box sx={{ width: '100%', maxWidth: 1400, mx: 'auto', p: { xs: 1, sm: 2, md: 3 } }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight={600} gutterBottom>
                    Game Sessions
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    View and manage your game session history
                </Typography>
            </Box>

            <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
                <Grid container spacing={3}>
                    <Grid size={{xs: 12, md: 6}}>
                        <TextField
                            fullWidth
                            placeholder="Search by session ID, game ID, or player ID..."
                            value={filters.search}
                            onChange={(e) => handleFilterChange('search', e.target.value)}
                        />
                    </Grid>

                    {/* Sort Controls */}
                    <Grid size={{xs: 12, md: 6, sm: 3}}>
                        <FormControl fullWidth>
                            <InputLabel>Sort By</InputLabel>
                            <Select
                                value={sortField}
                                label="Sort By"
                                onChange={handleSortFieldChange}
                                startAdornment={<SortByAlpha sx={{ mr: 1, opacity: 0.7 }} />}
                            >
                                <MenuItem value="date">Date</MenuItem>
                                <MenuItem value="result">Result</MenuItem>
                                <MenuItem value="difficulty">Difficulty</MenuItem>
                                <MenuItem value="players">Player Count</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid size={{xs: 12, md: 6, sm: 3}}>
                        <Button
                            fullWidth
                            variant="outlined"
                            onClick={handleSortDirectionToggle}
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
                                Result
                            </Typography>
                            <ToggleButtonGroup
                                value={filters.result}
                                onChange={(_, value) => handleFilterChange('result', value)}
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
                                onChange={(_, value) => handleFilterChange('difficulty', value)}
                                aria-label="difficulty filter"
                                size="small"
                                sx={{ flexWrap: 'wrap', gap: 1 }}
                            >
                                <ToggleButton value="EASY" aria-label="easy">
                                    <SentimentVerySatisfied sx={{ mr: 1 }} />
                                    Easy
                                </ToggleButton>
                                <ToggleButton value="MEDIUM" aria-label="medium">
                                    <SentimentNeutral sx={{ mr: 1 }} />
                                    Medium
                                </ToggleButton>
                                <ToggleButton value="HARD" aria-label="hard">
                                    <SentimentVeryDissatisfied sx={{ mr: 1 }} />
                                    Hard
                                </ToggleButton>
                            </ToggleButtonGroup>
                        </Box>

                        {(filters.result.length > 0 || filters.difficulty.length > 0 || filters.search) && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
                                <Typography variant="caption" color="text.secondary">
                                    Active filters:
                                </Typography>
                                {filters.result.map(result => (
                                    <Chip
                                        key={result}
                                        label={`Result: ${result}`}
                                        size="small"
                                        onDelete={() => handleFilterChange('result', filters.result.filter(r => r !== result))}
                                    />
                                ))}
                                {filters.difficulty.map(difficulty => (
                                    <Chip
                                        key={difficulty}
                                        label={`Difficulty: ${difficulty}`}
                                        size="small"
                                        onDelete={() => handleFilterChange('difficulty', filters.difficulty.filter(d => d !== difficulty))}
                                    />
                                ))}
                                {filters.search && (
                                    <Chip
                                        label={`Search: ${filters.search}`}
                                        size="small"
                                        onDelete={() => handleFilterChange('search', '')}
                                    />
                                )}
                                <Button
                                    size="small"
                                    startIcon={<ClearAll />}
                                    onClick={clearFilters}
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
                <Typography variant="h6">
                    {filteredAndSortedSessions.length} {filteredAndSortedSessions.length === 1 ? 'session' : 'sessions'} found
                </Typography>
                {filteredAndSortedSessions.length !== sessions.length && (
                    <Button
                        size="small"
                        variant="outlined"
                        onClick={clearFilters}
                        startIcon={<ClearAll />}
                    >
                        Showing filtered results
                    </Button>
                )}
            </Box>

            <SessionList
                sessions={filteredAndSortedSessions}
                loading={loading}
                error={error}
                refresh={refresh}
            />
        </Box>
    );
}