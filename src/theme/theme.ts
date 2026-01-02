import { alpha, createTheme } from "@mui/material"
import { brand, gray, green, red, orange } from "./colors"

export const theme = createTheme({
    cssVariables: {
        colorSchemeSelector: "data-mui-color-scheme",
    },
    colorSchemes: {
        dark: {
            palette: {
                primary: {
                    light: brand[300],
                    main: brand[500],
                    dark: brand[700],
                    contrastText: brand[50],
                },
                success: {
                    light: green[300],
                    main: green[400],
                    dark: green[700],
                },
                error: {
                    light: red[300],
                    main: red[400],
                    dark: red[700],
                },
                warning: {
                    light: orange[300],
                    main: orange[400],
                    dark: orange[700],
                },
                divider: alpha(gray[600], 0.5),
                background: {
                    default: gray[800],
                    paper: gray[750],
                },
                text: {
                    primary: gray[50],
                    secondary: gray[300],
                },
            },
        },
        light: {
            palette: {
                primary: {
                    light: brand[200],
                    main: brand[500],
                    dark: brand[700],
                    contrastText: brand[50],
                },
                success: {
                    light: green[300],
                    main: green[500],
                    dark: green[700],
                },
                error: {
                    light: red[300],
                    main: red[500],
                    dark: red[700],
                },
                warning: {
                    light: orange[300],
                    main: orange[500],
                    dark: orange[700],
                },
                divider: alpha(gray[300], 0.4),
                background: {
                    default: gray[100],
                    paper: gray[200],
                },
                text: {
                    primary: gray[900],
                    secondary: gray[600],
                },
            },
        },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    },
    custom: {
        logout: {
            main: red[500],
            contrastText: gray[50],
        },
        notification: {
            badge: red[500],
            contrastText: gray[50],
        },
    },
})
