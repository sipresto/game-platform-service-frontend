import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
    Container,
    Typography,
    Box,
    Tabs,
    Tab,
    Paper,
    CircularProgress,
    Alert,
    AlertTitle,
    Badge,
    Snackbar
} from '@mui/material';
import { Group, PersonAdd, Block } from '@mui/icons-material';
import { useAllUsers, useUserProfile, useBlockedUsers, useUnblockUser, useRemoveFriend } from '../hooks/useUserProfile';
import { FriendsList } from '../components/friends/FriendsList';
import { FriendRequestsList } from '../components/friends/FriendRequestsList';
import { BlockedUsersList } from '../components/friends/blocked/BlockedUsersList';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`friends-tabpanel-${index}`}
            aria-labelledby={`friends-tab-${index}`}
        >
            {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
        </div>
    );
}

export function FriendsPage() {
    const queryClient = useQueryClient();
    const [currentTab, setCurrentTab] = useState(0);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

    // Add separate refreshing states for all tabs
    const [isFriendsRefreshing, setIsFriendsRefreshing] = useState(false);
    const [isRequestsRefreshing, setIsRequestsRefreshing] = useState(false);
    const [isBlockedRefreshing, setIsBlockedRefreshing] = useState(false);

    // Use the hooks
    const {
        friends,
        isLoading: friendsLoading,
        isError: friendsError,
        error: friendsErrorMsg
    } = useAllUsers();

    const {
        profile,
        isLoading: profileLoading,
        error: profileError,
        refetch: refetchProfile
    } = useUserProfile();

    const {
        data: blockedUsers = [],
        isLoading: blockedLoading,
        error: blockedError,
        refetch: refetchBlockedUsers
    } = useBlockedUsers();

    const unblockMutation = useUnblockUser();
    const removeFriendMutation = useRemoveFriend();

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setCurrentTab(newValue);
    };

    const handleUnblock = async (userId: string) => {
        try {
            await unblockMutation.mutateAsync(userId);
            setSnackbar({ open: true, message: 'User unblocked successfully', severity: 'success' });
        } catch (error) {
            setSnackbar({ open: true, message: 'Failed to unblock user', severity: 'error' });
            console.log(error);
        }
    };

    const handleRemoveFriend = async (userId: string) => {
        try {
            await removeFriendMutation.mutateAsync(userId);
            setSnackbar({ open: true, message: 'Friend removed successfully', severity: 'success' });
        } catch (error) {
            setSnackbar({ open: true, message: 'Failed to remove friend', severity: 'error' });
            console.log(error);
        }
    };

    const handleRefreshFriends = async () => {
        try {
            setIsFriendsRefreshing(true);
            // Invalidate and refetch all queries related to friends
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ['friends'] }),
                queryClient.invalidateQueries({ queryKey: ['publicUsers'] }),
                refetchProfile() // Also refresh profile for consistency
            ]);
            setSnackbar({
                open: true,
                message: 'Friends list refreshed successfully',
                severity: 'success'
            });
        } catch (error) {
            console.error('Failed to refresh friends:', error);
            setSnackbar({
                open: true,
                message: 'Failed to refresh friends list',
                severity: 'error'
            });
        } finally {
            setIsFriendsRefreshing(false);
        }
    };

    const handleRefreshFriendRequests = async () => {
        try {
            setIsRequestsRefreshing(true);
            // Refresh the profile which contains friend requests
            await refetchProfile();
            setSnackbar({
                open: true,
                message: 'Friend requests refreshed successfully',
                severity: 'success'
            });
        } catch (error) {
            console.error('Failed to refresh friend requests:', error);
            setSnackbar({
                open: true,
                message: 'Failed to refresh friend requests',
                severity: 'error'
            });
        } finally {
            setIsRequestsRefreshing(false);
        }
    };

    const handleRefreshBlockedUsers = async () => {
        try {
            setIsBlockedRefreshing(true);
            await refetchBlockedUsers();
            setSnackbar({
                open: true,
                message: 'Blocked users refreshed successfully',
                severity: 'success'
            });
        } catch (error) {
            console.error('Failed to refresh blocked users:', error);
            setSnackbar({
                open: true,
                message: 'Failed to refresh blocked users',
                severity: 'error'
            });
        } finally {
            setIsBlockedRefreshing(false);
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const friendRequests = profile?.incomingFriendRequests || [];
    const pendingCount = friendRequests.length;

    if (friendsLoading || profileLoading || blockedLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress />
            </Box>
        );
    }

    if (friendsError || profileError || blockedError) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Alert severity="error">
                    <AlertTitle>Error Loading Data</AlertTitle>
                    {friendsErrorMsg?.message || profileError?.message || blockedError?.message || 'Failed to load data. Please try again later.'}
                </Alert>
            </Container>
        );
    }

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
                    onRefresh={handleRefreshFriends}
                    isRefreshing={isFriendsRefreshing}
                />
            </TabPanel>

            <TabPanel value={currentTab} index={1}>
                <FriendRequestsList
                    friendRequests={friendRequests}
                    onRefresh={handleRefreshFriendRequests}
                    isRefreshing={isRequestsRefreshing}
                />
            </TabPanel>

            <TabPanel value={currentTab} index={2}>
                <BlockedUsersList
                    blockedUsers={blockedUsers}
                    onUnblock={handleUnblock}
                    onRefresh={handleRefreshBlockedUsers}
                    isRefreshing={isBlockedRefreshing}
                />
            </TabPanel>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
                message={snackbar.message}
            />
        </Container>
    );
}