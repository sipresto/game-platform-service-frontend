import { useState, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
    Container,
    Typography,
    CircularProgress,
    Alert,
    AlertTitle,
    Box,
    IconButton,
    Tooltip,
    Snackbar
} from '@mui/material';
import { Refresh } from '@mui/icons-material';
import { UserSearchBar } from '../components/users/UserSearchBar';
import { UsersGrid } from '../components/users/UsersGrid';
import { useAllUsers } from '../hooks/useUserProfile';
import type { PublicUserProfile } from '../model/userProfile';

export function UsersPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

    const queryClient = useQueryClient();
    const { publicUsers, friends, isLoading, isError, error } = useAllUsers();

    const filteredUsers = useMemo(() => {
        if (isLoading || isError) return [];

        const userMap = new Map<string, PublicUserProfile>();

        publicUsers.forEach(user => {
            userMap.set(user.id, user);
        });

        friends.forEach(user => {
            if (!userMap.has(user.id)) {
                userMap.set(user.id, user);
            }
        });

        const allUsers = Array.from(userMap.values());

        if (!searchTerm.trim()) return allUsers;

        const term = searchTerm.toLowerCase();
        return allUsers.filter(user => {
            const displayName = user.profile?.displayName?.toLowerCase() || '';
            const username = user.username.toLowerCase();
            return displayName.includes(term) || username.includes(term);
        });

    }, [publicUsers, friends, searchTerm, isLoading, isError]);

    const handleRefresh = async () => {
        try {
            setIsRefreshing(true);
            // Invalidate and refetch the queries used by useAllUsers
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ['publicUsers'] }),
                queryClient.invalidateQueries({ queryKey: ['friends'] })
            ]);
            setSnackbar({
                open: true,
                message: 'Users list refreshed successfully',
                severity: 'success'
            });
        } catch (error) {
            console.error('Failed to refresh users:', error);
            setSnackbar({
                open: true,
                message: 'Failed to refresh users list',
                severity: 'error'
            });
        } finally {
            setIsRefreshing(false);
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh" position="relative">
                {!isRefreshing && <CircularProgress />}
                {isRefreshing && (
                    <Box sx={{ textAlign: 'center' }}>
                        <CircularProgress />
                        <Typography variant="caption" color="primary" sx={{ display: 'block', mt: 1 }}>
                            Refreshing users...
                        </Typography>
                    </Box>
                )}
            </Box>
        );
    }

    if (isError) {
        return (
            <Container maxWidth="lg" sx={{ py: 4, position: 'relative' }}>
                <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
                    <Tooltip title="Refresh users">
                        <IconButton
                            onClick={handleRefresh}
                            disabled={isRefreshing}
                        >
                            <Refresh
                                sx={{
                                    animation: isRefreshing ? 'spin 1s linear infinite' : 'none'
                                }}
                            />
                        </IconButton>
                    </Tooltip>
                </Box>
                <Alert severity="error">
                    <AlertTitle>Error Loading Users</AlertTitle>
                    {error?.message || 'Failed to load users. Please try again later.'}
                </Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ mb: 4, position: 'relative' }}>
                <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
                    Users
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Browse all users on the platform. You can see public profiles and users you're connected with.
                </Typography>
            </Box>

            <Box sx={{
                display: 'flex',
                gap: 2,
                mb: 3,
                alignItems: 'center'
            }}>
                <Box sx={{ flexGrow: 1 }}>
                    <UserSearchBar
                        searchTerm={searchTerm}
                        onSearchTermChange={setSearchTerm}
                    />
                </Box>

                <Tooltip title="Refresh users list">
                    <IconButton
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                        sx={{
                            bgcolor: 'background.paper',
                            border: '1px solid',
                            borderColor: 'divider',
                            '&:hover': {
                                bgcolor: 'action.hover'
                            }
                        }}
                    >
                        <Refresh
                            sx={{
                                animation: isRefreshing ? 'spin 1s linear infinite' : 'none'
                            }}
                        />
                    </IconButton>
                </Tooltip>
            </Box>

            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2
            }}>
                <Typography variant="body2" color="text.secondary">
                    Showing {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''}
                    {searchTerm && ` matching "${searchTerm}"`}
                </Typography>

                {isRefreshing && (
                    <Typography variant="caption" color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Refresh sx={{ fontSize: 14, animation: 'spin 1s linear infinite' }} />
                        Refreshing...
                    </Typography>
                )}
            </Box>

            <UsersGrid users={filteredUsers} />

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
                message={snackbar.message}
            />
        </Container>
    );
}