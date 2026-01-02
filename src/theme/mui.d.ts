import "@mui/material/styles";

declare module '@mui/material/styles' {
    interface Theme {
        custom: {
            logout: {
                main: string;
                contrastText: string;
            };
            notification: {
                badge: string;
                contrastText: string;
            };
        };
    }
    interface ThemeOptions {
        custom?: {
            logout?: {
                main?: string;
                contrastText?: string;
            };
            notification?: {
                badge?: string;
                contrastText?: string;
            };
        };
    }
}
