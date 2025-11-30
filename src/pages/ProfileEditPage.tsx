import {
    Container,
    Paper,
    Typography,
    Box,
    Alert,
    CircularProgress,
    Grid,
} from '@mui/material';
import { useUserProfile } from '../hooks/useUserProfile';
import { useContext } from 'react';
import SecurityContext from '../context/SecurityContext';
import { useProfileForm } from '../hooks/useProfileForm';
import { ActionButtons } from "../components/profileEdit/ActionButtons.tsx";
import { FormAlerts } from "../components/profileEdit/FormAlerts.tsx";
import { ProfileForm } from "../components/profileEdit/ProfileForm.tsx";

function LoadingState() {
    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Box display="flex" justifyContent="center">
                <CircularProgress />
            </Box>
        </Container>
    );
}

function ErrorState({ error }: { error: Error }) {
    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Alert severity="error">Error loading profile: {error.message}</Alert>
        </Container>
    );
}

export function ProfileEditPage() {
    const { profile: userProfile, isLoading, error } = useUserProfile();
    const { loggedInUser } = useContext(SecurityContext);

    const loggedInUserOrNull = loggedInUser || null;

    const {
        formState,
        isDirty,
        updateProfileMutation,
        handleFieldChange,
        handleReset,
        handleSubmit
    } = useProfileForm({ userProfile, loggedInUser: loggedInUserOrNull });

    if (isLoading && !loggedInUser) {
        return <LoadingState />;
    }

    if (error && !loggedInUser) {
        return <ErrorState error={error} />;
    }

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Edit Profile
            </Typography>

            <Paper sx={{ p: 3 }}>
                <Box component="form" onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <ProfileForm
                            formState={formState}
                            loggedInUser={loggedInUserOrNull}
                            isLoading={isLoading}
                            error={error}
                            isSubmitting={updateProfileMutation.isPending}
                            onFieldChange={handleFieldChange}
                        />

                        <FormAlerts
                            isLoading={isLoading}
                            error={error}
                            updateProfileMutation={updateProfileMutation}
                        />

                        <ActionButtons
                            isDirty={isDirty}
                            isSubmitting={updateProfileMutation.isPending}
                            formState={formState}
                            onReset={handleReset}
                        />
                    </Grid>
                </Box>
            </Paper>
        </Container>
    );
}