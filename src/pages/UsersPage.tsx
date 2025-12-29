import { useState, useMemo } from 'react';
import {
    Container,
    Typography,
    CircularProgress,
    Alert,
    AlertTitle,
    Box
} from '@mui/material';
import { UserSearchBar } from '../components/users/UserSearchBar';
import { UsersGrid } from '../components/users/UsersGrid';
import { useAllUsers } from '../hooks/useUserProfile';
import type { PublicUserProfile } from '../model/userProfile';

export function UsersPage() {
    const [searchTerm, setSearchTerm] = useState('');
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

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress />
            </Box>
        );
    }

    if (isError) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Alert severity="error">
                    <AlertTitle>Error Loading Users</AlertTitle>
                    {error?.message || 'Failed to load users. Please try again later.'}
                </Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
                Users
            </Typography>
            <Typography variant="body1" color="text.secondary">
                Browse all users on the platform. You can see public profiles and users you're connected with.
            </Typography>

            <UserSearchBar
                searchTerm={searchTerm}
                onSearchTermChange={setSearchTerm}
            />

            <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                    Showing {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''}
                    {searchTerm && ` matching "${searchTerm}"`}
                </Typography>
            </Box>

            <UsersGrid users={filteredUsers} />
        </Container>
    );
}