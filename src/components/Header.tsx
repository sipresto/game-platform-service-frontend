import { useContext } from 'react';
import { Link } from 'react-router';
import SecurityContext from '../context/SecurityContext';

export function Header() {
    const { isAuthenticated, login, loggedInUser, keycloakInstance } = useContext(SecurityContext);

    const handleSignup = () => {
        if (keycloakInstance) {
            keycloakInstance.register();
        } else {
            login();
        }
    };

    return (
        <header style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem 2rem',
            backgroundColor: 'white',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            position: 'sticky',
            top: 0,
            zIndex: 1000
        }}>
            <Link
                to="/"
                style={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    textDecoration: 'none',
                    color: '#667eea'
                }}
            >
                Game Platform
            </Link>

            <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                <Link
                    to="/browse-games"
                    style={{
                        textDecoration: 'none',
                        color: '#333',
                        fontWeight: '500'
                    }}
                >
                    Games
                </Link>

                {isAuthenticated() ? (
                    <>
                        <Link
                            to="/securedpage"
                            style={{
                                textDecoration: 'none',
                                color: '#333',
                                fontWeight: '500'
                            }}
                        >
                            Dashboard
                        </Link>
                        <div style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: '#f0f0f0',
                            borderRadius: '20px',
                            fontSize: '0.9rem'
                        }}>
                            {loggedInUser?.name || 'KeycloakUser'}
                        </div>
                    </>
                ) : (
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button
                            onClick={login}
                            style={{
                                padding: '0.5rem 1.5rem',
                                fontSize: '1rem',
                                backgroundColor: 'transparent',
                                color: '#667eea',
                                border: '2px solid #667eea',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontWeight: '600',
                                transition: 'all 0.2s'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.backgroundColor = '#f0f0ff';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent';
                            }}
                        >
                            Login
                        </button>
                        <button
                            onClick={handleSignup}
                            style={{
                                padding: '0.5rem 1.5rem',
                                fontSize: '1rem',
                                backgroundColor: '#667eea',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontWeight: '600',
                                transition: 'all 0.2s'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.backgroundColor = '#5568d3';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.backgroundColor = '#667eea';
                            }}
                        >
                            Sign Up
                        </button>
                    </div>
                )}
            </nav>
        </header>
    );
}