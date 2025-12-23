import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Alert, Box, Button, CircularProgress, Paper } from '@mui/material';
import { ChatScreen } from "../components/chat/ChatScreen.tsx";

export function ChatPage() {
    return (
        <Box sx={{ width: '100%', height: '100%' }}>
            <Paper
                sx={{
                    p: 2,
                    borderRadius: 2,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    boxSizing: 'border-box',
                }}
            >
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
                        {/* 3. Ensure ChatScreen takes remaining height explicitly */}
                        <Box sx={{ height: '100%', minHeight: 0, flex: 1 }}>
                            <ChatScreen />
                        </Box>
                    </Suspense>
                </ErrorBoundary>
            </Paper>
        </Box>
    );
}