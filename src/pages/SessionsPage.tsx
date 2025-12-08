import { useState, useMemo, useCallback } from 'react';
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
import { SessionList } from "../components/sessions/SessionList.tsx";
import { useSessions } from '../hooks/useSessions.ts';
import type { Session } from '../model/session.ts';
import { useCurrentUser } from "../hooks/useUserProfile.ts";

// ✅ Solution 1: Use a different property name to avoid conflict with existing Session type
interface EnhancedSession extends Session {
    enhancedUserResult: 'WIN' | 'LOSS' | 'DRAW' | 'NOT_IN_SESSION';
    isAgainstAI: boolean;
    _userResultLabel: string;
}

export function SessionsPage() {
    const { sessions, loading, error, refresh } = useSessions();
    const { userId: currentUserId } = useCurrentUser();

    const [sortField, setSortField] = useState<'date' | 'result' | 'difficulty' | 'players'>('date');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
    const [filters, setFilters] = useState({
        result: [] as string[],
        difficulty: [] as string[],
        opponent: [] as string[],
        search: ''
    });

    // ✅ Renamed function to get enhanced user result
    const getEnhancedUserResult = useCallback((session: Session): 'WIN' | 'LOSS' | 'DRAW' | 'NOT_IN_SESSION' => {
        if (!currentUserId || !session.playerIds.includes(currentUserId)) {
            return 'NOT_IN_SESSION';
        }

        // Use existing userResult if available, otherwise calculate it
        if (session.userResult) {
            // Ensure it's one of our enhanced values
            return session.userResult === 'WIN' || session.userResult === 'LOSS' || session.userResult === 'DRAW'
                ? session.userResult
                : 'NOT_IN_SESSION';
        }

        if (session.result === 'DRAW') {
            return 'DRAW';
        }

        if (session.result === 'AI_WIN') {
            return 'LOSS';
        }

        if (session.result === 'PLAYER_WIN') {
            return session.winnerId === currentUserId ? 'WIN' : 'LOSS';
        }

        return 'NOT_IN_SESSION';
    }, [currentUserId]);

    const isAgainstAI = useCallback((session: Session): boolean => {
        return session.result === 'AI_WIN' || session.playerIds.length === 1;
    }, []);

    const enhancedSessions: EnhancedSession[] = useMemo(() => {
        return sessions.map(session => {
            const enhancedResult = getEnhancedUserResult(session);
            return {
                ...session,
                enhancedUserResult: enhancedResult,
                isAgainstAI: isAgainstAI(session),
                _userResultLabel: enhancedResult === 'WIN' ? 'Win' :
                    enhancedResult === 'LOSS' ? 'Loss' :
                        enhancedResult === 'DRAW' ? 'Draw' : 'Not in Session'
            };
        });
    }, [sessions, getEnhancedUserResult, isAgainstAI]);

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
            opponent: [],
            search: ''
        });
    };

    const filteredAndSortedSessions: EnhancedSession[] = useMemo(() => {
        let result = [...enhancedSessions];

        // Apply search filter
        if (filters.search.trim()) {
            const searchLower = filters.search.toLowerCase().trim();
            result = result.filter(session => {
                if (session.id?.toLowerCase().includes(searchLower)) return true;
                if (session.gameId?.toLowerCase().includes(searchLower)) return true;
                return !!session.playerIds?.some(id => id?.toLowerCase().includes(searchLower));
            });
        }

        // ✅ Apply result filter using enhancedUserResult instead of userResult
        if (filters.result.length > 0) {
            result = result.filter(session => {
                // Always include sessions when user wasn't in them if "NOT_IN_SESSION" is selected
                if (session.enhancedUserResult === 'NOT_IN_SESSION') {
                    return filters.result.includes('NOT_IN_SESSION');
                }

                // For sessions user participated in, check if their result matches filter
                return filters.result.includes(session.enhancedUserResult);
            });
        }

        // Apply difficulty filter
        if (filters.difficulty.length > 0) {
            result = result.filter(session => filters.difficulty.includes(session.difficulty));
        }

        // Apply opponent type filter
        if (filters.opponent.length > 0) {
            result = result.filter(session => {
                const isAI = session.isAgainstAI;
                if (filters.opponent.includes('ai') && isAI) return true;
                return filters.opponent.includes('player') && !isAI;
            });
        }

        result.sort((a, b) => {
            let comparison = 0;

            switch (sortField) {
                case 'date':
                    { const dateA = new Date(a.completedAt).getTime();
                    const dateB = new Date(b.completedAt).getTime();
                    comparison = dateB - dateA;
                    break; }

                case 'result':
                    { const resultOrder = { WIN: 1, LOSS: 2, DRAW: 3, NOT_IN_SESSION: 4 };
                    comparison = (resultOrder[a.enhancedUserResult] || 5) - (resultOrder[b.enhancedUserResult] || 5);
                    break; }

                case 'difficulty':
                    { const difficultyOrder = { EASY: 1, HARD: 2, IMPOSSIBLE: 3 };
                    comparison = (difficultyOrder[a.difficulty] || 0) - (difficultyOrder[b.difficulty] || 0);
                    break; }

                case 'players':
                    comparison = (a.playerIds?.length || 0) - (b.playerIds?.length || 0);
                    break;
            }

            return sortDirection === 'asc' ? comparison : -comparison;
        });

        return result;
    }, [enhancedSessions, filters, sortField, sortDirection]);

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
        <Box sx={{ width: '100%', maxWidth: 1400, mx: 'auto', p: { xs: 1, sm: 2, md: 3 } }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight={600} gutterBottom>
                    Game Sessions
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    View your game session history
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

                    <Grid size={{xs: 12, sm: 6, md: 3}}>
                        <FormControl fullWidth>
                            <InputLabel>Sort By</InputLabel>
                            <Select
                                value={sortField}
                                label="Sort By"
                                onChange={handleSortFieldChange}
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
                                Your Result
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
                                <ToggleButton value="NOT_IN_SESSION" aria-label="not in session">
                                    <ClearAll sx={{ mr: 1 }} />
                                    Not in Session
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
                                onChange={(_, value) => handleFilterChange('opponent', value)}
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
                                        label={`Result: ${result === 'WIN' ? 'Win' : result === 'LOSS' ? 'Loss' : result === 'DRAW' ? 'Draw' : 'Not in Session'}`}
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
                                {filters.opponent.map(opponent => (
                                    <Chip
                                        key={opponent}
                                        label={`Opponent: ${opponent === 'ai' ? 'AI' : 'Player'}`}
                                        size="small"
                                        onDelete={() => handleFilterChange('opponent', filters.opponent.filter(o => o !== opponent))}
                                    />
                                ))}
                                {filters.search && (
                                    <Chip
                                        label={`Search: "${filters.search}"`}
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
                        onClick={clearFilters}
                        startIcon={<ClearAll />}
                    >
                        Showing filtered results
                    </Button>
                )}
            </Box>

            <SessionList
                sessions={filteredAndSortedSessions as unknown as Session[]}
                loading={loading}
                error={error}
                refresh={refresh}
            />
        </Box>
    );
}