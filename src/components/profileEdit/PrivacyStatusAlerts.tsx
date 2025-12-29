import { Alert } from '@mui/material';
import { CheckCircle, Error as ErrorIcon, Info } from '@mui/icons-material';

interface PrivacyStatusAlertsProps {
    isUpdating: boolean;
    globalError?: Error | null;
    fieldError?: Error | null;
    globalSuccess?: boolean;
    fieldSuccess?: boolean;
    onClearErrors?: () => void;
    onClearSuccess?: () => void;
}

export function PrivacyStatusAlerts({
                                        isUpdating,
                                        globalError,
                                        fieldError,
                                        globalSuccess,
                                        fieldSuccess,
                                        onClearErrors,
                                        onClearSuccess
                                    }: PrivacyStatusAlertsProps) {
    const showSuccess = (globalSuccess || fieldSuccess) && !isUpdating;

    return (
        <>
            {isUpdating && (
                <Alert
                    severity="info"
                    icon={<Info />}
                    sx={{ mt: 3 }}
                >
                    Saving changes...
                </Alert>
            )}

            {globalError && (
                <Alert
                    severity="error"
                    icon={<ErrorIcon />}
                    onClose={onClearErrors}
                    sx={{ mt: 3 }}
                >
                    Failed to update visibility: {globalError.message}
                </Alert>
            )}

            {fieldError && (
                <Alert
                    severity="error"
                    icon={<ErrorIcon />}
                    onClose={onClearErrors}
                    sx={{ mt: 3 }}
                >
                    Failed to update field visibility: {fieldError.message}
                </Alert>
            )}

            {showSuccess && (
                <Alert
                    severity="success"
                    icon={<CheckCircle />}
                    onClose={onClearSuccess}
                    sx={{ mt: 3 }}
                >
                    Privacy settings updated successfully!
                </Alert>
            )}
        </>
    );
}