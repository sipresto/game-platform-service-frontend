import { Box, CircularProgress, Alert, Button, Typography } from '@mui/material';
import { useSessions } from '../hooks/useSessions';
import { SessionCard } from "./SessionCard.tsx";

export function SessionList() {
    const { sessions, loading, error, refresh } = useSessions();

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ mt: 4 }}>
                <Alert
                    severity="error"
                    action={
                        <Button color="inherit" size="small" onClick={() => void refresh()}>
                            Retry
                        </Button>
                    }
                >
                    {error}
                </Alert>
            </Box>
        );
    }

    if (sessions.length === 0) {
        return (
            <Box sx={{ textAlign: 'center', mt: 10, opacity: 0.6 }}>
                <Typography variant="h5" gutterBottom>
                    No game sessions yet
                </Typography>
                <Typography variant="body1">
                    Start playing games to see your session history here!
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 2,
            alignItems: 'flex-start'
        }}>
            {sessions.map((session) => (
                <SessionCard key={session.id} session={session} />
            ))}
        </Box>
    );
}