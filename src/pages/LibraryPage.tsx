import { Suspense, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Alert, Box, Button, CircularProgress, Container, Typography } from '@mui/material';
import { LibraryGameList } from "../components/GameList";
import { GameSearch } from "../components/Searchbar.tsx";
import {useState} from 'react';
import {Box, Paper, Typography} from '@mui/material';
import {GameList} from "../components/GameList";
import type {GameFilterRequest} from "../model/gameRequest";
import {GameSearch} from "../components/Searchbar.tsx";

export function LibraryPage() {
    const [searchTerm, setSearchTerm] = useState('');

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
                        <LibraryGameList searchText={searchTerm} />
                    </Suspense>
                </ErrorBoundary>
            </Box>
        </Container>
    );
}
