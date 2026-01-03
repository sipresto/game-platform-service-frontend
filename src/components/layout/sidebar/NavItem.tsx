import { ArrowLeft } from "@mui/icons-material";
import { Box, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { type ReactNode } from "react";

interface NavItemProps {
    text: string;
    path: string;
    icon: ReactNode;
    onNavigate: (path: string) => void;
}

export function NavItem({ text, path, icon, onNavigate }: NavItemProps) {
    const isActive = location.pathname.startsWith(path);

    return (
        <ListItem disablePadding>
            <ListItemButton
                onClick={() => onNavigate(path)}
                sx={{
                    py: 1.5,
                    bgcolor: isActive ? 'primary.main' : 'transparent',
                    color: isActive ? 'primary.contrastText' : 'text.primary',
                    '&:hover': {
                        bgcolor: isActive ? 'primary.dark' : 'action.hover',
                    },
                    display: 'flex',
                    justifyContent: 'space-between'
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <ListItemIcon
                        sx={{
                            minWidth: 40,
                            color: isActive ? 'primary.contrastText' : 'text.primary',
                        }}
                    >
                        {icon}
                    </ListItemIcon>
                    <ListItemText primary={text}/>
                </Box>
                {isActive && <ArrowLeft sx={{ color: 'common.white' }}/>}
            </ListItemButton>
        </ListItem>
    );
}
