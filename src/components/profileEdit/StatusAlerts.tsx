import { Alert } from '@mui/material';
import { Check, Error as ErrorIcon } from '@mui/icons-material';
import React from "react";

interface StatusAlertsProps {
    validationError: string | null;
    uploadError: Error | null;
    uploadStatus: 'idle' | 'success' | 'error';
    onClearValidationError: () => void;
    onClearUploadStatus: () => void;
}

export const StatusAlerts: React.FC<StatusAlertsProps> = ({
                                                              validationError,
                                                              uploadError,
                                                              uploadStatus,
                                                              onClearValidationError,
                                                              onClearUploadStatus
                                                          }) => {
    return (
        <>
            {validationError && (
                <Alert
                    severity="error"
                    icon={<ErrorIcon />}
                    onClose={onClearValidationError}
                >
                    {validationError}
                </Alert>
            )}

            {uploadError && (
                <Alert
                    severity="error"
                    icon={<ErrorIcon />}
                    onClose={onClearValidationError}
                >
                    {uploadError.message}
                </Alert>
            )}

            {uploadStatus === 'success' && (
                <Alert severity="success" icon={<Check />}>
                    Profile picture uploaded successfully!
                </Alert>
            )}

            {uploadStatus === 'error' && (
                <Alert
                    severity="error"
                    icon={<ErrorIcon />}
                    onClose={onClearUploadStatus}
                >
                    Upload failed. Please try again.
                </Alert>
            )}
        </>
    );
};