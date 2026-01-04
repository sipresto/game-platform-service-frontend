import React from 'react';
import {
    TextField,
    Grid,
    Divider
} from '@mui/material';
import type { KeycloakUser } from "../../model/keycloakUser.ts";

interface FormState {
    username: string;
    firstName: string;
    lastName: string;
    displayName: string;
    bio: string;
}

interface ProfileFormProps {
    formState: FormState;
    loggedInUser: KeycloakUser | null;
    isLoading: boolean;
    error: Error | null;
    isSubmitting: boolean;
    onFieldChange: (field: keyof FormState, value: string) => void;
}

export function ProfileForm({
                                formState,
                                loggedInUser,
                                isSubmitting,
                                onFieldChange
                            }: ProfileFormProps) {
    const handleChange = (field: keyof FormState) => (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        onFieldChange(field, event.target.value);
    };

    return (
        <>
            <Grid size={{ xs: 12 }}>
                <TextField
                    fullWidth
                    label="Username"
                    value={formState.username}
                    onChange={handleChange('username')}
                    required
                    error={!formState.username.trim()}
                    variant="outlined"
                    disabled={isSubmitting}
                />
            </Grid>

            <Grid size={{ xs: 12 }}>
                <Divider />
            </Grid>

            <Grid size={{ xs: 12 }}>
                <TextField
                    fullWidth
                    label="Display Name"
                    value={formState.displayName}
                    onChange={handleChange('displayName')}
                    required
                    error={!formState.displayName.trim()}
                    variant="outlined"
                    disabled={isSubmitting}
                />
            </Grid>

            <Grid size={{ xs: 12 }}>
                <TextField
                    fullWidth
                    label="Bio"
                    value={formState.bio}
                    onChange={handleChange('bio')}
                    multiline
                    rows={4}
                    variant="outlined"
                    disabled={isSubmitting}
                />
            </Grid>

            {loggedInUser?.email && (
                <Grid size={{ xs: 12 }}>
                    <TextField
                        fullWidth
                        label="Email"
                        value={loggedInUser.email}
                        aria-readonly={true}
                        variant="outlined"
                        disabled
                    />
                </Grid>
            )}
        </>
    );
}