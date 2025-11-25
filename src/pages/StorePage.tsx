import { useState } from 'react';
import { Typography, Container, Box } from '@mui/material';
import { GameSearch } from "../components/Searchbar";
import { GameList } from "../components/GameList";
import type { GameFilterRequest } from "../model/gameRequest";

export function StorePage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filters] = useState<GameFilterRequest>({});

    return (
        <Container maxWidth="xl" sx={{ p: 0 }}>
            <Box
                sx={{
                    mx: 'auto',
                    px: 2,
                    width: '100%',
                    maxWidth: 1200,
                    overflowX: 'hidden',
                }}
            >
                <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3 }}>
                    Game Store
                </Typography>

                <GameSearch
                    searchTerm={searchTerm}
                    onSearchTermChange={setSearchTerm}
                />

                <GameList searchTerm={searchTerm} filters={filters} />
            </Box>
        </Container>
    );
}
