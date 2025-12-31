import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useUserProfile, useUserProfileById } from "../../hooks/useUserProfile.ts";
import { useUserLibrary } from "../../hooks/useOwnedGames.ts";
import { useAchievementsForUser } from "../../hooks/useAchievementProgress.ts";
import { useProfileRefresh } from '../../hooks/useProfileRefresh.ts';
import {
    Container,
    Grid,
    Snackbar,
    Alert
} from "@mui/material";
import { ProfileLoadingState } from "./ProfileLoadingState.tsx";
import { ProfileErrorState } from "./ProfileErrorState.tsx";
import { ProfileRefreshButton } from "./ProfileRefreshButton.tsx";
import { LibraryErrorAlert } from "./LibraryErrorAlert.tsx";
import { ProfileHeader } from "./ProfileHeader.tsx";
import { GameLibrarySection } from "./GameLibrarySection.tsx";
import { AchievementsSection } from "./AchievementsSection.tsx";
import { ProfileActions } from "./ProfileActions.tsx";

export function ProfilePageContent({ userId }: { userId: string }) {
    const queryClient = useQueryClient();
    const { profile } = useUserProfile();
    const {
        data: user,
        isLoading: userLoading,
        error: userError,
        refetch: refetchUserProfile
    } = useUserProfileById(userId || '');
    const {
        games,
        isLoading: libraryLoading,
        error: libraryError
    } = useUserLibrary(user?.id);
    const {
        achievements
    } = useAchievementsForUser(userId);

    const isOwnProfile = profile?.id === userId;

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error'
    });

    const { isRefreshing, refreshProfile } = useProfileRefresh({
        userId,
        isOwnProfile,
        refetchUserProfile
    });

    const handleRefresh = async () => {
        try {
            await refreshProfile();
            setSnackbar({
                open: true,
                message: 'Profile data refreshed successfully',
                severity: 'success'
            });
        } catch (error) {
            console.error('Failed to refresh profile:', error);
            setSnackbar({
                open: true,
                message: 'Failed to refresh profile data',
                severity: 'error'
            });
        }
    };

    const handleRetryLibrary = async () => {
        if (user?.id) {
            try {
                await queryClient.invalidateQueries({ queryKey: ['userLibrary', user.id] });
                setSnackbar({
                    open: true,
                    message: 'Attempting to reload game library...',
                    severity: 'success'
                });
            } catch (error) {
                console.error('Failed to retry library:', error);
            }
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    if (userLoading || libraryLoading) {
        return <ProfileLoadingState isRefreshing={isRefreshing} />;
    }

    if (userError || !user) {
        return (
            <ProfileErrorState
                errorMessage={userError?.message}
                onRefresh={handleRefresh}
                isRefreshing={isRefreshing}
            />
        );
    }

    return (
        <>
            <Container maxWidth={false} sx={{ py: 4, width: '100%', position: 'relative' }}>
                <ProfileRefreshButton
                    onRefresh={handleRefresh}
                    isRefreshing={isRefreshing}
                    showRefreshingText
                />

                <Grid container spacing={3} sx={{ width: '100%' }}>
                    <Grid size={{ xs: 12, md: 4 }} sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                        <ProfileHeader user={user} isOwnProfile={isOwnProfile} />
                        <ProfileActions user={user} isOwnProfile={isOwnProfile} />
                    </Grid>
                    <Grid size={{ xs: 12, md: 8 }} sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                        {libraryError && (
                            <LibraryErrorAlert
                                errorMessage={libraryError.message}
                                onRetry={handleRetryLibrary}
                                isRefreshing={isRefreshing}
                            />
                        )}
                        {user.ownedGames !== undefined ? (
                            <GameLibrarySection games={games || []} isOwnProfile={isOwnProfile} />
                        ) : (
                            <Alert severity="info" sx={{ mb: 2 }}>
                                This user's game library is private.
                            </Alert>
                        )}
                    </Grid>
                    <Grid size={{ xs: 12 }} sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
                        <AchievementsSection
                            achievements={achievements}
                            achievementsVisible={user.ownedGames !== undefined}
                        />
                    </Grid>
                </Grid>
            </Container>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
                message={snackbar.message}
            />
        </>
    );
}