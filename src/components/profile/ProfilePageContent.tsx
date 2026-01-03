import {useState} from 'react';
import {useUserProfile, useUserProfileById} from "../../hooks/useUserProfile.ts";
import {useUserLibrary} from "../../hooks/useOwnedGames.ts";
import {useAchievementsForUser} from "../../hooks/useAchievementProgress.ts";
import {Alert, Container, Grid, Snackbar, Typography} from "@mui/material";
import {ProfileErrorState} from "./ProfileErrorState.tsx";
import {ProfileHeader} from "./ProfileHeader.tsx";
import {GameLibrarySection} from "./GameLibrarySection.tsx";
import {AchievementsSection} from "./AchievementsSection.tsx";
import {ProfileActions} from "./ProfileActions.tsx";
import {ProfileSkeleton} from "./ProfileSkeleton.tsx";

export function ProfilePageContent({ userId }: { userId: string }) {
    const { profile } = useUserProfile();
    const {
        data: user,
        isLoading: userLoading,
        error: userError,
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

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    if (userLoading || libraryLoading) {
        return <ProfileSkeleton/>;
    }

    if (userError || !user) {
        return (
            <ProfileErrorState
                errorMessage={userError?.message}
            />
        );
    }

    return (
        <>
            <Container maxWidth={false} sx={{ py: 4, width: '100%', position: 'relative' }}>
                <Grid container spacing={3} sx={{ width: '100%' }}>
                    <Grid size={{ xs: 12, md: 4 }} sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                        <ProfileHeader user={user} isOwnProfile={isOwnProfile} />
                        <ProfileActions user={user} isOwnProfile={isOwnProfile} />
                    </Grid>
                    <Grid size={{ xs: 12, md: 8 }} sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                        {libraryError && (
                            <Typography variant="body2">
                                Failed to load game library: {libraryError.message}
                            </Typography>
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