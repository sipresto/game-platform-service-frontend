import { Box, Grid } from '@mui/material';
import { ProfileForm } from "./ProfileForm.tsx";
import { FormAlerts } from "./FormAlerts.tsx";
import { ActionButtons } from "./ActionButtons.tsx";
import { ProfileImageUpload } from "./ProfileImageUpload.tsx";
import type { UseMutationResult } from "@tanstack/react-query";
import type { KeycloakUser } from "../../model/keycloakUser.ts";
import type { ProfileUpdateData } from "../../model/userProfile.ts";
import React from "react";
import { useUserProfile } from "../../hooks/useUserProfile.ts";

interface FormState {
    username: string;
    firstName: string;
    lastName: string;
    displayName: string;
    bio: string;
}

interface ProfileTabProps {
    formState: FormState;
    loggedInUser: KeycloakUser | null;
    isLoading: boolean;
    error: Error | null;
    isDirty: boolean;
    updateProfileMutation: UseMutationResult<void, Error, ProfileUpdateData>;
    onFieldChange: (field: string, value: string) => void;
    onReset: () => void;
    onSubmit: (e: React.FormEvent) => void;
}

export function ProfileTab({
                               formState,
                               loggedInUser,
                               isLoading,
                               error,
                               isDirty,
                               updateProfileMutation,
                               onFieldChange,
                               onReset,
                               onSubmit
                           }: ProfileTabProps) {
    const displayName = formState.displayName || formState.username || 'KeycloakUser';
    const { profile } = useUserProfile();

    return (
        <Box component="form" onSubmit={onSubmit}>
            <Grid container spacing={3}>
                <Grid size={{ xs: 12 }}>
                    <ProfileImageUpload
                        userId={profile?.id ?? ''}
                        displayName={displayName}
                        size={120}
                    />
                </Grid>

                <ProfileForm
                    formState={formState}
                    loggedInUser={loggedInUser}
                    isLoading={isLoading}
                    error={error}
                    isSubmitting={updateProfileMutation.isPending}
                    onFieldChange={onFieldChange}
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
                    onReset={onReset}
                />
            </Grid>
        </Box>
    );
}