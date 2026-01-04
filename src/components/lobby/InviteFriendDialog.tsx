import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Typography,
    CircularProgress
} from '@mui/material';
import type {PublicUserProfile} from "../../model/userProfile.ts";

interface InviteFriendDialogProps {
    open: boolean;
    onClose: () => void;
    onInviteUser: (id: string) => void;
    friends: PublicUserProfile[];
    isInviting?: boolean;
}

export const InviteFriendDialog = ({
                                    open,
                                    onClose,
                                    onInviteUser,
                                    friends,
                                    isInviting
                                }: InviteFriendDialogProps) => {

    const handleFriendClick = (friendId: string) => {
        onInviteUser(friendId);
    };

    return (
        <Dialog
            open={open}
            onClose={isInviting ? undefined : onClose}
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle>Choose a friend to invite</DialogTitle>
            <DialogContent>

                {isInviting && (
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mt: 3,
                        p: 2,
                        bgcolor: 'info.light',
                        borderRadius: 1
                    }}>
                        <CircularProgress size={20} sx={{ mr: 2 }} />
                        <Box>
                            <Typography variant="body2" color="info.contrastText">
                                Your friend is being invited...
                            </Typography>
                        </Box>
                    </Box>
                )}

                {!isInviting && (
                    <Box sx={{ mt: 2 }}>
                        {friends.length === 0 ? (
                            <Typography variant="body2">You don't have any friends yet.</Typography>
                        ) : (
                            friends.map((friend) => (
                                <Button
                                    key={friend.id}
                                    onClick={() => handleFriendClick(friend.id)}
                                    variant="outlined"
                                    sx={{ width: '100%', textAlign: 'left', mb: 1 }}
                                >
                                    {friend.profile.displayName}
                                </Button>
                            ))
                        )}
                    </Box>
                )}
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={onClose} disabled={isInviting}>
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
};