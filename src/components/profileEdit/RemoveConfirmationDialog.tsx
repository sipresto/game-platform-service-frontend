import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button,
} from '@mui/material';
import React from "react";

interface RemoveConfirmationDialogProps {
    open: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    isRemoving: boolean;
}

export const RemoveConfirmationDialog: React.FC<RemoveConfirmationDialogProps> = ({
                                                                                      open,
                                                                                      onConfirm,
                                                                                      onCancel,
                                                                                      isRemoving
                                                                                  }) => {
    return (
        <Dialog
            open={open}
            onClose={onCancel}
            aria-labelledby="remove-dialog-title"
            aria-describedby="remove-dialog-description"
        >
            <DialogTitle id="remove-dialog-title">
                Remove Profile Picture
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="remove-dialog-description">
                    Are you sure you want to remove your profile picture? This action cannot be undone.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel} color="primary">
                    Cancel
                </Button>
                <Button
                    onClick={onConfirm}
                    color="error"
                    variant="contained"
                    autoFocus
                    disabled={isRemoving}
                >
                    {isRemoving ? 'Removing...' : 'Remove'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};