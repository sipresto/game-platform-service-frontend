import {
    Alert,
    Box,
    CircularProgress,
    FormControlLabel,
    Paper,
    Switch,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from '@mui/material';
import {
    notificationTypeLabels,
    notificationChannelLabels, NOTIFICATION_TYPES, NOTIFICATION_CHANNELS
} from '../../model/notificationPreferences';
import {useNotificationPreferences} from "../../hooks/useNotifications.ts";

export function NotificationPreferencesSection() {
    const {
        preferences,
        isLoading,
        error,
        isUpdating,
        updateError,
        togglePreference
    } = useNotificationPreferences();

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" p={4}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Alert severity="error">
                Error loading notification preferences: {error.message}
            </Alert>
        );
    }

    if (!preferences) {
        return null;
    }

    const notificationTypes = Object.values(NOTIFICATION_TYPES);
    const channels = Object.values(NOTIFICATION_CHANNELS);

    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                Notifications
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Choose how you want to receive notifications for different activities.
            </Typography>

            {updateError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    Failed to update preference: {updateError.message}
                </Alert>
            )}

            <TableContainer component={Paper} variant="outlined">
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <Typography variant="subtitle2" fontWeight="bold">
                                    Notification Type
                                </Typography>
                            </TableCell>
                            {channels.map(channel => (
                                <TableCell key={channel} align="center">
                                    <Typography variant="subtitle2" fontWeight="bold">
                                        {notificationChannelLabels[channel]}
                                    </Typography>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {notificationTypes.map(notificationType => (
                            <TableRow key={notificationType}>
                                <TableCell>
                                    <Typography variant="body2">
                                        {notificationTypeLabels[notificationType]}
                                    </Typography>
                                </TableCell>
                                {channels.map(channel => {
                                    const isEnabled = preferences[notificationType]?.[channel] ?? false;
                                    return (
                                        <TableCell key={channel} align="center">
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={isEnabled}
                                                        onChange={(e) =>
                                                            togglePreference(
                                                                notificationType,
                                                                channel,
                                                                e.target.checked
                                                            )
                                                        }
                                                        disabled={isUpdating}
                                                        size="small"
                                                    />
                                                }
                                                label=""
                                                sx={{ m: 0 }}
                                            />
                                        </TableCell>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {isUpdating && (
                <Alert severity="info" sx={{ mt: 2 }}>
                    Updating preferences...
                </Alert>
            )}
        </Box>
    );
}