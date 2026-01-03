import { useContext, useState } from 'react';
import { Avatar, Badge, Box, Button, IconButton, ListItemIcon, Menu, MenuItem, Typography } from '@mui/material';
import { Edit, Login, Logout, Notifications, Person } from '@mui/icons-material';
import { useNavigate } from "react-router";
import SecurityContext from "../../../context/SecurityContext.ts";
import { useUserProfile } from "../../../hooks/useUserProfile.ts";
import { useNotifications } from "../../../hooks/useNotifications.ts";
import { useProfileImageLoader } from "../../../hooks/useProfileImageLoader.ts";
import { NotificationList } from "../notifications/NotificationList.tsx";
import { useTheme } from "@mui/material/styles";
import { ThemeSwitcher } from "./ThemeSwitcher.tsx";

export function TopBarRight() {
    const navigate = useNavigate();
    const theme = useTheme();
    const { isAuthenticated, loggedInUser, login, logout } = useContext(SecurityContext);

    const { profile: userProfile } = useUserProfile();
    const imageUrl = useProfileImageLoader(userProfile?.id || '').profileImageUrl;

    const { notifications = [] } = useNotifications();
    const unreadCount = notifications.filter(n => !n.read).length;

    const [notificationAnchor, setNotificationAnchor] = useState<HTMLElement | null>(null);
    const [userMenuAnchor, setUserMenuAnchor] = useState<HTMLElement | null>(null);

    const displayName =
        userProfile?.profile?.displayName ||
        loggedInUser?.name ||
        'Gamer';

    const handleViewProfile = () => {
        const userId = userProfile?.id;
        if (userId) {
            navigate(`/profile/${userId}`);
        }
    };

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {isAuthenticated() && (
                <Typography
                    variant="body2"
                    sx={{ fontWeight: 500, display: { xs: 'none', sm: 'block' } }}
                >
                    Hi, {displayName}!
                </Typography>
            )}

            {isAuthenticated() ? (
                <>
                    <IconButton
                        color="inherit"
                        size="small"
                        onClick={(e) => setNotificationAnchor(e.currentTarget)}
                        sx={{ '&:hover': { bgcolor: 'action.hover' } }}
                    >
                        <Badge
                            badgeContent={unreadCount}
                            sx={{
                                '& .MuiBadge-badge': {
                                    bgcolor: theme.custom.notification.badge,
                                    color: theme.custom.notification.contrastText,
                                },
                            }}
                        >
                            <Notifications fontSize="small"/>
                        </Badge>
                    </IconButton>

                    <NotificationList
                        anchorEl={notificationAnchor}
                        onClose={() => setNotificationAnchor(null)}
                        notifications={notifications}
                    />

                    <ThemeSwitcher/>

                    <IconButton
                        color="inherit"
                        size="small"
                        onClick={logout}
                        title="Logout"
                        sx={{
                            display: { xs: 'none', sm: 'inline-flex' }
                        }}
                    >
                        <Logout fontSize="small"/>
                    </IconButton>

                    <IconButton
                        color="inherit"
                        size="small"
                        onClick={(e) => setUserMenuAnchor(e.currentTarget)}
                        title="Profile"
                    >
                        <Avatar
                            src={imageUrl || undefined}
                            sx={{
                                width: 32,
                                height: 32,
                                fontSize: 14,
                                bgcolor: 'primary.dark',
                            }}
                        >
                            {displayName.charAt(0).toUpperCase()}
                        </Avatar>
                    </IconButton>

                    <Menu
                        anchorEl={userMenuAnchor}
                        open={Boolean(userMenuAnchor)}
                        onClose={() => setUserMenuAnchor(null)}
                    >
                        <MenuItem onClick={handleViewProfile}>
                            <ListItemIcon>
                                <Person fontSize="small"/>
                            </ListItemIcon>
                            View Profile
                        </MenuItem>
                        <MenuItem onClick={() => navigate('/profile/edit')}>
                            <ListItemIcon>
                                <Edit fontSize="small"/>
                            </ListItemIcon>
                            Edit Profile
                        </MenuItem>
                    </Menu>
                </>
            ) : (
                <Button
                    color="inherit"
                    startIcon={<Login/>}
                    onClick={login}
                    sx={{ display: { xs: 'none', sm: 'flex' } }}
                >
                    Login
                </Button>
            )}
        </Box>
    );
}
