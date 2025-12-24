import { useCurrentUser, useUserProfileById } from "../../hooks/useUserProfile.ts";
import { useUserLibrary } from "../../hooks/useOwnedGames.ts";
import { useAchievementsForUser } from "../../hooks/useAchievementProgress.ts";
import { ProfileSkeleton } from "./ProfileSkeleton.tsx";
import { Alert, Container, Grid, Typography } from "@mui/material";
import { ProfileHeader } from "./ProfileHeader.tsx";
import { GameLibrarySection } from "./GameLibrarySection.tsx";
import { AchievementsSection } from "./AchievementsSection.tsx";
import { ProfileActions } from "./ProfileActions.tsx";

export function ProfilePageContent({ keycloakId }: { keycloakId: string }) {
    const { keycloakId: currentUserKeycloakId } = useCurrentUser();
    const { data: user, isLoading: userLoading, error: userError } = useUserProfileById(keycloakId || '');
    const { games, isLoading: libraryLoading, error: libraryError } = useUserLibrary(user?.id);
    const { achievements } = useAchievementsForUser(keycloakId);

    const isOwnProfile = currentUserKeycloakId === keycloakId;
    const canViewProfile = user?.visibility === 'PUBLIC' || isOwnProfile;

    if (userLoading || libraryLoading) {
        return <ProfileSkeleton />;
    }

    if (userError || !user) {
        return (
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Alert severity="error">
                    <Typography variant="h6" gutterBottom>
                        Profile Not Found
                    </Typography>
                    <Typography variant="body2">
                        {userError?.message || 'This profile does not exist or is not available.'}
                    </Typography>
                </Alert>
            </Container>
        );
    }

    if (!canViewProfile) {
        return (
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Alert severity="warning">
                    <Typography variant="h6" gutterBottom>
                        Private Profile
                    </Typography>
                    <Typography variant="body2">
                        This profile is private. Only the owner can view it.
                    </Typography>
                </Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth={false} sx={{ py: 4, width: '100%' }}>
            <Grid container spacing={3} sx={{ width: '100%' }}>
                <Grid size={{ xs: 12, md: 4 }} sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                    <ProfileHeader user={user} isOwnProfile={isOwnProfile} />
                    <ProfileActions user={user} isOwnProfile={isOwnProfile} />
                </Grid>
                <Grid size={{ xs: 12, md: 8 }} sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                    {libraryError && (
                        <Alert severity="warning" sx={{ mb: 2 }}>
                            <Typography variant="body2">
                                Failed to load game library: {libraryError.message}
                            </Typography>
                        </Alert>
                    )}
                    <GameLibrarySection games={games || []} isOwnProfile={isOwnProfile} />
                </Grid>
                <Grid size={{ xs: 12 }} sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
                    <AchievementsSection achievements={achievements} />
                </Grid>
            </Grid>
        </Container>
    );
}