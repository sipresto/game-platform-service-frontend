import { Menu, MenuItem } from '@mui/material';
import { NotificationCard } from './NotificationCard';
import type { Notification } from "../../../model/notification.ts";

interface NotificationListProps {
    anchorEl: HTMLElement | null;
    onClose: () => void;
    notifications: Notification[];
}

export function NotificationList({
                                     anchorEl,
                                     onClose,
                                     notifications,
                                 }: NotificationListProps) {
    return (
        <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={onClose}
            onClick={onClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            slotProps={{
                paper: {
                    sx: {
                        maxHeight: 350,
                        overflowY: 'auto',
                    }
                }
            }}
        >
            {notifications.length === 0 && (
                <MenuItem disabled>No notifications</MenuItem>
            )}

            {notifications
                .sort(
                    (a, b) =>
                        new Date(b.createdAt).getTime() -
                        new Date(a.createdAt).getTime()
                )
                .map((n) => (
                    <NotificationCard
                        key={n.notificationId}
                        notification={n}
                    />
                ))}
        </Menu>
    );
}
