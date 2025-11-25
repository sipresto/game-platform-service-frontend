import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router';
import {
    Box, AppBar, Toolbar, Typography, Drawer, List, ListItem,
    ListItemButton, ListItemIcon, ListItemText, IconButton, Badge,
    CssBaseline, CircularProgress
} from '@mui/material';
import StoreIcon from '@mui/icons-material/Store';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import PersonIcon from '@mui/icons-material/Person';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import TuneIcon from '@mui/icons-material/Tune';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';

import { useUserProfile } from '../../hooks/useUserProfile';
// import { auth } from '../../context/SecurityContext'; // later inloggne

const DRAWER_WIDTH = 240;

export function MainLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    // const { isAuthenticated } = useAuth();
    const { profile, isLoading } = useUserProfile();

    const [mobileOpen, setMobileOpen] = useState(false);

    // if (!isAuthenticated) {
    //     return <Navigate to="/publicpage" replace />;
    // }

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const menuItems = [
        { text: 'Store', path: '/store', icon: <StoreIcon /> },
        { text: 'Library', path: '/library', icon: <LibraryBooksIcon /> },
        { text: 'Profile', path: '/profile', icon: <PersonIcon /> },
        { text: 'Friends', path: '/friends', icon: <ChatBubbleIcon /> },
        { text: 'Settings', path: '/settings', icon: <TuneIcon /> },
    ];

    const drawerContent = (
        <Box sx={{ overflow: 'auto', mt: '64px' }}>
            <List disablePadding>
                {menuItems.map((item) => {
                    const isActive = location.pathname.startsWith(item.path);
                    return (
                        <ListItem key={item.text} disablePadding>
                            <ListItemButton
                                onClick={() => {
                                    navigate(item.path);
                                    setMobileOpen(false);
                                }}
                                sx={{
                                    py: 1.5,
                                    bgcolor: isActive ? '#333333' : 'transparent',
                                    color: isActive ? 'white' : 'text.primary',
                                    '&:hover': { bgcolor: isActive ? '#333333' : 'rgba(0,0,0,0.05)' },
                                    display: 'flex', justifyContent: 'space-between'
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <ListItemIcon sx={{ minWidth: 40, color: isActive ? 'white' : 'text.primary' }}>
                                        {item.icon}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={item.text}
                                    />
                                </Box>
                                {isActive && <ArrowLeftIcon sx={{ color: 'white', fontSize: 30, mr: -1 }} />}
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />

            <AppBar
                position="fixed"
                sx={{
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                    bgcolor: '#333333',
                    height: '64px',
                    justifyContent: 'center'
                }}
            >
                <Toolbar sx={{ justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ mr: 2, display: { sm: 'none' } }}
                        >
                            <MenuIcon />
                        </IconButton>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <StoreIcon fontSize="small" />
                            <Typography variant="h6" fontWeight="bold">VibeGames</Typography>
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="body2" sx={{ fontWeight: 500, display: { xs: 'none', sm: 'block' } }}>
                            Hi, {profile?.username || 'Gamer'}!
                        </Typography>
                        <IconButton color="inherit" size="small"><AccountCircleIcon /></IconButton>
                        <IconButton color="inherit" size="small">
                            <Badge color="default" sx={{ '& .MuiBadge-badge': { bgcolor: 'white', color: 'black' } }}>
                                <ChatBubbleIcon fontSize="small" />
                            </Badge>
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>

            <Box component="nav" sx={{ width: { sm: DRAWER_WIDTH }, flexShrink: { sm: 0 } }}>
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH, bgcolor: '#E0E0E0' },
                    }}
                >
                    {drawerContent}
                </Drawer>

                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: DRAWER_WIDTH,
                            bgcolor: '#E0E0E0',
                            borderRight: 'none',
                            height: '100vh'
                        },
                    }}
                    open
                >
                    {drawerContent}
                </Drawer>
            </Box>

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    mt: '64px',
                    bgcolor: '#FFFFFF',
                    minHeight: '100vh',
                    width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` }
                }}
            >
                <Outlet />
            </Box>
        </Box>
    );
}