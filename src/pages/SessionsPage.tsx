import { useState, useMemo, useCallback } from 'react';
import { Box, Typography } from '@mui/material';
import { SessionList } from "../components/sessions/SessionList.tsx";
import { SessionFilters } from "../components/sessions/SessionFilters.tsx";
import { useSessions } from '../hooks/useSessions.ts';
import type { Session } from '../model/session.ts';
import { useCurrentUser } from "../hooks/useUserProfile.ts";

interface EnhancedSession extends Session {
    enhancedUserResult: 'WIN' | 'LOSS' | 'DRAW';
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

    const getEnhancedUserResult = useCallback((session: Session): 'WIN' | 'LOSS' | 'DRAW' => {
        if (!currentUserId) return 'DRAW';

        if (session.result === 'DRAW') return 'DRAW';

        if (session.result === 'PLAYER_WIN') {
            return session.winnerId === currentUserId ? 'WIN' : 'LOSS';
        }

        if (session.result === 'AI_WIN') {
            return 'LOSS';
        }

        return 'DRAW';
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
                if (session.id?.toLowerCase().includes(searchLower)) return true;
                if (session.gameId?.toLowerCase().includes(searchLower)) return true;
                return !!session.playerIds?.some(id => id?.toLowerCase().includes(searchLower));
            });
        }

        if (filters.result.length > 0) {
            const allResultTypes = ['WIN', 'LOSS', 'DRAW'];
            const allSelected = allResultTypes.every(type => filters.result.includes(type));

            if (!allSelected) {
                result = result.filter(session => {
                    return filters.result.includes(session.enhancedUserResult);
                });
            }
        }

        if (filters.difficulty.length > 0) {
            const allDifficultyTypes = ['EASY', 'HARD', 'IMPOSSIBLE'];
            const allSelected = allDifficultyTypes.every(type => filters.difficulty.includes(type));

            if (!allSelected) {
                result = result.filter(session => filters.difficulty.includes(session.difficulty));
            }
        }

        if (filters.opponent.length > 0) {
            const allOpponentTypes = ['ai', 'player'];
            const allSelected = allOpponentTypes.every(type => filters.opponent.includes(type));

            if (!allSelected) {
                result = result.filter(session => {
                    const isAI = session.isAgainstAI;
                    if (filters.opponent.includes('ai') && isAI) return true;
                    return filters.opponent.includes('player') && !isAI;
                });
            }
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
                    { const resultOrder = { WIN: 1, LOSS: 2, DRAW: 3 };
                    comparison = (resultOrder[a.enhancedUserResult] || 4) - (resultOrder[b.enhancedUserResult] || 4);
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

            <SessionFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={clearFilters}
                sortField={sortField}
                onSortFieldChange={handleSortFieldChange}
                sortDirection={sortDirection}
                onSortDirectionToggle={handleSortDirectionToggle}
                enhancedSessions={enhancedSessions}
                filteredAndSortedSessions={filteredAndSortedSessions}
                currentUserId={currentUserId}
            />

            <SessionList
                sessions={filteredAndSortedSessions as unknown as Session[]}
                loading={loading}
                error={error}
                refresh={refresh}
            />
        </Box>
    );
}