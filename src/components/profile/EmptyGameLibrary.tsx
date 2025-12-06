import { Box, Typography, Button } from '@mui/material';
import { SportsEsports as GameIcon } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router';

interface EmptyGameLibraryProps {
    isOwnProfile: boolean;
}

export function EmptyGameLibrary({ isOwnProfile }: EmptyGameLibraryProps) {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                py: 8,
                textAlign: 'center',
            }}
        >
            <GameIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h5" gutterBottom fontWeight={600}>
                No games yet
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                {isOwnProfile ? 'Start building your collection' : "This user hasn't added any games yet"}
            </Typography>
            {isOwnProfile && (
                <Button
                    variant="contained"
                    size="large"
                    component={RouterLink}
                    to="/store"
                    sx={{
                        '&:hover': {
                            backgroundColor: 'primary.dark',
                            color: 'white',
                        }
                    }}
                >
                    Browse Store
                </Button>
            )}
        </Box>
    );
}
