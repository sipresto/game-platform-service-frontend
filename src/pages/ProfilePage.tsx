import { useParams } from 'react-router';
import {Container, Alert, Typography, Grid} from '@mui/material';
import { useCurrentUser, useUserProfileById } from '../hooks/useUserProfile';
import { ProfileHeader } from '../components/profile/ProfileHeader';
import { GameLibrarySection } from '../components/profile/GameLibrarySection';
import { ProfileSkeleton } from '../components/profile/ProfileSkeleton';
import { useOwnedGamesForUser } from "../hooks/useOwnedGames.ts";
import { AchievementsSection } from "../components/profile/AchievementsSection.tsx";
import { useAchievementsForUser } from "../hooks/useAchievementProgress.ts";
import { ProfileActions } from '../components/profile/ProfileActions';

export function ProfilePage() {
    const { keycloakId } = useParams<{ keycloakId: string }>();
    const { keycloakId: currentUserKeycloakId } = useCurrentUser();
    const { data: user, isLoading, error } = useUserProfileById(keycloakId || '');
    const { games, loading: gamesLoading } = useOwnedGamesForUser(keycloakId || '', '');
    const { achievements, loading: achievementsLoading } = useAchievementsForUser(keycloakId || "");
    const isOwnProfile = currentUserKeycloakId === keycloakId;
    const canViewProfile = user?.visibility === 'PUBLIC' || isOwnProfile;

    if (isLoading) {
        return <ProfileSkeleton />;
    }

    if (error || !user) {
        return (
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Alert severity="error">
                    <Typography variant="h6" gutterBottom>
                        Profile Not Found
                    </Typography>
                    <Typography variant="body2">
                        {error?.message || 'This profile does not exist or is not available.'}
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
                    <GameLibrarySection games={games} loading={gamesLoading} isOwnProfile={isOwnProfile} />
                </Grid>
                <Grid size={{ xs: 12 }} sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
                    <AchievementsSection achievements={achievements} loading={achievementsLoading} />
                </Grid>
            </Grid>
        </Container>
    );
}