import { Paper, Stack, Typography, Box } from '@mui/material';
import { VisibilityButtonGroup } from './VisibilityButtonGroup';
import type {Visibility} from "../../model/userProfile.ts";
import {visibilityConfig} from "../../model/constants.ts";

interface SimplePrivacyViewProps {
    isUniform: boolean;
    globalVisibility: Visibility;
    onGlobalChange: (visibility: Visibility) => void;
    isUpdating: boolean;
}

export function SimplePrivacyView({
                                      isUniform,
                                      globalVisibility,
                                      onGlobalChange,
                                      isUpdating
                                  }: SimplePrivacyViewProps) {
    return (
        <Stack spacing={3}>
            <Paper
                elevation={0}
                sx={{
                    p: 3,
                    border: 1,
                    borderColor: 'action.disabled',
                    borderRadius: 2
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
                    value={globalVisibility}
                    onChange={onGlobalChange}
                    disabled={isUpdating}
                />
            </Paper>

            <Paper
                elevation={0}
                sx={{
                    p: 3,
                    border: 1,
                    borderColor: 'action.disabled',
                    borderRadius: 2
                }}
            >
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5 }}>
                    What does each setting mean?
                </Typography>
                <Stack spacing={1.5}>
                    {Object.entries(visibilityConfig).map(
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
    );
}