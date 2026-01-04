import React, { useState } from 'react';
import {
    Container,
    Paper,
    Tabs,
    Tab,
    Badge,
    Snackbar,
    Box,
    Typography,
    Alert,
    AlertTitle
} from '@mui/material';
import { Group, PersonAdd, Block } from '@mui/icons-material';
import {
    useAllUsers,
    useUserProfile,
    useBlockedUsers,
    useUnblockUser,
    useRemoveFriend
} from '../hooks/useUserProfile';
import { FriendsList } from '../components/friends/FriendsList';
import { FriendRequestsList } from '../components/friends/FriendRequestsList';
import { BlockedUsersList } from '../components/friends/blocked/BlockedUsersList';
import { TabPanel } from '../components/friends/TabPanel';
import { useFriendsSnackbar } from '../hooks/useFriendsSnackbar';

export function FriendsPage() {
    const [currentTab, setCurrentTab] = useState(0);
    const { snackbar, showSnackbar, closeSnackbar } = useFriendsSnackbar();

    const {
        friends,
        isError: friendsError,
        error: friendsErrorMsg
    } = useAllUsers();

    const {
        profile,
        error: profileError
    } = useUserProfile();

    const {
        data: blockedUsers = [],
        error: blockedError
    } = useBlockedUsers();

    const unblockMutation = useUnblockUser();
    const removeFriendMutation = useRemoveFriend();

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setCurrentTab(newValue);
    };

    const handleUnblock = async (userId: string) => {
        try {
            await unblockMutation.mutateAsync(userId);
            showSnackbar('User unblocked successfully', 'success');
        } catch {
            showSnackbar('Failed to unblock user', 'error');
        }
    };

    const handleRemoveFriend = async (userId: string) => {
        try {
            await removeFriendMutation.mutateAsync(userId);
            showSnackbar('Friend removed successfully', 'success');
        } catch {
            showSnackbar('Failed to remove friend', 'error');
        }
    };

    const errorMessage = friendsErrorMsg?.message || profileError?.message || blockedError?.message;
    if (friendsError || profileError || blockedError) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Alert severity="error">
                    <AlertTitle>Error Loading Data</AlertTitle>
                    {errorMessage || 'Failed to load data. Please try again later.'}
                </Alert>
            </Container>
        );
    }

    const friendRequests = profile?.incomingFriendRequests || [];
    const pendingCount = friendRequests.length;

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
                    Friends
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Manage your friends, friend requests, and blocked users
                </Typography>
            </Box>

            <Paper sx={{ mb: 3 }}>
                <Tabs
                    value={currentTab}
                    onChange={handleTabChange}
                    aria-label="friends tabs"
                    variant="fullWidth"
                    sx={{
                        '& .MuiTab-root': {
                            color: 'custom.tabs.inactive',
                            '&:hover': {
                                color: 'custom.tabs.hover',
                            },
                        },
                        '& .Mui-selected': {
                            color: 'custom.tabs.active'
                        },
                    }}
                >
                    <Tab
                        icon={<Group />}
                        iconPosition="start"
                        label={`Friends (${friends.length})`}
                        id="friends-tab-0"
                        aria-controls="friends-tabpanel-0"
                    />
                    <Tab
                        icon={
                            <Badge badgeContent={pendingCount} color="error">
                                <PersonAdd />
                            </Badge>
                        }
                        iconPosition="start"
                        label="Friend Requests"
                        id="friends-tab-1"
                        aria-controls="friends-tabpanel-1"
                    />
                    <Tab
                        icon={<Block />}
                        iconPosition="start"
                        label={`Blocked (${blockedUsers.length})`}
                        id="friends-tab-2"
                        aria-controls="friends-tabpanel-2"
                    />
                </Tabs>
            </Paper>

            <TabPanel value={currentTab} index={0}>
                <FriendsList
                    friends={friends}
                    onRemoveFriend={handleRemoveFriend}
                />
            </TabPanel>

            <TabPanel value={currentTab} index={1}>
                <FriendRequestsList
                    friendRequests={friendRequests}
                />
            </TabPanel>

            <TabPanel value={currentTab} index={2}>
                <BlockedUsersList
                    blockedUsers={blockedUsers}
                    onUnblock={handleUnblock}
                />
            </TabPanel>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={closeSnackbar}
                message={snackbar.message}
            />
        </Container>
    );
}