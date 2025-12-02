import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import type { Session } from "../model/session.ts";

interface SessionCardProps {
    session: Session;
}

export function SessionCard({ session }: SessionCardProps) {
    const getResultColor = (result: string) => {
        switch (result) {
            case 'WIN':
                return 'success';
            case 'LOSS':
                return 'error';
            case 'DRAW':
                return 'warning';
            default:
                return 'default';
        }
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'EASY':
                return 'success';
            case 'MEDIUM':
                return 'warning';
            case 'HARD':
                return 'error';
            default:
                return 'default';
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <Card sx={{
            minWidth: 300,
            maxWidth: 350,
            display: 'flex',
            flexDirection: 'column',
            height: 'fit-content',
            '&:hover': { boxShadow: 6 },
            transition: 'box-shadow 0.3s'
        }}>
            <CardContent sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                        <Typography variant="h6" component="div">
                            Game Session
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {formatDate(session.completedAt)}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column', alignItems: 'flex-end' }}>
                        <Chip
                            label={session.result}
                            color={getResultColor(session.result)}
                            size="small"
                        />
                        <Chip
                            label={session.difficulty}
                            color={getDifficultyColor(session.difficulty)}
                            size="small"
                            variant="outlined"
                        />
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
                    <Typography variant="body2">
                        <strong>Players:</strong> {session.playerIds.length}
                    </Typography>
                    {session.winnerId && (
                        <Typography variant="body2">
                            <strong>Winner ID:</strong> {session.winnerId}
                        </Typography>
                    )}
                </Box>
            </CardContent>

            {/* Always visible bottom bar */}
            <Box
                sx={{
                    p: 2,
                    bgcolor: 'grey.50',
                    borderTop: 1,
                    borderColor: 'grey.200',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}
            >
                <Typography variant="body2" color="text.secondary">
                    Session #{session.id.slice(0, 8)}
                </Typography>
                <Chip
                    label="Completed"
                    size="small"
                    color="primary"
                    variant="outlined"
                />
            </Box>
        </Card>
    );
}