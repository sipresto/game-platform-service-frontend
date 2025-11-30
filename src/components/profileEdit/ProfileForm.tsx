import React from 'react';
import { TextField, Grid, Divider } from '@mui/material';
import type {User} from "../../model/user.ts";

interface FormState {
    username: string;
    firstName: string;
    lastName: string;
    displayName: string;
    bio: string;
}

interface ProfileFormProps {
    formState: FormState;
    loggedInUser: User | null;
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
            <Grid size={{xs: 12}}>
                <TextField
                    fullWidth
                    label="Username"
                    value={formState.username}
                    onChange={handleChange('username')}
                    required
                    error={!formState.username.trim()}
                    helperText="Your unique login identifier - updates Keycloak"
                    variant="outlined"
                    disabled={isSubmitting}
                />
            </Grid>

            <Grid size={{xs: 12}}>
                <Divider />
            </Grid>

            <Grid size={{xs: 12, md: 6}}>
                <TextField
                    fullWidth
                    label="First Name"
                    value={formState.firstName}
                    onChange={handleChange('firstName')}
                    required
                    error={!formState.firstName.trim()}
                    helperText="Your first name - updates Keycloak"
                    variant="outlined"
                    disabled={isSubmitting}
                />
            </Grid>

            <Grid size={{xs: 12, md: 6}}>
                <TextField
                    fullWidth
                    label="Last Name"
                    value={formState.lastName}
                    onChange={handleChange('lastName')}
                    helperText="Your last name - updates Keycloak"
                    variant="outlined"
                    disabled={isSubmitting}
                />
            </Grid>

            <Grid size={{xs: 12}}>
                <TextField
                    fullWidth
                    label="Display Name"
                    value={formState.displayName}
                    onChange={handleChange('displayName')}
                    required
                    error={!formState.displayName.trim()}
                    helperText="This name appears to other users in the app - stored in our database"
                    variant="outlined"
                    disabled={isSubmitting}
                />
            </Grid>

            <Grid size={{xs: 12}}>
                <TextField
                    fullWidth
                    label="Bio"
                    value={formState.bio}
                    onChange={handleChange('bio')}
                    multiline
                    rows={4}
                    helperText="Tell others about yourself - stored in our database"
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
                        helperText="Email is managed by Keycloak"
                        variant="outlined"
                        disabled
                    />
                </Grid>
            )}
        </>
    );
}