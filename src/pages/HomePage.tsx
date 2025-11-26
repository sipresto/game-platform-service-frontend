import { useContext } from 'react';
import { Link } from 'react-router';
import SecurityContext from '../context/SecurityContext';
import { Header } from '../components/Header';

export function HomePage() {
    const { isAuthenticated } = useContext(SecurityContext);

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Header />

            <main style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem',
                textAlign: 'center'
            }}>
                <h1 style={{
                    fontSize: '3.5rem',
                    marginBottom: '1rem',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontWeight: 'bold'
                }}>
                    Welcome to Game Platform
                </h1>

                <p style={{
                    fontSize: '1.25rem',
                    color: '#666',
                    maxWidth: '600px',
                    marginBottom: '3rem',
                    lineHeight: '1.6'
                }}>
                    Discover, play, and share amazing games with players around the world.
                    Join our community today!
                </p>

                {isAuthenticated() ? (
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <Link
                            to="/securedpage"
                            style={{
                                padding: '1rem 2rem',
                                fontSize: '1.1rem',
                                backgroundColor: '#667eea',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                textDecoration: 'none',
                                fontWeight: 'bold',
                                transition: 'transform 0.2s',
                            }}
                            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            Go to Dashboard
                        </Link>
                    </div>
                ) : (
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                        <Link
                            to="/browse-games"
                            style={{
                                padding: '1rem 2rem',
                                fontSize: '1.1rem',
                                backgroundColor: 'transparent',
                                color: '#667eea',
                                border: '2px solid #667eea',
                                borderRadius: '8px',
                                textDecoration: 'none',
                                fontWeight: 'bold',
                                transition: 'all 0.2s',
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.backgroundColor = '#667eea';
                                e.currentTarget.style.color = 'white';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent';
                                e.currentTarget.style.color = '#667eea';
                            }}
                        >
                            Browse Games
                        </Link>
                    </div>
                )}

                <div style={{
                    marginTop: '4rem',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '2rem',
                    maxWidth: '1000px',
                    width: '100%'
                }}>
                    <FeatureCard
                        icon="🎯"
                        title="Discover Games"
                        description="Browse our extensive catalog of amazing games"
                    />
                    <FeatureCard
                        icon="👥"
                        title="Connect"
                        description="Join a vibrant community of gamers"
                    />
                    <FeatureCard
                        icon="🏆"
                        title="Compete"
                        description="Challenge friends and climb leaderboards"
                    />
                </div>
            </main>

            <footer style={{
                padding: '2rem',
                textAlign: 'center',
                backgroundColor: '#f8f9fa',
                color: '#666'
            }}>
                <p>© 2024 Game Platform. All rights reserved.</p>
            </footer>
        </div>
    );
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
    return (
        <div style={{
            padding: '2rem',
            backgroundColor: '#f8f9fa',
            borderRadius: '12px',
            transition: 'transform 0.2s, box-shadow 0.2s',
        }}
             onMouseOver={(e) => {
                 e.currentTarget.style.transform = 'translateY(-5px)';
                 e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
             }}
             onMouseOut={(e) => {
                 e.currentTarget.style.transform = 'translateY(0)';
                 e.currentTarget.style.boxShadow = 'none';
             }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{icon}</div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>{title}</h3>
            <p style={{ color: '#666' }}>{description}</p>
        </div>
    );
}