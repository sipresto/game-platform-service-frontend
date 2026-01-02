import { useState } from 'react';
import {
    Alert,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Snackbar
} from '@mui/material';
import { Block, PersonRemove } from '@mui/icons-material';
import { useBlockUser, useRemoveFriend, useUserProfile } from '../../hooks/useUserProfile.ts';
import type { PublicUserProfile } from '../../model/userProfile.ts';

interface ProfileActionButtonsProps {
    user: PublicUserProfile;
}

type ActionType = 'block' | 'unfriend' | null;

export function ProfileActionButtons({ user }: ProfileActionButtonsProps) {
    const [confirmDialog, setConfirmDialog] = useState<ActionType>(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

    const { profile: currentUser } = useUserProfile();
    const blockMutation = useBlockUser();
    const removeFriendMutation = useRemoveFriend();

    const isFriend = currentUser?.friends?.includes(user.id);

    const handleOpenDialog = (action: ActionType) => {
        setConfirmDialog(action);
    };

    const handleCloseDialog = () => {
        setConfirmDialog(null);
    };

    const handleConfirmAction = async () => {
        const action = confirmDialog;
        handleCloseDialog();

        try {
            if (action === 'block') {
                await blockMutation.mutateAsync(user.id);
                setSnackbar({ open: true, message: 'User blocked successfully', severity: 'success' });
            } else if (action === 'unfriend') {
                await removeFriendMutation.mutateAsync(user.id);
                setSnackbar({ open: true, message: 'Friend removed successfully', severity: 'success' });
            }
        } catch (error) {
            setSnackbar({
                open: true,
                message: `Failed to ${action} user`,
                severity: 'error'
            });
            console.log(error);
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const getDialogContent = () => {
        const displayName = user.profile?.displayName || user.username;

        switch (confirmDialog) {
            case 'block':
                return {
                    title: 'Block User',
                    content: `Are you sure you want to block ${displayName}? They will no longer be able to see your profile or interact with you. If you are friends, they will be removed from your friends list.`
                };
            case 'unfriend':
                return {
                    title: 'Remove Friend',
                    content: `Are you sure you want to remove ${displayName} from your friends list? You can send them a friend request again later.`
                };
            default:
                return { title: '', content: '' };
        }
    };

    const dialogContent = getDialogContent();

    return (
        <>
            <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column', width: '100%' }}>
                {isFriend && (
                    <Button
                        variant="outlined"
                        sx={{
                            color: 'destructive.main',
                            borderColor: 'destructive.main',
                            '&:hover': {
                                borderColor: 'destructive.dark'
                            }
                        }}
                        startIcon={<PersonRemove/>}
                        onClick={() => handleOpenDialog('unfriend')}
                        fullWidth
                        disabled={removeFriendMutation.isPending}
                    >
                        Remove Friend
                    </Button>
                )}

                <Button
                    variant="outlined"
                    sx={{
                        color: 'destructive.main',
                        borderColor: 'destructive.main',
                        '&:hover': {
                            borderColor: 'destructive.dark'
                        }
                    }}
                    startIcon={<Block/>}
                    onClick={() => handleOpenDialog('block')}
                    fullWidth
                    disabled={blockMutation.isPending}
                >
                    Block User
                </Button>
            </Box>

            <Dialog
                open={confirmDialog !== null}
                onClose={handleCloseDialog}
            >
                <DialogTitle>{dialogContent.title}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {dialogContent.content}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirmAction}
                        color="error"
                        variant="contained"
                        autoFocus
                    >
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
}