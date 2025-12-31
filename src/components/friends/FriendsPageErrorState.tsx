import { Container, Alert, AlertTitle } from '@mui/material';

interface FriendsPageErrorStateProps {
    errorMessage?: string;
}

export function FriendsPageErrorState({ errorMessage }: FriendsPageErrorStateProps) {
    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Alert severity="error">
                <AlertTitle>Error Loading Data</AlertTitle>
                {errorMessage || 'Failed to load data. Please try again later.'}
            </Alert>
        </Container>
    );
}