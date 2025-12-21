import { Suspense, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Alert, Box, Button, CircularProgress, Container, Typography } from '@mui/material';
import { LibraryGameList } from "../components/GameList";
import { GameSearch } from "../components/Searchbar.tsx";

export function LibraryPage() {
    const [searchTerm, setSearchTerm] = useState('');

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
