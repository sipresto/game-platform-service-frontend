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
    }
    interface PaletteOptions {
        destructive?: PaletteOptions['primary'];
    }
}
