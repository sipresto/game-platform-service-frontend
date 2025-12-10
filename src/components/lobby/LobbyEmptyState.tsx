import { Box, Typography } from '@mui/material';
import { People as PeopleIcon } from '@mui/icons-material';

interface LobbyEmptyStateProps {
    gameName?: string;
}

export const LobbyEmptyState = ({ gameName }: LobbyEmptyStateProps) => (
    <Box sx={{ py: 8, textAlign: 'center' }}>
        <PeopleIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
            No lobbies available for {gameName || 'this game'}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Create one to get started!
        </Typography>
    </Box>
);
