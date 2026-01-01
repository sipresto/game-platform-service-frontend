import { useParams } from 'react-router';
import { Alert, Box, Button, Container, Typography } from '@mui/material';
import { ThemeProvider, useTheme } from '@mui/material/styles';
import { ProfileSkeleton } from '../components/profile/ProfileSkeleton';
import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";
import { ProfilePageContent } from "../components/profile/ProfilePageContent.tsx";
import { useUserProfileById } from "../hooks/useUserProfile.ts";
import { useProfileTheme } from "../hooks/useProfileTheme.ts";
import { THEME_STYLES } from "../utils/perkConstants.ts";

function ProfilePageWithTheme({ userId }: { userId: string }) {
    const { data: user, isLoading } = useUserProfileById(userId);
    const baseTheme = useTheme();
    const profileTheme = useProfileTheme({
        equippedThemeId: user?.equippedThemeId,
        baseTheme
    });

    const themeConfig = user?.equippedThemeId ? THEME_STYLES[user.equippedThemeId] : null;

    if (isLoading) {
        return <ProfileSkeleton />;
    }

    return (
        <ThemeProvider theme={profileTheme}>
            <Box
                sx={{
                    minHeight: '100vh',
                    width: '100%',
                    ...(themeConfig && {
                        background: themeConfig.background,
                        color: themeConfig.color,
                    }),
                }}
            >
                <ProfilePageContent userId={userId} />
            </Box>
        </ThemeProvider>
    );
}

export function ProfilePage() {
    const { userId } = useParams<{ userId: string }>();
    console.log(`received id: ${userId}`);

    if (!userId) {
        return (
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Alert severity="error">
                    <Typography variant="h6" gutterBottom>
                        Profile Not Found
                    </Typography>
                    <Typography variant="body2">
                        Invalid profile ID.
                    </Typography>
                </Alert>
            </Container>
        );
    }

    return (
        <ErrorBoundary
            fallbackRender={({ error, resetErrorBoundary }) => (
                <Container maxWidth="md" sx={{ py: 4 }}>
                    <Alert
                        severity="error"
                        action={
                            <Button color="inherit" size="small" onClick={resetErrorBoundary}>
                                Retry
                            </Button>
                        }
                    >
                        <Typography variant="h6" gutterBottom>
                            Profile Not Found
                        </Typography>
                        <Typography variant="body2">
                            {error?.message || 'This profile does not exist or is not available.'}
                        </Typography>
                    </Alert>
                </Container>
            )}
        >
            <Suspense fallback={<ProfileSkeleton />}>
                <ProfilePageWithTheme userId={userId} />
            </Suspense>
        </ErrorBoundary>
    );
}