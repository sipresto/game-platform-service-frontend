import { CardActions, Button, CircularProgress } from '@mui/material';
import { Check, Close } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router';

interface FriendRequestActionsProps {
    userId: string;
    keycloakId: string;
    isProcessing: boolean;
    onAccept: () => Promise<void>;
    onReject: () => Promise<void>;
}

export function FriendRequestActions({
                                         keycloakId,
                                         isProcessing,
                                         onAccept,
                                         onReject
                                     }: FriendRequestActionsProps) {
    return (
        <CardActions sx={{ mt: 'auto', gap: 1, p: 2 }}>
            <Button
                fullWidth
                variant="contained"
                color="success"
                startIcon={isProcessing ? <CircularProgress size={16} /> : <Check />}
                onClick={onAccept}
                disabled={isProcessing}
            >
                Accept
            </Button>
            <Button
                fullWidth
                variant="outlined"
                color="error"
                startIcon={isProcessing ? <CircularProgress size={16} /> : <Close />}
                onClick={onReject}
                disabled={isProcessing}
            >
                Reject
            </Button>
            <Button
                size="small"
                component={RouterLink}
                to={`/profile/${keycloakId}`}
                disabled={isProcessing}
            >
                View
            </Button>
        </CardActions>
    );
}