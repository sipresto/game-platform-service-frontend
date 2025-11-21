// src/pages/SecuredPage.tsx (or wherever your component lives)
import { useContext } from 'react';
import { useUserProfile } from '../hooks/useUserProfile';
import SecurityContext from '../context/SecurityContext';

export function SecuredPage() {
    const { isLoading, isError, profile } = useUserProfile();
    useContext(SecurityContext);

    if (isLoading) return <div>Loading...</div>;
    if (isError || !profile) return <div>Error!</div>;

    return (
        <div style={{ fontSize: '1.25rem', textAlign: 'center', marginTop: '2rem' }}>
            <h2 style={{ fontSize: '2rem' }}>
                Hello{profile.name ? `, ${profile.name}` : ''}!
            </h2>

            <p>
                Username: <strong>{profile.username ?? '—'}</strong>
            </p>
            <p>
                Email: <strong>{profile.email ?? '—'}</strong>
            </p>

            {profile.roles?.length ? (
                <p style={{ marginTop: '1rem', fontSize: '0.95rem', color: '#444' }}>
                    Roles: {profile.roles.join(', ')}
                </p>
            ) : (
                <p style={{ marginTop: '1rem', fontSize: '0.95rem', color: '#999' }}>
                    No roles assigned
                </p>
            )}
        </div>
    );
}
