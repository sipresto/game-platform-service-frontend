import { Login, Logout } from "@mui/icons-material";
import { ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { useContext } from "react";
import SecurityContext from "../../../context/SecurityContext.ts";

export function MobileAuthAction() {
    const { isAuthenticated, login, logout } = useContext(SecurityContext);

    return (
        <ListItem disablePadding>
            <ListItemButton
                onClick={isAuthenticated() ? logout : login}
                sx={{
                    py: 1.5,
                    display: { sm: 'none' },
                    justifyContent: 'center',
                    bgcolor: isAuthenticated() ? 'destructive.main' : 'primary.main',
                    color: 'destructive.contrastText',
                }}
            >
                <ListItemIcon sx={{ minWidth: 40, color: 'primary.contrastText' }}>
                    {isAuthenticated() ? <Logout/> : <Login/>}
                </ListItemIcon>
                <ListItemText primary={isAuthenticated() ? 'Logout' : 'Login'}/>
            </ListItemButton>
        </ListItem>
    );
}
