import { Container, Alert, Typography, Box } from '@mui/material';
import { ProfileRefreshButton } from './ProfileRefreshButton';

interface ProfileErrorStateProps {
    errorMessage?: string;
    onRefresh: () => void;
    isRefreshing: boolean;
}

export function ProfileErrorState({
                                      errorMessage,
                                      onRefresh,
                                      isRefreshing
                                  }: ProfileErrorStateProps) {
    return (
        <Container maxWidth="md" sx={{ py: 4, position: 'relative' }}>
            <Box sx={{ position: 'absolute', top: 16, left: 16 }}>
                <ProfileRefreshButton
                    onRefresh={onRefresh}
                    isRefreshing={isRefreshing}
                />
            </Box>
            <Alert severity="error">
                <Typography variant="h6" gutterBottom>
                    Profile Not Available
                </Typography>
                <Typography variant="body2">
                    {errorMessage || 'This profile does not exist or the user has blocked you.'}
                </Typography>
            </Alert>
        </Container>
    );
}