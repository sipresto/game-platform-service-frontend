import {
    Alert,
    Box,
    Button,
    ButtonGroup,
    CircularProgress,
    Divider,
    Paper,
    Stack,
    ToggleButton,
    ToggleButtonGroup,
    Typography
} from '@mui/material';
import { Public, Group, Lock, TuneOutlined, ViewListOutlined } from '@mui/icons-material';
import { useState } from 'react';
import {
    useVisibilitySettings,
    useUpdateGlobalVisibility,
    useUpdateFieldVisibility
} from '../../hooks/useUserProfile';
import type { Visibility, VisibleField } from '../../model/userProfile';
import { getAllFields, hasUniformVisibility } from '../../model/userProfile';

type ViewMode = 'simple' | 'advanced';

const visibilityConfig = {
    PUBLIC: {
        label: 'Public',
        description: 'Anyone can see this',
        icon: Public,
        color: 'success' as const
    },
    FRIENDS_ONLY: {
        label: 'Friends Only',
        description: 'Only your friends can see this',
        icon: Group,
        color: 'warning' as const
    },
    PRIVATE: {
        label: 'Private',
        description: 'Only you can see this',
        icon: Lock,
        color: 'error' as const
    }
};

const fieldConfig: Record<VisibleField, { label: string; description: string }> = {
    PROFILE: {
        label: 'Profile (Bio)',
        description: 'Your display name is always visible. This controls who can see your bio.'
    },
    POINTS: {
        label: 'Points',
        description: 'Your achievement points and gaming statistics.'
    },
    FAVORITE_GAMES: {
        label: 'Favorite Games',
        description: 'The list of games you\'ve marked as favorites.'
    },
    OWNED_GAMES: {
        label: 'Owned Games',
        description: 'The complete list of games in your library.'
    },
    FRIENDS_LIST: {
        label: 'Friends List',
        description: 'Who can see your friends and social connections.'
    }
};

interface VisibilityButtonGroupProps {
    value: Visibility;
    onChange: (value: Visibility) => void;
    disabled?: boolean;
}

function VisibilityButtonGroup({ value, onChange, disabled }: VisibilityButtonGroupProps) {
    return (
        <ToggleButtonGroup
            value={value}
            exclusive
            onChange={(_, newValue) => {
                if (newValue !== null) {
                    onChange(newValue as Visibility);
                }
            }}
            aria-label="visibility setting"
            disabled={disabled}
            fullWidth
            sx={{
                '& .MuiToggleButton-root': {
                    py: 1.5,
                    textTransform: 'none',
                    fontWeight: 500
                }
            }}
        >
            {(Object.entries(visibilityConfig) as [Visibility, typeof visibilityConfig[Visibility]][]).map(
                ([key, config]) => {
                    const Icon = config.icon;
                    return (
                        <ToggleButton
                            key={key}
                            value={key}
                            aria-label={config.label}
                            sx={{
                                '&.Mui-selected': {
                                    bgcolor: `${config.color}.50`,
                                    color: `${config.color}.main`,
                                    '&:hover': {
                                        bgcolor: `${config.color}.100`
                                    }
                                }
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Icon fontSize="small" />
                                <Typography variant="body2">{config.label}</Typography>
                            </Box>
                        </ToggleButton>
                    );
                }
            )}
        </ToggleButtonGroup>
    );
}

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
            {/* Header */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    Privacy Settings
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Control who can see your profile information and gaming activity.
                </Typography>
            </Box>

            {/* View Mode Toggle */}
            <Paper
                elevation={0}
                sx={{
                    p: 1,
                    mb: 3,
                    border: 1,
                    borderColor: 'divider',
                    display: 'inline-flex',
                    borderRadius: 2
                }}
            >
                <ButtonGroup variant="outlined" size="small">
                    <Button
                        onClick={() => setViewMode('simple')}
                        variant={viewMode === 'simple' ? 'contained' : 'outlined'}
                        startIcon={<ViewListOutlined />}
                    >
                        Simple
                    </Button>
                    <Button
                        onClick={() => setViewMode('advanced')}
                        variant={viewMode === 'advanced' ? 'contained' : 'outlined'}
                        startIcon={<TuneOutlined />}
                    >
                        Advanced
                    </Button>
                </ButtonGroup>
            </Paper>

            {viewMode === 'simple' ? (
                /* Simple Mode - Global Setting */
                <Stack spacing={3}>
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
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                            Profile Visibility
                        </Typography>

                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            {isUniform
                                ? 'Set visibility for all your profile information at once.'
                                : 'You have custom settings per field. Switch to Advanced mode to modify individual fields.'}
                        </Typography>

                        <VisibilityButtonGroup
                            value={settings.fieldVisibilities.POINTS}
                            onChange={handleGlobalChange}
                            disabled={isUpdating}
                        />
                    </Paper>

                    {/* Information Box */}
                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            border: 1,
                            borderColor: 'primary.main',
                            borderRadius: 2,
                            backgroundColor: 'primary.50'
                        }}
                    >
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5 }}>
                            What does each setting mean?
                        </Typography>
                        <Stack spacing={1.5}>
                            {(Object.entries(visibilityConfig) as [Visibility, typeof visibilityConfig[Visibility]][]).map(
                                ([key, config]) => {
                                    const Icon = config.icon;
                                    return (
                                        <Box key={key} sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                                            <Icon sx={{ color: `${config.color}.main`, mt: 0.25 }} fontSize="small" />
                                            <Box>
                                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                    {config.label}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {config.description}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    );
                                }
                            )}
                        </Stack>
                    </Paper>
                </Stack>
            ) : (
                /* Advanced Mode - Per-Field Settings */
                <Stack spacing={2}>
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
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                            Advanced Privacy Controls
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            Customize visibility for each type of information separately.
                        </Typography>

                        <Stack spacing={3} divider={<Divider />}>
                            {getAllFields().map((field) => {
                                const config = fieldConfig[field];
                                const isProfileField = field === 'PROFILE';

                                return (
                                    <Box key={field}>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                                            {config.label}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                                            {config.description}
                                        </Typography>

                                        {isProfileField ? (
                                            <Paper
                                                elevation={0}
                                                sx={{
                                                    p: 2,
                                                    bgcolor: 'grey.50',
                                                    border: 1,
                                                    borderColor: 'grey.300',
                                                    borderRadius: 1
                                                }}
                                            >
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Public sx={{ color: 'success.main' }} fontSize="small" />
                                                    <Typography variant="body2" color="text.secondary">
                                                        Always Public - Your display name is always visible to everyone
                                                    </Typography>
                                                </Box>
                                            </Paper>
                                        ) : (
                                            <VisibilityButtonGroup
                                                value={settings.fieldVisibilities[field]}
                                                onChange={(visibility) => handleFieldChange(field, visibility)}
                                                disabled={isUpdating}
                                            />
                                        )}
                                    </Box>
                                );
                            })}
                        </Stack>
                    </Paper>
                </Stack>
            )}

            {isUpdating && (
                <Alert severity="info" sx={{ mt: 3 }}>
                    Saving changes...
                </Alert>
            )}

            {updateGlobal.isError && (
                <Alert severity="error" sx={{ mt: 3 }}>
                    Failed to update visibility: {updateGlobal.error?.message}
                </Alert>
            )}

            {updateField.isError && (
                <Alert severity="error" sx={{ mt: 3 }}>
                    Failed to update field visibility: {updateField.error?.message}
                </Alert>
            )}

            {(updateGlobal.isSuccess || updateField.isSuccess) && !isUpdating && (
                <Alert severity="success" sx={{ mt: 3 }}>
                    Privacy settings updated successfully!
                </Alert>
            )}
        </Box>
    );
}