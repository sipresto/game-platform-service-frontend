import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import {GameSearch} from "../components/Searchbar.tsx";
import {GameList} from "../components/GameList.tsx";
import type { GameFilterRequest } from "../model/gameRequest.ts";

export function StorePage() {
    const [searchTerm, setSearchTerm] = useState('');

    const [filters] = useState<GameFilterRequest>({});

    return (
        <Box>
            <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3 }}>
                Game Store
            </Typography>

            <GameSearch
                searchTerm={searchTerm}
                onSearchTermChange={setSearchTerm}
            />

            <GameList searchTerm={searchTerm} filters={filters} />
        </Box>
    );
}