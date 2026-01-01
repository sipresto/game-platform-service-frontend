import { useState } from 'react';
import { Container, Snackbar } from '@mui/material';
import { useAllUsers } from '../hooks/useUserProfile';
import { UsersGrid } from '../components/users/UsersGrid';
import { filterUsers } from '../utils/userUtils';
import { useUsersRefresh } from '../hooks/useUsersRefresh';
import { useSnackbar } from '../hooks/useSnackbar';
import { UsersPageLoadingState } from '../components/users/UsersPageLoadingState';
import { UsersPageErrorState } from '../components/users/UsersPageErrorState';
import { UsersPageHeader } from '../components/users/UsersPageHeader';
import { UsersSearchHeader } from '../components/users/UsersSearchHeader';

export function UsersPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const { snackbar, showSnackbar, closeSnackbar } = useSnackbar();
    const { isRefreshing, refreshUsers } = useUsersRefresh();

    const { publicUsers, friends, isLoading, isError, error } = useAllUsers();

    const handleRefresh = async () => {
        try {
            await refreshUsers();
            showSnackbar('Users list refreshed successfully', 'success');
        } catch {
            showSnackbar('Failed to refresh users list: ', 'error');
        }
    };

    if (isLoading) {
        return <UsersPageLoadingState isRefreshing={isRefreshing} />;
    }

    if (isError) {
        return (
            <UsersPageErrorState
                errorMessage={error?.message}
                onRefresh={handleRefresh}
                isRefreshing={isRefreshing}
            />
        );
    }

    const filteredUsers = filterUsers(publicUsers, friends, searchTerm);

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <UsersPageHeader />

            <UsersSearchHeader
                searchTerm={searchTerm}
                onSearchTermChange={setSearchTerm}
                onRefresh={handleRefresh}
                isRefreshing={isRefreshing}
                filteredCount={filteredUsers.length}
            />

            <UsersGrid users={filteredUsers} />

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={closeSnackbar}
                message={snackbar.message}
            />
        </Container>
    );
}