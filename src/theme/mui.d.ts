import "@mui/material/styles";

declare module '@mui/material/styles' {
    interface Theme {
        custom: {
            notification: {
                badge: string;
                contrastText: string;
            };
        };
    }
    interface ThemeOptions {
        custom?: {
            notification?: {
                badge?: string;
                contrastText?: string;
            };
        };
    }

    interface TypeBackground {
        elevated?: string;
    }

    interface Palette {
        destructive: Palette['primary'];
        custom: {
            tabs: {
                active: string
                inactive: string
                hover: string
            }
        };
    }
    interface PaletteOptions {
        destructive?: PaletteOptions['primary'];
        custom?: {
            tabs?: {
                active?: string;
                inactive?: string;
                hover?: string;
            };
        };
    }
}
