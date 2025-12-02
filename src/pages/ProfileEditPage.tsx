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
import {useContext} from 'react';
import SecurityContext from '../context/SecurityContext';
import { useProfileForm } from '../hooks/useProfileForm';
import { ActionButtons } from "../components/profileEdit/ActionButtons.tsx";
import { FormAlerts } from "../components/profileEdit/FormAlerts.tsx";
import { ProfileForm } from "../components/profileEdit/ProfileForm.tsx";
import type {UseMutationResult} from "@tanstack/react-query";
import type {PrivacyUpdateData} from "../model/userProfile.ts";
import type {ApiError} from "../services/keycloakService.ts";

interface PrivacyAlertProps {
    mutation: UseMutationResult<void, Error, PrivacyUpdateData>;
}

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
    const formatErrorMessage = (errorInstance: Error): string => {
        const apiError = errorInstance as ApiError;
        if (apiError.status) {
            const statusText = apiError.statusText ? ` ${apiError.statusText}` : '';
            return `(HTTP ${apiError.status}${statusText}) ${apiError.message}`;
        }
        return errorInstance.message;
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Alert severity="error">Error loading profile: {formatErrorMessage(error)}</Alert>
        </Container>
    );
}

function PrivacyAlert({ mutation }: PrivacyAlertProps) {
    const formatErrorMessage = (errorInstance: Error | null): string => {
        if (!errorInstance) return '';

        const apiError = errorInstance as ApiError;
        if (apiError.status) {
            const statusText = apiError.statusText ? ` ${apiError.statusText}` : '';
            return `(HTTP ${apiError.status}${statusText}) ${apiError.message}`;
        }
        return errorInstance.message;
    };

    if (mutation.isError) {
        return (
            <Grid size={{ xs: 12 }}>
                <Alert severity="error" sx={{ mt: 2 }}>
                    Failed to update privacy settings: {formatErrorMessage(mutation.error)}
                </Alert>
            </Grid>
        );
    }

    if (mutation.isPending) {
        return (
            <Grid size={{ xs: 12 }}>
                <Alert severity="info" sx={{ mt: 2 }}>
                    Updating privacy settings...
                </Alert>
            </Grid>
        );
    }

    if (mutation.isSuccess) {
        return (
            <Grid size={{ xs: 12 }}>
                <Alert severity="success" sx={{ mt: 2 }}>
                    Privacy settings updated successfully!
                </Alert>
            </Grid>
        );
    }

    return null;
}

export function ProfileEditPage() {
    const { profile: userProfile, isLoading, error } = useUserProfile();
    const { loggedInUser } = useContext(SecurityContext);

    const loggedInUserOrNull = loggedInUser || null;

    const {
        formState,
        isDirty,
        updateProfileMutation,
        updatePrivacyMutation,
        handleFieldChange,
        handlePrivacyChange,
        handleReset,
        handleSubmit,
        isPrivacyUpdating
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
                            isPrivacyUpdating={isPrivacyUpdating}
                            onFieldChange={handleFieldChange}
                            onPrivacyChange={handlePrivacyChange}
                        />

                        <PrivacyAlert mutation={updatePrivacyMutation} />

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