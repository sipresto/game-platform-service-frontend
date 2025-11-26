import { Header } from '../components/Header';
import { Link } from 'react-router';

export function BrowseGamesPage() {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Header />

            <main style={{ flex: 1, padding: '2rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Browse Games</h1>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                    gap: '2rem'
                }}>
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <GameCard key={i} id={i} />
                    ))}
                </div>
            </main>
        </div>
    );
}

function GameCard({ id }: { id: number }) {
    return (
        <div style={{
            backgroundColor: '#f8f9fa',
            borderRadius: '12px',
            overflow: 'hidden',
            transition: 'transform 0.2s, box-shadow 0.2s',
            cursor: 'pointer'
        }}
             onMouseOver={(e) => {
                 e.currentTarget.style.transform = 'translateY(-5px)';
                 e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.15)';
             }}
             onMouseOut={(e) => {
                 e.currentTarget.style.transform = 'translateY(0)';
                 e.currentTarget.style.boxShadow = 'none';
             }}>
            <div style={{ padding: '1rem' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Game {id}</h3>
                <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1rem' }}>
                    An awesome game description goes here
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#667eea', fontWeight: 'bold' }}>$9.99</span>
                    <Link
                        to={`/game/${id}`}
                        style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: '#667eea',
                            color: 'white',
                            textDecoration: 'none',
                            borderRadius: '6px',
                            fontSize: '0.9rem'
                        }}
                    >
                        View Details
                    </Link>
                </div>
            </div>
        </div>
    );
}