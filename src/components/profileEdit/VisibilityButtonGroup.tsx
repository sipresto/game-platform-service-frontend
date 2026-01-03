import React from 'react';
import {
    ToggleButton,
    ToggleButtonGroup,
    Typography,
    Box
} from '@mui/material';
import {visibilityConfig} from "../../model/constants.ts";
import type {Visibility} from "../../model/userProfile.ts";

interface VisibilityButtonGroupProps {
    value: Visibility;
    onChange: (value: Visibility) => void;
    disabled?: boolean;
}

export function VisibilityButtonGroup({ value, onChange, disabled }: VisibilityButtonGroupProps) {
    const handleChange = (_: React.MouseEvent<HTMLElement>, newValue: string) => {
        if (newValue !== null) {
            onChange(newValue as Visibility);
        }
    };

    return (
        <ToggleButtonGroup
            value={value}
            exclusive
            onChange={handleChange}
            aria-label="visibility setting"
            disabled={disabled}
            fullWidth
            sx={{
                '& .MuiToggleButton-root': {
                    py: 1.5,
                    textTransform: 'none',
                    fontWeight: 500,
                }
            }}
        >
            {Object.entries(visibilityConfig).map(
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