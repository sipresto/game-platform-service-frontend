import {useState} from 'react';
import {Container, Snackbar} from '@mui/material';
import {useAllUsers} from '../hooks/useUserProfile';
import {UsersGrid} from '../components/users/UsersGrid';
import {filterUsers} from '../utils/userUtils';
import {useSnackbar} from '../hooks/useSnackbar';
import {UsersPageHeader} from '../components/users/UsersPageHeader';
import {UsersSearchHeader} from '../components/users/UsersSearchHeader';

export function UsersPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const {snackbar, closeSnackbar} = useSnackbar();

    const {publicUsers, friends} = useAllUsers();


    const filteredUsers = filterUsers(publicUsers, friends, searchTerm);

    return (
        <Container maxWidth="lg" sx={{py: 4}}>
            <UsersPageHeader/>

            <UsersSearchHeader
                searchTerm={searchTerm}
                onSearchTermChange={setSearchTerm}
                filteredCount={filteredUsers.length}
            />

            <UsersGrid users={filteredUsers}/>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={closeSnackbar}
                message={snackbar.message}
            />
        </Container>
    );
}