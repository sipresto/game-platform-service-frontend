import { useState, useContext } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router';
import {
    Box, AppBar, Toolbar, Typography, Drawer, List, ListItem,
    ListItemButton, ListItemIcon, ListItemText, IconButton, Badge,
    CssBaseline
} from '@mui/material';
import {
    Diversity3,
    Store,
    Person,
    ChatBubble,
    VerticalSplit,
    Tune,
    ArrowLeft,
    AccountCircle,
    Menu as MenuIcon,
} from '@mui/icons-material';

import SecurityContext from '../../context/SecurityContext';

const DRAWER_WIDTH = 240;

export function MainLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const { loggedInUser } = useContext(SecurityContext);

    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const menuItems = [
        { text: 'Store', path: '/store', icon: <Store /> },
        { text: 'Library', path: '/library', icon: <VerticalSplit /> },
        { text: 'Profile', path: '/profile', icon: <Person /> },
        { text: 'Friends', path: '/friends', icon: <Diversity3/> },
        { text: 'Settings', path: '/settings', icon: <Tune /> },
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
                                {isActive && <ArrowLeft sx={{ color: 'white', fontSize: 30, mr: -1 }} />}
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
                            <Store fontSize="small" />
                            <Typography variant="h6" fontWeight="bold">VibeGames</Typography>
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="body2" sx={{ fontWeight: 500, display: { xs: 'none', sm: 'block' } }}>
                            Hi, {loggedInUser?.name || 'Gamer'}!
                        </Typography>
                        <IconButton color="inherit" size="small"><AccountCircle /></IconButton>
                        <IconButton color="inherit" size="small">
                            <Badge color="default" sx={{ '& .MuiBadge-badge': { bgcolor: 'white', color: 'black' } }}>
                                <ChatBubble fontSize="small" />
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