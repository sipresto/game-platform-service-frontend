import { useState, useMemo, useCallback } from 'react';
import {
    Box,
    Typography,
    Paper,
    Grid,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    Chip
} from '@mui/material';
import { SortByAlpha, DateRange, ClearAll } from '@mui/icons-material';
import { SessionList } from "../components/sessions/SessionList.tsx";
import { useSessions } from '../hooks/useSessions.ts';
import type { Session } from '../model/session.ts';
import {useUserProfile} from "../hooks/useUserProfile.ts";
import {SessionFilterPopup} from "../components/sessions/SessionFilters.tsx";
import { useAllGames } from '../hooks/useGames.ts';

interface EnhancedSession extends Session {
    enhancedUserResult: 'WIN' | 'LOSS' | 'DRAW';
    isAgainstAI: boolean;
    _userResultLabel: string;
}

export function SessionsPage() {
    const { sessions, loading, error, refresh } = useSessions();
    const { profile } = useUserProfile();
    const currentUserId = profile?.id;

    const { gameNamesMap } = useAllGames();

    const [sortField, setSortField] = useState<'date' | 'result' | 'difficulty' | 'players'>('date');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
    const [filters, setFilters] = useState({
        result: [] as string[],
        difficulty: [] as string[],
        opponent: [] as string[],
        search: ''
    });

    const getDifficultyDisplayName = (difficulty: string): string => {
        switch (difficulty) {
            case 'EASY': return 'Easy';
            case 'HARD': return 'Medium';
            case 'IMPOSSIBLE': return 'Hard';
            default: return difficulty;
        }
    };

    const getEnhancedUserResult = useCallback((session: Session): 'WIN' | 'LOSS' | 'DRAW' => {
        if (!currentUserId) return 'DRAW';

        if (session.result === 'AI_WIN') {
            return 'LOSS';
        }

        if (session.result === 'DRAW') {
            return 'DRAW';
        }

        if (session.result === 'PLAYER_WIN') {
            if (session.winnerId === currentUserId) {
                return 'WIN';
            }
            else if (session.playerIds?.length === 1 && session.playerIds[0] === currentUserId) {
                return 'WIN';
            }
            else if (session.playerIds?.includes(currentUserId)) {
                return 'LOSS';
            }
            else {
                return 'LOSS';
            }
        }

        return 'DRAW';
    }, [currentUserId]);

    const isAgainstAI = useCallback((session: Session): boolean => {
        return session.result === 'AI_WIN' || (session.playerIds && session.playerIds.length === 1);
    }, []);

    const enhancedSessions: EnhancedSession[] = useMemo(() => {
        return sessions.map(session => {
            const enhancedResult = getEnhancedUserResult(session);
            return {
                ...session,
                enhancedUserResult: enhancedResult,
                isAgainstAI: isAgainstAI(session),
                _userResultLabel: enhancedResult === 'WIN' ? 'Win' :
                    enhancedResult === 'LOSS' ? 'Loss' : 'Draw'
            };
        });
    }, [sessions, getEnhancedUserResult, isAgainstAI]);

    const handleSortFieldChange = (field: 'date' | 'result' | 'difficulty' | 'players') => {
        setSortField(field);
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

    const handlePopupFilterChange = (newFilters: { result: string[]; difficulty: string[]; opponent: string[] }) => {
        setFilters(prev => ({
            ...prev,
            ...newFilters
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

        if (filters.search.trim()) {
            const searchLower = filters.search.toLowerCase().trim();
            result = result.filter(session => {
                const gameName = gameNamesMap[session.gameId] || '';
                return gameName.toLowerCase().includes(searchLower);
            });
        }

        if (filters.result.length > 0) {
            result = result.filter(session => {
                return filters.result.includes(session.enhancedUserResult);
            });
        }

        if (filters.difficulty.length > 0) {
            result = result.filter(session => filters.difficulty.includes(session.difficulty));
        }

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
                {
                    const dateA = new Date(a.completedAt).getTime();
                    const dateB = new Date(b.completedAt).getTime();
                    comparison = dateA - dateB;
                    break;
                }

                case 'result':
                {
                    const resultOrder = { WIN: 1, DRAW: 2, LOSS: 3 };
                    comparison = (resultOrder[a.enhancedUserResult] || 4) - (resultOrder[b.enhancedUserResult] || 4);
                    break;
                }

                case 'difficulty':
                {
                    const difficultyOrder = { EASY: 1, HARD: 2, IMPOSSIBLE: 3 };
                    comparison = (difficultyOrder[a.difficulty] || 4) - (difficultyOrder[b.difficulty] || 4);
                    break;
                }

                case 'players':
                    comparison = (a.playerIds?.length || 0) - (b.playerIds?.length || 0);
                    break;
            }

            return sortDirection === 'asc' ? comparison : -comparison;
        });

        return result;
    }, [enhancedSessions, filters, sortField, sortDirection, gameNamesMap]);

    const hasActiveFilters = filters.result.length > 0 ||
        filters.difficulty.length > 0 ||
        filters.opponent.length > 0 ||
        filters.search.trim().length > 0;

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

            <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                <Grid container spacing={1} alignItems="center">
                    <Grid size={{xs: 12, sm: 12, md: 6}}>
                        <TextField
                            fullWidth
                            placeholder="Search by game name..."
                            value={filters.search}
                            onChange={(e) => handleFilterChange('search', e.target.value)}
                            size="small"
                        />
                    </Grid>

                    <Grid size={{xs: 12, sm: 6, md: 3}}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Sort By</InputLabel>
                            <Select
                                value={sortField}
                                label="Sort By"
                                onChange={(e) => handleSortFieldChange(e.target.value as 'date' | 'result' | 'difficulty' | 'players')}
                            >
                                <MenuItem value="date">Date</MenuItem>
                                <MenuItem value="result">Your Result</MenuItem>
                                <MenuItem value="difficulty">Difficulty</MenuItem>
                                <MenuItem value="players">Player Count</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid size={{xs: 6, sm: 3, md: 1.5}}>
                        <Button
                            fullWidth
                            variant="outlined"
                            onClick={handleSortDirectionToggle}
                            startIcon={sortDirection === 'asc' ? <SortByAlpha /> : <DateRange />}
                            sx={{ height: '40px' }}
                            size="small"
                        >
                            {sortDirection === 'asc' ? 'Asc' : 'Desc'}
                        </Button>
                    </Grid>

                    <Grid size={{xs: 6, sm: 3, md: 1.5}}>
                        <SessionFilterPopup
                            filters={filters}
                            onFiltersChange={handlePopupFilterChange}
                            onClearFilters={() => {
                                setFilters(prev => ({
                                    ...prev,
                                    result: [],
                                    difficulty: [],
                                    opponent: []
                                }));
                            }}
                        />
                    </Grid>
                </Grid>

                {hasActiveFilters && (
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
                                    onDelete={() => handleFilterChange('result', filters.result.filter(r => r !== result))}
                                />
                            ))}
                            {filters.difficulty.map(difficulty => (
                                <Chip
                                    key={difficulty}
                                    label={`Difficulty: ${getDifficultyDisplayName(difficulty)}`}
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
                    </Box>
                )}
            </Paper>

            <SessionList
                sessions={filteredAndSortedSessions as unknown as Session[]}
                loading={loading}
                error={error}
                refresh={refresh}
            />
        </Box>
    );
}