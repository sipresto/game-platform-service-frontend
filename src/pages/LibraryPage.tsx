import {useState} from 'react';
import {Box, Container, Typography} from '@mui/material';
import {GameList} from "../components/GameList";
import type {GameFilterRequest} from "../model/gameRequest";
import {GameSearch} from "../components/Searchbar.tsx";

export function LibraryPage() {
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
                    Library
                </Typography>

                <Box sx={{ display: "flex", gap: 2, mb: 3, alignItems: "center" }}>
                    <Box sx={{ flexGrow: 1 }}>
                        <GameSearch
                            searchTerm={searchTerm}
                            onSearchTermChange={setSearchTerm}
                        />
                    </Box>
                </Box>

                <GameList searchTerm={searchTerm} filters={filters} isLibrary={true} />
            </Box>
        </Container>
    );
}
