// pages/PurchasePage.tsx
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import {
    Alert,
    Card,
    CardContent,
    CircularProgress,
    Container,
    Divider,
    Snackbar,
} from '@mui/material';
import { useGameDetails } from '../hooks/useGames';
import { usePurchaseGame } from '../hooks/usePurchase';
import { GameSummary } from '../components/purchase/GameSummary';
import { PaymentForm } from '../components/purchase/PaymentForm';
import { PurchaseSuccessDialog } from '../components/purchase/PurchaseSuccessDialog';

const stripePromise = loadStripe(
    'pk_test_51SNDZTJ1ImozCeQbLIqQZdxtwCUOoqDxGyQfzavM7c0Eur3G4pabbJy2BX3n1jnlDYZSzRkM168LuPDK2wkT6k8E00KxUjMSXQ'
);

export function PurchasePage() {
    const { gameId } = useParams<{ gameId: string }>();
    const navigate = useNavigate();
    const { game: game, loading, error: gameError } = useGameDetails(gameId);
    const purchaseMutation = usePurchaseGame();

    const [successDialogOpen, setSuccessDialogOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handlePurchase = async (stripeToken: string) => {
        if (!gameId) {
            setError('Game ID is missing');
            return;
        }

        try {
            await purchaseMutation.mutateAsync({
                gameId,
                stripeToken,
            });
            setSuccessDialogOpen(true);
        } catch (err) {
            const msg =
                err instanceof Error
                    ? err.message
                    : 'Purchase failed. Please try again.';
            setError(msg);
        }

    };

    const handleSuccessClose = () => {
        setSuccessDialogOpen(false);
        navigate('/library');
    };

    const handleErrorClose = () => {
        setError(null);
    };

    if (loading) {
        return (
            <Container maxWidth="sm" sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                <CircularProgress />
            </Container>
        );
    }

    if (gameError || !game) {
        return (
            <Container maxWidth="sm" sx={{ mt: 4 }}>
                <Alert severity="error">
                    Failed to load game details. Please try again later.
                </Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
            <Card elevation={3}>
                <GameSummary game={game} />

                <CardContent>
                    <Divider sx={{ mb: 3 }} />

                    <Elements stripe={stripePromise}>
                        <PaymentForm
                            game={game}
                            onSubmit={handlePurchase}
                            onSuccess={() => setSuccessDialogOpen(true)}
                            onError={setError}
                        />
                    </Elements>
                </CardContent>
            </Card>

            <PurchaseSuccessDialog
                open={successDialogOpen}
                gameName={game.name}
                onClose={handleSuccessClose}
            />

            <Snackbar
                open={!!error}
                autoHideDuration={6000}
                onClose={handleErrorClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleErrorClose} severity="error" sx={{ width: '100%' }}>
                    {error}
                </Alert>
            </Snackbar>
        </Container>
    );
}