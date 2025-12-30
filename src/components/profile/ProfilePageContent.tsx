import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useUserProfile, useUserProfileById } from "../../hooks/useUserProfile.ts";
import { useUserLibrary } from "../../hooks/useOwnedGames.ts";
import { useAchievementsForUser } from "../../hooks/useAchievementProgress.ts";
import { ProfileSkeleton } from "./ProfileSkeleton.tsx";
import { Alert, Container, Grid, Typography, IconButton, Tooltip, Box, Snackbar } from "@mui/material";
import { Refresh } from "@mui/icons-material";
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

    const [isRefreshing, setIsRefreshing] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

    const isOwnProfile = profile?.id === userId;

    const handleRefresh = async () => {
        if (isRefreshing) return;

        try {
            setIsRefreshing(true);

            // Invalidate all profile-related queries
            const promises = [];

            // Always invalidate user profile and achievements
            promises.push(
                queryClient.invalidateQueries({ queryKey: ['userProfileById', userId] }),
                queryClient.invalidateQueries({ queryKey: ['achievements', userId] })
            );

            // Invalidate library if user exists
            if (user?.id) {
                promises.push(
                    queryClient.invalidateQueries({ queryKey: ['userLibrary', user.id] })
                );
            }

            // If viewing own profile, also invalidate main profile
            if (isOwnProfile) {
                promises.push(
                    queryClient.invalidateQueries({ queryKey: ['userProfile'] }),
                    queryClient.invalidateQueries({ queryKey: ['myOwnedGames'] })
                );
            }

            await Promise.all(promises);

            // Refetch the user profile immediately so it updates
            if (refetchUserProfile) {
                await refetchUserProfile();
            }

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
        } finally {
            setIsRefreshing(false);
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
        return (
            <Box position="relative">
                <ProfileSkeleton />
                {isRefreshing && (
                    <Box sx={{
                        position: 'absolute',
                        top: 16,
                        left: 16,
                        zIndex: 1
                    }}>
                        <Tooltip title="Refreshing...">
                            <IconButton disabled>
                                <Refresh sx={{ animation: 'spin 1s linear infinite' }} />
                            </IconButton>
                        </Tooltip>
                    </Box>
                )}
            </Box>
        );
    }

    if (userError || !user) {
        return (
            <Container maxWidth="md" sx={{ py: 4, position: 'relative' }}>
                <Box sx={{ position: 'absolute', top: 16, left: 16 }}>
                    <Tooltip title="Refresh profile">
                        <IconButton
                            onClick={handleRefresh}
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
        <>
            <Container maxWidth={false} sx={{ py: 4, width: '100%', position: 'relative' }}>
                <Box sx={{
                    position: 'absolute',
                    top: 16,
                    left: 16,
                    zIndex: 1
                }}>
                    <Tooltip title="Refresh profile data">
                        <IconButton
                            onClick={handleRefresh}
                            disabled={isRefreshing}
                            sx={{
                                bgcolor: 'background.paper',
                                border: '1px solid',
                                borderColor: 'divider',
                                boxShadow: 1,
                                '&:hover': {
                                    bgcolor: 'background.paper'
                                }
                            }}
                        >
                            <Refresh
                                sx={{
                                    animation: isRefreshing ? 'spin 1s linear infinite' : 'none'
                                }}
                            />
                        </IconButton>
                    </Tooltip>
                </Box>

                {isRefreshing && (
                    <Box sx={{
                        position: 'absolute',
                        top: 60,
                        left: 16,
                        zIndex: 1
                    }}>
                        <Typography variant="caption" color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Refresh sx={{ fontSize: 12, animation: 'spin 1s linear infinite' }} />
                            Refreshing...
                        </Typography>
                    </Box>
                )}

                <Grid container spacing={3} sx={{ width: '100%' }}>
                    <Grid size={{ xs: 12, md: 4 }} sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                        <ProfileHeader user={user} isOwnProfile={isOwnProfile} />
                        <ProfileActions user={user} isOwnProfile={isOwnProfile} />
                    </Grid>
                    <Grid size={{ xs: 12, md: 8 }} sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                        {libraryError && (
                            <Alert severity="warning" sx={{ mb: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <Typography variant="body2">
                                        Failed to load game library: {libraryError.message}
                                    </Typography>
                                    <Tooltip title="Retry loading library">
                                        <IconButton
                                            size="small"
                                            onClick={handleRetryLibrary}
                                            disabled={isRefreshing}
                                        >
                                            <Refresh sx={{ fontSize: 16 }} />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
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
                        <AchievementsSection achievements={achievements} achievementsVisible={user.ownedGames !== undefined} />
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