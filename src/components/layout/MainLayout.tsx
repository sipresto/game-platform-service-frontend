import { useState, useContext } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router';
import {
    Box, AppBar, Toolbar, Typography, Drawer, List, ListItem,
    ListItemButton, ListItemIcon, ListItemText, IconButton, Badge,
    CssBaseline, Button, Menu, MenuItem
} from '@mui/material';
import {
    Diversity3,
    Store,
    Person,
    ChatBubble,
    VerticalSplit,
    ArrowLeft,
    AccountCircle,
    Menu as MenuIcon,
    Logout,
    Login,
    Settings,
    Edit
} from '@mui/icons-material';

import SecurityContext from '../../context/SecurityContext';
import { useUserProfile } from '../../hooks/useUserProfile';

const DRAWER_WIDTH = 240;

export function MainLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const { loggedInUser, logout, isAuthenticated, login } = useContext(SecurityContext);
    const { profile: userProfile } = useUserProfile();

    const [mobileOpen, setMobileOpen] = useState(false);
    const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setUserMenuAnchor(event.currentTarget);
    };

    const handleUserMenuClose = () => {
        setUserMenuAnchor(null);
    };

    const handleLogout = () => {
        handleUserMenuClose();
        logout();
    };

    const handleLogin = () => {
        login();
    };

    const handleEditProfile = () => {
        handleUserMenuClose();
        navigate('/profile/edit');
    };

    const handleViewProfile = () => {
        handleUserMenuClose();
        const userId = userProfile?.id || userProfile?.id || loggedInUser?.profile?.userId;
        if (userId) {
            navigate(`/profile/${userId}`);
        }
    };

    const displayName = userProfile?.profile?.displayName ||
        userProfile?.profile?.displayName ||
        loggedInUser?.name ||
        'Gamer';

    const publicMenuItems = [
        { text: 'Store', path: '/store', icon: <Store /> },
    ];

    const userId = userProfile?.id || userProfile?.id || loggedInUser?.profile?.userId || '';

    const protectedMenuItems = [
        { text: 'Library', path: '/library', icon: <VerticalSplit /> },
        { text: 'Profile', path: `/profile/${userId}`, icon: <Person /> },
        { text: 'Friends', path: '/friends', icon: <Diversity3/> },
        { text: 'Settings', path: '/profile/edit', icon: <Settings /> },
    ];

    const menuItems = [
        ...publicMenuItems,
        ...(isAuthenticated() ? protectedMenuItems : [])
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

                <ListItem disablePadding>
                    <ListItemButton
                        onClick={isAuthenticated() ? handleLogout : handleLogin}
                        sx={{
                            py: 1.5,
                            mt: 2,
                            display: { sm: 'none' },
                            justifyContent: 'center',
                            bgcolor: isAuthenticated() ? 'error.main' : 'primary.main',
                            color: 'white',
                            '&:hover': {
                                bgcolor: isAuthenticated() ? 'error.dark' : 'primary.dark'
                            },
                        }}
                    >
                        <ListItemIcon sx={{ minWidth: 40, color: 'white' }}>
                            {isAuthenticated() ? <Logout /> : <Login />}
                        </ListItemIcon>
                        <ListItemText
                            primary={isAuthenticated() ? "Logout" : "Login"}
                        />
                    </ListItemButton>
                </ListItem>
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
                        {isAuthenticated() && (
                            <Typography variant="body2" sx={{ fontWeight: 500, display: { xs: 'none', sm: 'block' } }}>
                                Hi, {displayName}!
                            </Typography>
                        )}

                        {isAuthenticated() ? (
                            <>
                                <IconButton
                                    color="inherit"
                                    size="small"
                                    onClick={handleLogout}
                                    title="Logout"
                                    sx={{
                                        display: { xs: 'none', sm: 'inline-flex' },
                                        '&:hover': {
                                            backgroundColor: 'rgba(255,255,255,0.1)'
                                        }
                                    }}
                                >
                                    <Logout fontSize="small" />
                                </IconButton>

                                <IconButton
                                    color="inherit"
                                    size="small"
                                    onClick={handleUserMenuOpen}
                                    sx={{
                                        '&:hover': {
                                            backgroundColor: 'rgba(255,255,255,0.1)'
                                        }
                                    }}
                                >
                                    <AccountCircle fontSize="small" />
                                </IconButton>

                                <Menu
                                    anchorEl={userMenuAnchor}
                                    open={Boolean(userMenuAnchor)}
                                    onClose={handleUserMenuClose}
                                    onClick={handleUserMenuClose}
                                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                                >
                                    <MenuItem onClick={handleViewProfile}>
                                        <ListItemIcon>
                                            <Person fontSize="small" />
                                        </ListItemIcon>
                                        View Profile
                                    </MenuItem>
                                    <MenuItem onClick={handleEditProfile}>
                                        <ListItemIcon>
                                            <Edit fontSize="small" />
                                        </ListItemIcon>
                                        Edit Profile
                                    </MenuItem>
                                    <MenuItem onClick={handleLogout}>
                                        <ListItemIcon>
                                            <Logout fontSize="small" />
                                        </ListItemIcon>
                                        Logout
                                    </MenuItem>
                                </Menu>
                            </>
                        ) : (
                            <Button
                                color="inherit"
                                startIcon={<Login />}
                                onClick={handleLogin}
                                sx={{
                                    display: { xs: 'none', sm: 'flex' },
                                    '&:hover': {
                                        backgroundColor: 'rgba(255,255,255,0.1)'
                                    }
                                }}
                            >
                                Login
                            </Button>
                        )}

                        {isAuthenticated() && (
                            <IconButton color="inherit" size="small">
                                <Badge color="default" sx={{ '& .MuiBadge-badge': { bgcolor: 'white', color: 'black' } }}>
                                    <ChatBubble fontSize="small" />
                                </Badge>
                            </IconButton>
                        )}
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