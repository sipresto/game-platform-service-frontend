import {useState} from 'react';
import {Box, Container, Typography} from '@mui/material';
import {GameSearch} from "../components/Searchbar";
import {GameList} from "../components/GameList";
import type {GameFilterRequest} from "../model/gameRequest";
import {GameFilter} from "../components/GameFilter.tsx";

export function StorePage() {
    const [searchTerm, setSearchTerm] = useState("")
    const [filters, setFilters] = useState<GameFilterRequest>({})

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

                <Box sx={{ display: "flex", gap: 2, mb: 3, alignItems: "center" }}>
                    <Box sx={{ flexGrow: 1 }}>
                        <GameSearch
                            searchTerm={searchTerm}
                            onSearchTermChange={setSearchTerm}
                        />
                    </Box>

                    <GameFilter
                        filters={filters}
                        onFiltersChange={setFilters}
                    />
                </Box>

                <GameList searchTerm={searchTerm} filters={filters} />
            </Box>
        </Container>
    );
}
