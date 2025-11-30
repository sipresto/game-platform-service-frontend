import { Alert, Grid } from '@mui/material';

interface FormAlertsProps {
    isLoading: boolean;
    error: Error | null;
    updateProfileMutation: {
        isError: boolean;
        isSuccess: boolean;
        error: Error | null;
        isPending: boolean;
    };
}

export function FormAlerts({ isLoading, error, updateProfileMutation }: FormAlertsProps) {
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
                        Could not load backend profile: {error.message}. You can still edit Keycloak data.
                    </Alert>
                </Grid>
            )}

            {updateProfileMutation.isError && (
                <Grid size={{ xs: 12 }}>
                    <Alert severity="error">
                        Error updating profile: {updateProfileMutation.error?.message}
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