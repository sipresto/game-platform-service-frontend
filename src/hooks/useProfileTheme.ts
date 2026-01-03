import { useMemo } from 'react';
import { createTheme, type Theme } from '@mui/material/styles';
import { THEME_STYLES } from '../utils/perkConstants';

interface UseProfileThemeOptions {
    equippedThemeId?: string | null;
    baseTheme: Theme;
}

export function useProfileTheme({ equippedThemeId, baseTheme }: UseProfileThemeOptions): Theme {
    return useMemo(() => {
        if (!equippedThemeId || !THEME_STYLES[equippedThemeId]) {
            return baseTheme;
        }

        const themeConfig = THEME_STYLES[equippedThemeId];

        return createTheme(baseTheme, {
            palette: {
                primary: {
                    main: themeConfig.accentColor,
                    contrastText: '#ffffff',
                },
                text: {
                    secondary: themeConfig.secondaryTextColor,
                }
            },
            components: {
                MuiCssBaseline: {
                    styleOverrides: {
                        body: {
                            background: themeConfig.background,
                            color: themeConfig.color,
                        },
                    },
                },
                MuiContainer: {
                    styleOverrides: {
                        root: {
                            background: themeConfig.background,
                            color: themeConfig.color,
                        },
                    },
                },
                MuiPaper: {
                    styleOverrides: {
                        root: {
                            background: themeConfig.background,
                            color: themeConfig.color,
                            ...(themeConfig.secondaryTextColor && {
                                '& .MuiTypography-colorTextSecondary': {
                                    color: themeConfig.secondaryTextColor,
                                },
                            }),
                        },
                    },
                },
                MuiAccordion: {
                    styleOverrides: {
                        root: {
                            background: themeConfig.background,
                            color: themeConfig.color,
                        },
                    },
                },
                MuiAlert: {
                    styleOverrides: {
                        root: {
                            background: themeConfig.background,
                            color: themeConfig.color,
                        },
                    },
                },
                MuiButton: {
                    styleOverrides: {
                        contained: {
                            backgroundColor: themeConfig.accentColor,
                            color: '#ffffff',
                            '&:hover': {
                                backgroundColor: themeConfig.accentColor,
                                opacity: 0.9,
                            },
                        },
                        outlined: {
                            borderColor: themeConfig.accentColor,
                            color: themeConfig.accentColor,
                            '&:hover': {
                                borderColor: themeConfig.accentColor,
                                backgroundColor: `${themeConfig.accentColor}20`,
                            },
                        },
                    },
                },
                MuiChip: {
                    styleOverrides: {
                        root: {
                            backgroundColor: themeConfig.accentColor,
                            color: '#ffffff',
                        },
                        outlined: {
                            borderColor: themeConfig.accentColor,
                            color: themeConfig.accentColor,
                            backgroundColor: 'transparent',
                        },
                    },
                },
            },
        });
    }, [equippedThemeId, baseTheme]);
}