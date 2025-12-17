import { Box, CircularProgress, Alert, Button, Typography } from '@mui/material';
import { Gamepad } from '@mui/icons-material';
import { useState } from 'react';
import { SessionCard } from "./SessionCard";
import { SessionDetailDialog } from "./SessionDetailDialog";
import type { EnhancedSession } from "../../utils/sessionEnhancer";

interface SessionListProps {
    sessions: EnhancedSession[];
    loading: boolean;
    error: string | null;
    refresh: () => void;
}

export function SessionList({ sessions, loading, error, refresh }: SessionListProps) {
    const [selectedSession, setSelectedSession] = useState<EnhancedSession | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    const handleCardClick = (session: EnhancedSession) => {
        setSelectedSession(session);
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setSelectedSession(null);
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
                <CircularProgress size={60} />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ mt: 4 }}>
                <Alert
                    severity="error"
                    action={
                        <Button color="inherit" size="small" onClick={refresh}>
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
            <Box sx={{
                textAlign: 'center',
                py: 10,
                px: 2,
                bgcolor: 'grey.50',
                borderRadius: 2,
                border: '2px dashed',
                borderColor: 'grey.300'
            }}>
                <Gamepad sx={{ fontSize: 48, opacity: 0.3, mb: 2 }} />
                <Typography variant="h5" gutterBottom fontWeight={600}>
                    No game sessions yet
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Start playing games to see your session history here!
                </Typography>
            </Box>
        );
    }

    return (
        <>
            <Box sx={{
                display: 'grid',
                gridTemplateColumns: {
                    xs: '1fr',
                    sm: 'repeat(auto-fill, minmax(320px, 1fr))',
                },
                gap: 3,
                alignItems: 'start'
            }}>
                {sessions.map((session) => (
                    <SessionCard
                        key={session.id}
                        session={session}
                        onClick={() => handleCardClick(session)}
                    />
                ))}
            </Box>

            <SessionDetailDialog
                open={dialogOpen}
                onClose={handleCloseDialog}
                session={selectedSession}
            />
        </>
    );
}