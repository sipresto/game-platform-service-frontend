import { MenuItem, ListItemIcon, ListItemText } from '@mui/material';

interface NotificationCardProps {
    notification: any;
    getNotificationIcon: (type: string) => JSX.Element;
    unreadCount: number;
    setUnreadCount?: (count: number) => void;
}

export function NotificationCard({
                                     notification: n,
                                     getNotificationIcon,
                                 }: NotificationCardProps) {
    return (
        <MenuItem
            key={n.notificationId}
            onMouseEnter={() => {
                if (!n.read) {
                    n.read = true;
                    markNotificationRead(n.notificationId);
                }
            }}
        >
            <ListItemIcon sx={{ minWidth: 36 }}>
                {getNotificationIcon(n.notificationType)}
            </ListItemIcon>

            <ListItemText
                primary={n.title}
                secondary={n.description}
            />
        </MenuItem>
    );
}
