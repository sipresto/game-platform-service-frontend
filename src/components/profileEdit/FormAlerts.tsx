import { Alert, Grid } from '@mui/material';
import type { ApiError } from "../../services/keycloakService.ts";
import type { ProfileUpdateData } from "../../model/userProfile.ts";
import type { UseMutationResult } from "@tanstack/react-query";

interface FormAlertsProps {
    isLoading: boolean;
    error: Error | null;
    updateProfileMutation: UseMutationResult<void, Error, ProfileUpdateData>;
}

export function FormAlerts({ isLoading, error, updateProfileMutation }: FormAlertsProps) {
    const formatErrorMessage = (errorInstance: Error | null): string => {
        if (!errorInstance) return '';

        const apiError = errorInstance as ApiError;
        if (apiError.status) {
            const statusText = apiError.statusText ? ` ${apiError.statusText}` : '';
            return `(HTTP ${apiError.status}${statusText}) ${apiError.message}`;
        }
        return errorInstance.message;
    };

    return (
        <>
            {isLoading && (
                <Grid size={{ xs: 12 }}>
                    <Alert severity="info">
                        Loading profile data from backend...
                    </Alert>
                </Grid>
            )}

            {error && (
                <Grid size={{ xs: 12 }}>
                    <Alert severity="warning">
                        Could not load backend profile: {formatErrorMessage(error)}. You can still edit Keycloak data.
                    </Alert>
                </Grid>
            )}

            {updateProfileMutation.isError && (
                <Grid size={{ xs: 12 }}>
                    <Alert severity="error">
                        Error updating profile: {formatErrorMessage(updateProfileMutation.error)}
                    </Alert>
                </Grid>
            )}

            {updateProfileMutation.isSuccess && (
                <Grid size={{ xs: 12 }}>
                    <Alert severity="success">
                        Profile updated successfully!
                    </Alert>
                </Grid>
            )}
        </>
    );
}