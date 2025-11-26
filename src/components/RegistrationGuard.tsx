import { type PropsWithChildren, useContext } from 'react';
import { Navigate } from 'react-router';
import SecurityContext from '../context/SecurityContext';

export function RegistrationGuard({ children }: PropsWithChildren) {
    const {
        isAuthenticated,
        loggedInUser,
        isInitialised
    } = useContext(SecurityContext);

    if (!isAuthenticated()) {
        return <Navigate to="/publicpage" />;
    }

    if (!isInitialised) {
        return <div>Loading...</div>;
    }

    const hasCompletedRegistration = loggedInUser?.name && loggedInUser.name.length >= 3;

    if (!hasCompletedRegistration) {
        return <Navigate to="/welcome" />;
    }

    return <>{children}</>;
}