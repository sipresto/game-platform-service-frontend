import { Alert, Box, Typography, Tooltip, IconButton } from '@mui/material';
import { Refresh } from '@mui/icons-material';

interface LibraryErrorAlertProps {
    errorMessage: string;
    onRetry: () => void;
    isRefreshing: boolean;
}

export function LibraryErrorAlert({
                                      errorMessage,
                                      onRetry,
                                      isRefreshing
                                  }: LibraryErrorAlertProps) {
    return (
        <Alert severity="warning" sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Typography variant="body2">
                    Failed to load game library: {errorMessage}
                </Typography>
                <Tooltip title="Retry loading library">
                    <IconButton
                        size="small"
                        onClick={onRetry}
                        disabled={isRefreshing}
                    >
                        <Refresh sx={{ fontSize: 16 }} />
                    </IconButton>
                </Tooltip>
            </Box>
        </Alert>
    );
}