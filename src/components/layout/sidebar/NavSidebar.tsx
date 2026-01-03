import {
    ChatBubble,
    Diversity3,
    EmojiEvents,
    Gamepad,
    Group,
    Person,
    Settings,
    Store,
    VerticalSplit
} from "@mui/icons-material";
import { Box, Drawer, List } from "@mui/material";
import { useContext } from "react";
import { useNavigate } from "react-router";
import SecurityContext from "../../../context/SecurityContext.ts";
import { NavItem } from "./NavItem.tsx";
import { MobileAuthAction } from "./MobileAuthAction.tsx";
import { useUserProfile } from "../../../hooks/useUserProfile.ts";

interface NavSidebarProps {
    drawerWidth: number;
    mobileOpen: boolean;
    onDrawerToggle: () => void;
}

export function NavSidebar({ drawerWidth, mobileOpen, onDrawerToggle }: NavSidebarProps) {
    const navigate = useNavigate();
    const { isAuthenticated } = useContext(SecurityContext);
    const { profile: userProfile } = useUserProfile();

    const userId = userProfile?.id || '';

    const publicMenuItems = [
        { text: 'Store', path: '/store', icon: <Store/> },
    ];

    const protectedMenuItems = [
        { text: 'Library', path: '/library', icon: <VerticalSplit/> },
        { text: 'Sessions', path: '/sessions', icon: <Gamepad/> },
        { text: 'Profile', path: `/profile/${userId}`, icon: <Person/> },
        { text: 'Friends', path: '/friends', icon: <Group/> },
        { text: 'Users', path: '/users', icon: <Diversity3/> },
        { text: 'Chats', path: '/chat', icon: <ChatBubble/> },
        { text: 'Perks', path: '/perks', icon: <EmojiEvents/> },
        { text: 'Settings', path: '/profile/edit', icon: <Settings/> },
    ];

    const menuItems = [
        ...publicMenuItems,
        ...(isAuthenticated() ? protectedMenuItems : [])
    ];

    const drawerContent = (
        <Box sx={{ overflow: 'auto', mt: '64px' }}>
            <List disablePadding>
                {menuItems.map((item) => (
                    <NavItem
                        key={item.text}
                        {...item}
                        onNavigate={(path) => {
                            navigate(path);
                            onDrawerToggle();
                        }}
                    />
                ))}

                <MobileAuthAction/>
            </List>
        </Box>
    );

    return (
        <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={onDrawerToggle}
                ModalProps={{ keepMounted: true }}
                sx={{
                    display: { xs: 'block', sm: 'none' },
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box',
                        width: drawerWidth,
                        bgcolor: 'background.paper'
                    },
                }}
            >
                {drawerContent}
            </Drawer>

            <Drawer
                variant="permanent"
                open
                sx={{
                    display: { xs: 'none', sm: 'block' },
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box',
                        width: drawerWidth,
                        bgcolor: 'background.paper',
                        borderRight: 'none',
                        height: '100vh'
                    },
                }}
            >
                {drawerContent}
            </Drawer>
        </Box>
    )
}