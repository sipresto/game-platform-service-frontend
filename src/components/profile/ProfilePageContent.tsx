import { useUserProfile, useUserProfileById} from "../../hooks/useUserProfile.ts";
import { useUserLibrary } from "../../hooks/useOwnedGames.ts";
import { useAchievementsForUser } from "../../hooks/useAchievementProgress.ts";
import { ProfileSkeleton } from "./ProfileSkeleton.tsx";
import { Alert, Container, Grid, Typography } from "@mui/material";
import { ProfileHeader } from "./ProfileHeader.tsx";
import { GameLibrarySection } from "./GameLibrarySection.tsx";
import { AchievementsSection } from "./AchievementsSection.tsx";
import { ProfileActions } from "./ProfileActions.tsx";

export function ProfilePageContent({ userId }: { userId: string }) {
    const { profile } = useUserProfile();
    const { data: user, isLoading: userLoading, error: userError } = useUserProfileById(userId || '');
    const { games, isLoading: libraryLoading, error: libraryError } = useUserLibrary(user?.id);
    const { achievements } = useAchievementsForUser(userId);

    const isOwnProfile = profile?.id === userId;

    if (userLoading || libraryLoading) {
        return <ProfileSkeleton />;
    }

    if (userError || !user) {
        return (
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Alert severity="error">
                    <Typography variant="h6" gutterBottom>
                        Profile Not Available
                    </Typography>
                    <Typography variant="body2">
                        {userError?.message || 'This profile does not exist.'}
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
                    {user.ownedGames !== undefined ? (
                        <GameLibrarySection games={games || []} isOwnProfile={isOwnProfile} />
                    ) : (
                        <Alert severity="info" sx={{ mb: 2 }}>
                            <Typography variant="body2">
                                This user's game library is private.
                            </Typography>
                        </Alert>
                    )}
                </Grid>
                <Grid size={{ xs: 12 }} sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
                    <AchievementsSection achievements={achievements} />
                </Grid>
            </Grid>
        </Container>
    );
}