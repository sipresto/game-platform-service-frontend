import React, { useState } from 'react';
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
    Badge
} from '@mui/material';
import { Group, PersonAdd } from '@mui/icons-material';
import { useAllUsers, useUserProfile } from '../hooks/useUserProfile';
import { FriendsList } from '../components/friends/FriendsList';
import { FriendRequestsList } from '../components/friends/FriendRequestsList';

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
    const [currentTab, setCurrentTab] = useState(0);
    const { friends, isLoading: friendsLoading, isError: friendsError, error: friendsErrorMsg } = useAllUsers();
    const { profile, isLoading: profileLoading, error: profileError } = useUserProfile();

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setCurrentTab(newValue);
    };

    const friendRequests = profile?.friendRequests || [];
    const pendingCount = friendRequests.length;

    if (friendsLoading || profileLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress />
            </Box>
        );
    }

    if (friendsError || profileError) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Alert severity="error">
                    <AlertTitle>Error Loading Friends</AlertTitle>
                    {friendsErrorMsg?.message || profileError?.message || 'Failed to load friends. Please try again later.'}
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
                    Manage your friends and friend requests
                </Typography>
            </Box>

            <Paper sx={{ mb: 3 }}>
                <Tabs
                    value={currentTab}
                    onChange={handleTabChange}
                    aria-label="friends tabs"
                    variant="fullWidth"
                    sx={{
                        borderBottom: 1,
                        borderColor: 'divider',
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
                </Tabs>
            </Paper>

            <TabPanel value={currentTab} index={0}>
                <FriendsList friends={friends} />
            </TabPanel>

            <TabPanel value={currentTab} index={1}>
                <FriendRequestsList friendRequests={friendRequests} />
            </TabPanel>
        </Container>
    );
}