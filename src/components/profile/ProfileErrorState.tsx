import { Container, Alert, Typography } from '@mui/material';

interface ProfileErrorStateProps {
    errorMessage?: string;
}

export function ProfileErrorState({
                                      errorMessage
                                  }: ProfileErrorStateProps) {
    return (
        <Container maxWidth="md" sx={{ py: 4, position: 'relative' }}>
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