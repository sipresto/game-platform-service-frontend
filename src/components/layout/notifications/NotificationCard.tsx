import { ListItemIcon, ListItemText, MenuItem } from '@mui/material';
import { Autorenew, ChatBubble, EmojiEvents, Notifications, PersonAdd } from "@mui/icons-material";
import { useReadNotifications } from "../../../hooks/useNotifications.ts";
import type { Notification } from "../../../model/notification.ts";

interface NotificationCardProps {
    notification: Notification;
}

function getNotificationIcon(type: string) {
    switch (type) {
        case "FRIEND_REQUEST":
            return <PersonAdd fontSize="small" />;
        case "ACHIEVEMENT":
            return <EmojiEvents fontSize="small" />;
        case "YOUR_TURN":
            return <Autorenew fontSize="small" />;
        case "CHAT_MESSAGE":
            return <ChatBubble fontSize="small" />;
        default:
            return <Notifications fontSize="small" />;
    }
}

export function NotificationCard({ notification: n, }: NotificationCardProps) {
    const { readNotification } = useReadNotifications();

    return (
        <MenuItem
            key={n.notificationId}
            onMouseEnter={() => {
                if (!n.read) {
                    n.read = true;
                    readNotification(n.notificationId);
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
