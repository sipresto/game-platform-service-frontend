import { useState, useCallback } from 'react';
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
    Button
} from '@mui/material';
import { SortByAlpha, DateRange } from '@mui/icons-material';
import { SessionList } from "../components/sessions/SessionList";
import { FilterChips } from "../components/sessions/FilterChips";
import { useSessions } from '../hooks/useSessions';
import { useUserProfile } from "../hooks/useUserProfile";
import { SessionFilterPopup } from "../components/sessions/SessionFilters";
import { useAllGames } from '../hooks/useGames';
import { enhanceSession } from '../utils/sessionEnhancer';
import { filterSessions } from '../utils/sessionFilter';
import { sortSessions } from '../utils/sessionSort';
import type { Filters } from '../utils/sessionFilter';
import type { SortField, SortDirection } from '../utils/sessionSort';

export function SessionsPage() {
    const { sessions, loading, error, refresh } = useSessions();
    const { profile } = useUserProfile();
    const currentUserId = profile?.id;
    const { gameNamesMap } = useAllGames();

    const [sortField, setSortField] = useState<SortField>('date');
    const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
    const [filters, setFilters] = useState<Filters>({
        result: [],
        difficulty: [],
        opponent: [],
        search: ''
    });

    const handleSortFieldChange = (field: SortField) => {
        setSortField(field);
    };

    const handleSortDirectionToggle = () => {
        setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    };

    const handleFilterChange = useCallback((type: keyof Filters, value: string | string[]) => {
        setFilters(prev => ({
            ...prev,
            [type]: value
        }));
    }, []);

    const handlePopupFilterChange = useCallback((
        newFilters: { result: string[]; difficulty: string[]; opponent: string[] }
    ) => {
        setFilters(prev => ({
            ...prev,
            ...newFilters
        }));
    }, []);

    const clearFilters = useCallback(() => {
        setFilters({
            result: [],
            difficulty: [],
            opponent: [],
            search: ''
        });
    }, []);

    const enhancedSessions = sessions.map(session => enhanceSession(session, currentUserId));
    const filteredSessions = filterSessions(enhancedSessions, filters, gameNamesMap);
    const sortedSessions = sortSessions(filteredSessions, sortField, sortDirection);

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
                                onChange={(e) => handleSortFieldChange(e.target.value as SortField)}
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

                <FilterChips
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onClearAll={clearFilters}
                />
            </Paper>

            <SessionList
                sessions={sortedSessions}
                loading={loading}
                error={error}
                refresh={refresh}
            />
        </Box>
    );
}