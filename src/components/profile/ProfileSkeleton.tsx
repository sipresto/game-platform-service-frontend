import { Container, Grid, Paper, Box, Skeleton } from '@mui/material';

export function ProfileSkeleton() {
    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper sx={{ p: 4, borderRadius: 2 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Skeleton variant="circular" width={120} height={120} sx={{ mb: 3 }} />
                            <Skeleton variant="text" width="80%" height={40} sx={{ mb: 1 }} />
                            <Skeleton variant="text" width="60%" height={24} sx={{ mb: 2 }} />
                            <Skeleton variant="rectangular" width={100} height={24} sx={{ borderRadius: 12, mb: 3 }} />
                            <Skeleton variant="rectangular" width="100%" height={100} sx={{ mb: 2 }} />
                            <Skeleton variant="rectangular" width="100%" height={40} sx={{ borderRadius: 1 }} />
                        </Box>
                    </Paper>
                </Grid>
                <Grid size={{ xs: 12, md: 8 }}>
                    <Paper sx={{ p: 3, borderRadius: 2 }}>
                        <Skeleton variant="text" width="40%" height={40} sx={{ mb: 3 }} />
                        <Grid container spacing={2}>
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <Grid key={i} size={{ xs: 6, sm: 4, md: 4, lg: 3 }}>
                                    <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 1 }} />
                                </Grid>
                            ))}
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
}