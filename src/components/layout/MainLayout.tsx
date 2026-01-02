import { useState } from 'react';
import { Outlet, useLocation } from 'react-router';
import { Box } from '@mui/material';
import { NavSidebar } from "./sidebar/NavSidebar.tsx";
import { TopBar } from "./topbar/TopBar.tsx";

const DRAWER_WIDTH = 240;

export function MainLayout() {
    const location = useLocation();
    const isProfilePage = location.pathname.startsWith('/profile');
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    return (
        <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
            <TopBar onDrawerToggle={handleDrawerToggle}/>

            <NavSidebar drawerWidth={DRAWER_WIDTH} mobileOpen={mobileOpen} onDrawerToggle={handleDrawerToggle}/>

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: isProfilePage ? 0 : 3,
                    mt: '64px',
                    height: 'calc(100vh - 64px)',
                    overflow: 'auto',
                    width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` }
                }}
            >
                <Outlet/>
            </Box>
        </Box>
    );
}