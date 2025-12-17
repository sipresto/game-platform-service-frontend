import { Box, Grid } from '@mui/material';
import { ProfileForm } from "./ProfileForm.tsx";
import { FormAlerts } from "./FormAlerts.tsx";
import { ActionButtons } from "./ActionButtons.tsx";
import type { UseMutationResult } from "@tanstack/react-query";
import type { FormState } from '../../hooks/useProfileForm';
import type { User } from "../../model/user.ts";
import type { UserProfile, ProfileUpdateData } from "../../model/userProfile.ts";
import React from "react";

interface ProfileTabProps {
    formState: FormState;
    loggedInUser: User | null;
    isLoading: boolean;
    error: Error | null;
    isDirty: boolean;
    updateProfileMutation: UseMutationResult<UserProfile, Error, ProfileUpdateData>;
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
    return (
        <Box component="form" onSubmit={onSubmit}>
            <Grid container spacing={3}>
                <ProfileForm
                    formState={formState}
                    loggedInUser={loggedInUser}
                    isLoading={isLoading}
                    error={error}
                    isSubmitting={updateProfileMutation.isPending}
                    isPrivacyUpdating={false}
                    onFieldChange={onFieldChange}
                    onPrivacyChange={() => {}}
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