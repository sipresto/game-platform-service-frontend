import {useState} from 'react';
import {Box, Paper, Typography} from '@mui/material';
import {GameList} from "../components/GameList";
import type {GameFilterRequest} from "../model/gameRequest";
import {GameSearch} from "../components/Searchbar.tsx";

export function LibraryPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filters] = useState<GameFilterRequest>({});

    return (
        <Box sx={{ width: '100%', p: { xs: 1, sm: 2, md: 3 } }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight={600} gutterBottom>
                    Library
                </Typography>
            </Box>
            <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                <Box sx={{ flexGrow: 1 }}>
                    <GameSearch
                        searchTerm={searchTerm}
                        onSearchTermChange={setSearchTerm}
                    />
                </Box>
                </Paper>

            <GameList searchTerm={searchTerm} filters={filters} isLibrary={true} />
        </Box>
    );
}
