import { Alert } from '@mui/material';

interface NotificationAlertProps {
    notification: {
        type: 'success' | 'error';
        message: string;
    } | null;
    onClose: () => void;
}

export const NotificationAlert = ({ notification, onClose }: NotificationAlertProps) => {
    if (!notification) return null;

    return (
        <Alert
            severity={notification.type}
            onClose={onClose}
            sx={{ mb: 3 }}
        >
            {notification.message}
        </Alert>
    );
};