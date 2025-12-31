import { Container, Alert, AlertTitle, Box, Tooltip, IconButton } from '@mui/material';
import { Refresh } from '@mui/icons-material';

interface UsersPageErrorStateProps {
    errorMessage?: string;
    onRefresh: () => void;
    isRefreshing: boolean;
}

export function UsersPageErrorState({
                                        errorMessage,
                                        onRefresh,
                                        isRefreshing
                                    }: UsersPageErrorStateProps) {
    return (
        <Container maxWidth="lg" sx={{ py: 4, position: 'relative' }}>
            <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
                <Tooltip title="Refresh users">
                    <IconButton
                        onClick={onRefresh}
                        disabled={isRefreshing}
                    >
                        <Refresh
                            sx={{
                                animation: isRefreshing ? 'spin 1s linear infinite' : 'none'
                            }}
                        />
                    </IconButton>
                </Tooltip>
            </Box>
            <Alert severity="error">
                <AlertTitle>Error Loading Users</AlertTitle>
                {errorMessage || 'Failed to load users. Please try again later.'}
            </Alert>
        </Container>
    );
}