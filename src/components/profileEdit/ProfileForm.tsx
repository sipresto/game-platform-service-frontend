import React from 'react';
import {
    TextField,
    Grid,
    Divider,
    FormControl,
    RadioGroup,
    FormControlLabel,
    Radio,
    Box,
    Typography,
    Paper,
    Stack
} from '@mui/material';
import { Public, Group, Lock } from '@mui/icons-material';
import type { User } from "../../model/user.ts";

interface FormState {
    username: string;
    firstName: string;
    lastName: string;
    displayName: string;
    bio: string;
    profile_visibility: 'PUBLIC' | 'FRIENDS_ONLY' | 'PRIVATE';
}

interface ProfileFormProps {
    formState: FormState;
    loggedInUser: User | null;
    isLoading: boolean;
    error: Error | null;
    isSubmitting: boolean;
    onFieldChange: (field: keyof FormState, value: string) => void;
    onPrivacyChange: (visibility: 'PUBLIC' | 'FRIENDS_ONLY' | 'PRIVATE') => void;
    isPrivacyUpdating?: boolean;
}

export function ProfileForm({
                                formState,
                                loggedInUser,
                                isSubmitting,
                                onFieldChange,
                                onPrivacyChange,
                                isPrivacyUpdating = false
                            }: ProfileFormProps) {
    const handleChange = (field: keyof FormState) => (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        onFieldChange(field, event.target.value);
    };

    const handlePrivacyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newVisibility = event.target.value as 'PUBLIC' | 'FRIENDS_ONLY' | 'PRIVATE';
        onPrivacyChange(newVisibility);
    };

    const privacyOptions = [
        {
            value: 'PUBLIC',
            label: 'Public',
            description: 'Anyone can view your profile',
            icon: <Public sx={{ color: 'success.main' }} />
        },
        {
            value: 'FRIENDS_ONLY',
            label: 'Friends Only',
            description: 'Only your friends can view your profile',
            icon: <Group sx={{ color: 'warning.main' }} />
        },
        {
            value: 'PRIVATE',
            label: 'Private',
            description: 'Only you can view your profile',
            icon: <Lock sx={{ color: 'error.main' }} />
        }
    ];

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
                    helperText="Your unique login identifier"
                    variant="outlined"
                    disabled={isSubmitting}
                />
            </Grid>

            <Grid size={{ xs: 12 }}>
                <Divider />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                    fullWidth
                    label="First Name"
                    value={formState.firstName}
                    onChange={handleChange('firstName')}
                    required
                    error={!formState.firstName.trim()}
                    variant="outlined"
                    disabled={isSubmitting}
                />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                    fullWidth
                    label="Last Name"
                    value={formState.lastName}
                    onChange={handleChange('lastName')}
                    variant="outlined"
                    disabled={isSubmitting}
                />
            </Grid>

            <Grid size={{ xs: 12 }}>
                <TextField
                    fullWidth
                    label="Display Name"
                    value={formState.displayName}
                    onChange={handleChange('displayName')}
                    required
                    error={!formState.displayName.trim()}
                    helperText="This name appears to other users in the app"
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

            <Grid size={{ xs: 12 }}>
                <Divider sx={{ my: 3 }} />
            </Grid>

            <Grid size={{ xs: 12 }}>
                <Paper
                    elevation={0}
                    sx={{
                        p: 3,
                        border: 1,
                        borderColor: 'divider',
                        borderRadius: 2,
                        backgroundColor: 'background.default'
                    }}
                >
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                        Who can see your profile?
                    </Typography>

                    <FormControl component="fieldset" fullWidth disabled={isPrivacyUpdating}>
                        <RadioGroup
                            value={formState.profile_visibility || 'PUBLIC'}
                            onChange={handlePrivacyChange}
                            name="profile-visibility"
                        >
                            <Stack spacing={1.5}>
                                {privacyOptions.map((option) => (
                                    <Paper
                                        key={option.value}
                                        elevation={0}
                                        sx={{
                                            p: 2,
                                            borderRadius: 1.5,
                                            border: 2,
                                            borderColor: formState.profile_visibility === option.value
                                                ? 'primary.main'
                                                : 'transparent',
                                            backgroundColor: formState.profile_visibility === option.value
                                                ? 'primary.50'
                                                : 'transparent',
                                            transition: 'all 0.2s ease',
                                            '&:hover': {
                                                backgroundColor: 'action.hover',
                                                cursor: 'pointer'
                                            }
                                        }}
                                        onClick={() => !isPrivacyUpdating &&
                                            onPrivacyChange(option.value as 'PUBLIC' | 'FRIENDS_ONLY' | 'PRIVATE')
                                        }
                                    >
                                        <FormControlLabel
                                            value={option.value}
                                            control={
                                                <Radio
                                                    sx={{
                                                        mr: 2,
                                                        color: formState.profile_visibility === option.value
                                                            ? 'primary.main'
                                                            : 'action.active'
                                                    }}
                                                />
                                            }
                                            label={
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    {option.icon}
                                                    <Box>
                                                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                                            {option.label}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {option.description}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            }
                                            sx={{
                                                m: 0,
                                                width: '100%'
                                            }}
                                        />
                                    </Paper>
                                ))}
                            </Stack>
                        </RadioGroup>
                    </FormControl>
                </Paper>
            </Grid>
        </>
    );
}