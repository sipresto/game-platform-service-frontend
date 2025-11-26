import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateUsername } from '../services/api';
import { useUserProfile } from '../hooks/useUserProfile';
import { useNavigate } from 'react-router';
import { AxiosError } from 'axios';

interface ApiErrorResponse {
    error: string;
}

export function WelcomePage() {
    const { profile } = useUserProfile();
    const [username, setUsername] = useState(profile?.username || '');
    const [error, setError] = useState('');
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const mutation = useMutation({
        mutationFn: (newUsername: string) => updateUsername(newUsername),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['userProfile'] });
            navigate('/securedpage');
        },

        onError: (err: AxiosError<ApiErrorResponse>) => {
            setError(err.response?.data?.error || 'Failed to update username');
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!username.trim()) {
            setError('Username cannot be empty');
            return;
        }

        if (username.length < 3) {
            setError('Username must be at least 3 characters');
            return;
        }

        setError('');
        mutation.mutate(username);
    };

    const handleSkip = () => {
        navigate('/securedpage');
    };

    return (
        <div style={{
            maxWidth: '500px',
            margin: '3rem auto',
            padding: '2rem',
            border: '1px solid #ddd',
            borderRadius: '8px'
        }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
                Welcome to Game Platform! 🎮
            </h1>

            <p style={{ marginBottom: '2rem', color: '#666' }}>
                Complete your profile to get started. You can always change this later.
            </p>

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1.5rem' }}>
                    <label
                        htmlFor="username"
                        style={{
                            display: 'block',
                            marginBottom: '0.5rem',
                            fontWeight: 'bold'
                        }}
                    >
                        Username
                    </label>
                    <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter your username"
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            fontSize: '1rem',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            boxSizing: 'border-box'
                        }}
                    />
                    {error && (
                        <p style={{ color: 'red', marginTop: '0.5rem', fontSize: '0.9rem' }}>
                            {error}
                        </p>
                    )}
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        type="submit"
                        disabled={mutation.isPending}
                        style={{
                            flex: 1,
                            padding: '0.75rem',
                            fontSize: '1rem',
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: mutation.isPending ? 'not-allowed' : 'pointer',
                            opacity: mutation.isPending ? 0.6 : 1
                        }}
                    >
                        {mutation.isPending ? 'Saving...' : 'Continue'}
                    </button>

                    <button
                        type="button"
                        onClick={handleSkip}
                        style={{
                            padding: '0.75rem 1.5rem',
                            fontSize: '1rem',
                            backgroundColor: 'transparent',
                            color: '#666',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Skip
                    </button>
                </div>
            </form>

            <p style={{
                marginTop: '1.5rem',
                fontSize: '0.9rem',
                color: '#999',
                textAlign: 'center'
            }}>
                Your current username: <strong>{profile?.username}</strong>
            </p>
        </div>
    );
}