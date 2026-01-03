import { Suspense, useState } from 'react';
import { Alert, Box, Button, CircularProgress, Paper, Typography } from '@mui/material';
import { GameSearch } from "../components/games/Searchbar.tsx";
import { StoreGameList } from "../components/games/GameList.tsx";
import type { GameFilterRequest } from "../model/gameRequest";
import { GameFilter } from "../components/games/GameFilter.tsx";
import { ErrorBoundary } from "react-error-boundary";

export function StorePage() {
    const [searchTerm, setSearchTerm] = useState("")
    const [filters, setFilters] = useState<GameFilterRequest>({})

    return (
        <Box sx={{width: '100%', p: {xs: 1, sm: 2, md: 3}}}>
            <Box sx={{mb: 4}}>
                <Typography variant="h4" fontWeight={600} gutterBottom>
                    Game Store
                </Typography>
            </Box>
            <Paper sx={{p: 3, mb: 3, borderRadius: 2}}>
                <Box sx={{display: "flex", gap: 2, alignItems: "center"}}>
                    <Box sx={{flexGrow: 1}}>
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
            </Paper>

            <ErrorBoundary
                fallbackRender={({ error, resetErrorBoundary }) => (
                    <Box sx={{ mt: 4 }}>
                        <Alert
                            severity="error"
                            action={
                                <Button color="inherit" size="small" onClick={resetErrorBoundary}>
                                    Retry
                                </Button>
                            }
                        >
                            {error.message}
                        </Alert>
                    </Box>
                )}
            >
                <Suspense fallback={
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
                        <CircularProgress />
                    </Box>
                }>
                    <StoreGameList searchText={searchTerm} filters={filters} />
                </Suspense>
            </ErrorBoundary>
        </Box>
    );
}