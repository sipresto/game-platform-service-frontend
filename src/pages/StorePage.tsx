import { useContext } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import SecurityContext from '../context/SecurityContext'; // Adjust path as needed
import { useUserProfile } from '../hooks/useUserProfile'; // Adjust path as needed
import { MainLayout } from '../components/layout/MainLayout';
import {GameList} from "../components/gameList.tsx";

export function StorePage() {
    const { isLoading, isError, profile } = useUserProfile();

    useContext(SecurityContext);

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (isError || !profile) {
        return (
            <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h5" color="error">
                    Error loading user profile. Please log in again.
                </Typography>
            </Box>
        );
    }

    return (
        <MainLayout username={profile.username}>
            <GameList />
        </MainLayout>
    );
}