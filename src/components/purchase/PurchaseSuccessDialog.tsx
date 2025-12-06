import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@mui/material';

interface PurchaseSuccessDialogProps {
    open: boolean;
    gameName: string;
    onClose: () => void;
}

export function PurchaseSuccessDialog({
                                          open,
                                          gameName,
                                          onClose,
                                      }: PurchaseSuccessDialogProps) {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Purchase Successful!</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    You've successfully purchased {gameName}. The game has been added to your library.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} variant="contained" color="primary">
                    Go to Library
                </Button>
            </DialogActions>
        </Dialog>
    );
}