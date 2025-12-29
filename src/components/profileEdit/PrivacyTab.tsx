import { useState } from 'react';
import { Box, CircularProgress, Alert } from '@mui/material';
import {
    useVisibilitySettings,
    useUpdateGlobalVisibility,
    useUpdateFieldVisibility
} from '../../hooks/useUserProfile';
import {hasUniformVisibility, type Visibility, type VisibleField} from '../../model/userProfile';
import { PrivacyHeader } from './PrivacyHeader';
import { ViewModeToggle } from './ViewModeToggle';
import { SimplePrivacyView } from './SimplePrivacyView';
import { AdvancedPrivacyView } from './AdvancedPrivacyView';
import {PrivacyStatusAlerts} from "./PrivacyStatusAlerts.tsx";

type ViewMode = 'simple' | 'advanced';

export function PrivacyTab() {
    const [viewMode, setViewMode] = useState<ViewMode>('simple');
    const { data: settings, isLoading, error } = useVisibilitySettings();
    const updateGlobal = useUpdateGlobalVisibility();
    const updateField = useUpdateFieldVisibility();

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" p={4}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Alert severity="error" sx={{ m: 2 }}>
                Error loading privacy settings: {error.message}
            </Alert>
        );
    }

    if (!settings) {
        return null;
    }

    const isUniform = hasUniformVisibility(settings);
    const isUpdating = updateGlobal.isPending || updateField.isPending;

    const handleGlobalChange = (visibility: Visibility) => {
        updateGlobal.mutate(visibility);
    };

    const handleFieldChange = (field: VisibleField, visibility: Visibility) => {
        updateField.mutate({ field, visibility });
    };

    return (
        <Box>
            <PrivacyHeader />
            <ViewModeToggle viewMode={viewMode} onChange={setViewMode} />

            {viewMode === 'simple' ? (
                <SimplePrivacyView
                    isUniform={isUniform}
                    globalVisibility={settings.fieldVisibilities.POINTS}
                    onGlobalChange={handleGlobalChange}
                    isUpdating={isUpdating}
                />
            ) : (
                <AdvancedPrivacyView
                    fieldVisibilities={settings.fieldVisibilities}
                    onFieldChange={handleFieldChange}
                    isUpdating={isUpdating}
                />
            )}

            <PrivacyStatusAlerts
                isUpdating={isUpdating}
                globalError={updateGlobal.error}
                fieldError={updateField.error}
                globalSuccess={updateGlobal.isSuccess}
                fieldSuccess={updateField.isSuccess}
            />
        </Box>
    );
}