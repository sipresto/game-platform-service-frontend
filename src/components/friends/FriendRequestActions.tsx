import { CardActions, Button, CircularProgress } from '@mui/material';
import { Check, Close } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router';

interface FriendRequestActionsProps {
    userId: string;
    isProcessing: boolean;
    onAccept: () => Promise<void>;
    onReject: () => Promise<void>;
}

export function FriendRequestActions({
                                         userId,
                                         isProcessing,
                                         onAccept,
                                         onReject
                                     }: FriendRequestActionsProps) {
    return (
        <CardActions
            sx={{
                p: 1.5,
                pt: 0.5,
                gap: 1,
            }}
        >
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
                startIcon={isProcessing ? <CircularProgress size={16} /> : <Close />}
                onClick={onReject}
                disabled={isProcessing}
                sx={{
                    color: 'destructive.main',
                    borderColor: 'destructive.main',
                    '&:hover': {
                        borderColor: 'destructive.dark'
                    }
                }}
            >
                Reject
            </Button>
            <Button
                size="small"
                component={RouterLink}
                to={`/profile/${userId}`}
                disabled={isProcessing}
                sx={{ color: 'text.secondary' }}
            >
                View
            </Button>
        </CardActions>
    );
}