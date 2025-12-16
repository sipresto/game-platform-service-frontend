// src/components/profileEdit/PrivacyTab.tsx

import {
    Alert,
    Box,
    CircularProgress,
    FormControlLabel,
    Grid,
    Switch,
    Typography,
    Radio,
    RadioGroup,
    FormControl,
    FormLabel
} from '@mui/material';
import type { UseMutationResult } from "@tanstack/react-query";
import type { PrivacyUpdateData } from "../../model/userProfile.ts";

interface FormState {
    username: string;
    firstName: string;
    lastName: string;
    displayName: string;
    bio: string;
    profile_visibility: 'PUBLIC' | 'FRIENDS_ONLY' | 'PRIVATE';
    showEmail?: boolean;
    showLocation?: boolean;
}

interface PrivacyTabProps {
    formState: FormState;
    isLoading: boolean;
    isPrivacyUpdating: boolean;
    updatePrivacyMutation: UseMutationResult<void, Error, PrivacyUpdateData>;
    onPrivacyChange: (field: string, value: boolean) => void;
    onVisibilityChange: (visibility: 'PUBLIC' | 'FRIENDS_ONLY' | 'PRIVATE') => void;
}

export function PrivacyTab({
                               formState,
                               isLoading,
                               isPrivacyUpdating,
                               updatePrivacyMutation,
                               onPrivacyChange,
                               onVisibilityChange
                           }: PrivacyTabProps) {
    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" p={4}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                Privacy Settings
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Control who can see your profile information.
            </Typography>

            <Grid container spacing={3}>
                <Grid size={{xs: 12}}>
                    <FormControl component="fieldset">
                        <FormLabel component="legend">Profile Visibility</FormLabel>
                        <RadioGroup
                            value={formState.profile_visibility}
                            onChange={(e) => onVisibilityChange(e.target.value as 'PUBLIC' | 'FRIENDS_ONLY' | 'PRIVATE')}
                        >
                            <FormControlLabel value="PUBLIC" control={<Radio />} label="Public (Anyone can view)" />
                            <FormControlLabel value="FRIENDS_ONLY" control={<Radio />} label="Friends Only" />
                            <FormControlLabel value="PRIVATE" control={<Radio />} label="Private (Only me)" />
                        </RadioGroup>
                    </FormControl>
                </Grid>

                <Grid size={{xs: 12}}>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={formState.showEmail ?? false}
                                onChange={(e) => onPrivacyChange('showEmail', e.target.checked)}
                                disabled={isPrivacyUpdating}
                            />
                        }
                        label="Show my email address on my profile"
                    />
                </Grid>

                <Grid size={{xs: 12}}>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={formState.showLocation ?? false}
                                onChange={(e) => onPrivacyChange('showLocation', e.target.checked)}
                                disabled={isPrivacyUpdating}
                            />
                        }
                        label="Show my location on my profile"
                    />
                </Grid>

                {updatePrivacyMutation.isError && (
                    <Grid size={{xs: 12}}>
                        <Alert severity="error">
                            Failed to update privacy settings: {updatePrivacyMutation.error?.message}
                        </Alert>
                    </Grid>
                )}

                {updatePrivacyMutation.isPending && (
                    <Grid size={{xs: 12}}>
                        <Alert severity="info">
                            Updating privacy settings...
                        </Alert>
                    </Grid>
                )}

                {updatePrivacyMutation.isSuccess && (
                    <Grid size={{xs: 12}}>
                        <Alert severity="success">
                            Privacy settings updated successfully!
                        </Alert>
                    </Grid>
                )}
            </Grid>
        </Box>
    );
}