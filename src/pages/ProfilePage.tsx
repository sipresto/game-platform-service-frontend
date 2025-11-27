import { Typography, Container, Box } from '@mui/material';
import { SessionList } from "../components/SessionList";

export function ProfilePage() {
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
                    Profile
                </Typography>

                <SessionList />
            </Box>
        </Container>
    );
}