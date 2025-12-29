import { Paper, Stack, Typography, Box, Divider } from '@mui/material';
import { Public } from '@mui/icons-material';
import { VisibilityButtonGroup } from './VisibilityButtonGroup';
import {getAllFields, type Visibility, type VisibleField} from '../../model/userProfile';
import {fieldConfig} from "../../model/constants.ts";

interface AdvancedPrivacyViewProps {
    fieldVisibilities: Record<VisibleField, Visibility>;
    onFieldChange: (field: VisibleField, visibility: Visibility) => void;
    isUpdating: boolean;
}

export function AdvancedPrivacyView({
                                        fieldVisibilities,
                                        onFieldChange,
                                        isUpdating
                                    }: AdvancedPrivacyViewProps) {
    return (
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
                <Box sx={{ height: 1.5, bgcolor: 'primary.main', mb: 2 }} />

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
                                        value={fieldVisibilities[field]}
                                        onChange={(visibility) => onFieldChange(field, visibility)}
                                        disabled={isUpdating}
                                    />
                                )}
                            </Box>
                        );
                    })}
                </Stack>
            </Paper>
        </Stack>
    );
}