import { type PropsWithChildren, useContext } from 'react';
import { Navigate } from 'react-router';
import SecurityContext from '../context/SecurityContext';

export function RegistrationGuard({ children }: PropsWithChildren) {
    const {
        isAuthenticated,
        profile,
        profileIsLoading
    } = useContext(SecurityContext);

    if (!isAuthenticated()) {
        return <Navigate to="/publicpage" />;
    }

    if (profileIsLoading) {
        return <div>Loading profile...</div>;
    }

    const hasCompletedRegistration = profile?.username && profile.username.length >= 3;

    if (!hasCompletedRegistration) {
        return <Navigate to="/welcome" />;
    }

    return <>{children}</>;
}