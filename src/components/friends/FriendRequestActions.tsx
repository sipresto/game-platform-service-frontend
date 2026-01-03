import { Button, CardActions, CircularProgress } from '@mui/material';
import { Check, Close } from '@mui/icons-material';

interface FriendRequestActionsProps {
    isProcessing: boolean;
    onAccept: () => void;
    onReject: () => void;
}

export function FriendRequestActions({ isProcessing, onAccept, onReject }: FriendRequestActionsProps) {
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
                startIcon={isProcessing ? <CircularProgress size={16}/> : <Check/>}
                onClick={(e) => {
                    e.stopPropagation();
                    onAccept();
                }}
                disabled={isProcessing}
            >
                Accept
            </Button>
            <Button
                fullWidth
                variant="outlined"
                startIcon={isProcessing ? <CircularProgress size={16}/> : <Close/>}
                onClick={(e) => {
                    e.stopPropagation();
                    onReject();
                }}
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
        </CardActions>
    );
}