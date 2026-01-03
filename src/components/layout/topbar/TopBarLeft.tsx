import { Box, IconButton, Typography } from "@mui/material";
import { Menu, Store } from "@mui/icons-material";

interface TopBarLeftProps {
    onDrawerToggle: () => void;
}

export function TopBarLeft({ onDrawerToggle }: TopBarLeftProps) {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
                color="inherit"
                edge="start"
                onClick={onDrawerToggle}
                sx={{ mr: 2, display: { sm: 'none' } }}
            >
                <Menu/>
            </IconButton>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Store fontSize="small"/>
                <Typography variant="h6" fontWeight="bold">
                    VibeGames
                </Typography>
            </Box>
        </Box>
    );
}
