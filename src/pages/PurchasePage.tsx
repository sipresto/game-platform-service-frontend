import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Container,
    Divider,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Snackbar,
    useTheme,
} from '@mui/material';
import { useGameDetails } from '../hooks/useGames';
import { usePurchaseGame } from '../hooks/usePurchase';
import { useOwnedGames } from '../hooks/useOwnedGames';
import { GameSummary } from '../components/purchase/GameSummary';
import { PaymentForm } from '../components/purchase/PaymentForm';
import { PurchaseSuccessDialog } from '../components/purchase/PurchaseSuccessDialog';

const stripePromise = loadStripe(
    'pk_test_51SNDZTJ1ImozCeQbLIqQZdxtwCUOoqDxGyQfzavM7c0Eur3G4pabbJy2BX3n1jnlDYZSzRkM168LuPDK2wkT6k8E00KxUjMSXQ'
);

export function PurchasePage() {
    const { gameId } = useParams<{ gameId: string }>();
    const navigate = useNavigate();
    const theme = useTheme();

    const { game, loading, error: gameError } = useGameDetails(gameId);
    const purchaseMutation = usePurchaseGame();

    const { games: ownedGames = [] } = useOwnedGames('');
    const isOwned = !!game && ownedGames.some((g) => g.gameId === game.gameId);

    const [successDialogOpen, setSuccessDialogOpen] = useState(false);
    const [ownedDialogOpen, setOwnedDialogOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const mountedRef = useRef(false);

    useEffect(() => {
        if (!mountedRef.current) {
            if (isOwned) {
                setOwnedDialogOpen(true);
            }
            mountedRef.current = true;
            return;
        }
        if (isOwned && !successDialogOpen) {
            setOwnedDialogOpen(true);
        }
    }, [isOwned, successDialogOpen]);

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
            const msg = err instanceof Error ? err.message : 'Purchase failed. Please try again.';
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

    const handleOwnedClose = () => {
        setOwnedDialogOpen(false);
        navigate('/library');
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
                <Alert severity="error">Failed to load game details. Please try again later.</Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="sm" sx={{ mt: 4, mb: 4, position: 'relative' }}>
            <Card
                elevation={3}
                sx={{
                    transition: 'opacity .25s, filter .25s',
                    opacity: isOwned && !successDialogOpen ? 0.35 : 1,
                    pointerEvents: isOwned && !successDialogOpen ? 'none' : 'auto',
                    filter: isOwned && !successDialogOpen ? 'grayscale(10%)' : 'none',
                }}
            >
                <GameSummary game={game} />

                <CardContent>
                    <Divider sx={{ mb: 3 }} />

                    {!isOwned ? (
                        <Elements stripe={stripePromise}>
                            <PaymentForm
                                game={game}
                                onSubmit={handlePurchase}
                                onSuccess={() => setSuccessDialogOpen(true)}
                                onError={setError}
                            />
                        </Elements>
                    ) : (
                        <Box sx={{ py: 3, textAlign: 'center', color: 'text.secondary' }}>
                            You already own this game. Redirect or manage it from your library.
                        </Box>
                    )}
                </CardContent>
            </Card>

            {isOwned && !successDialogOpen && (
                <Box
                    sx={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0,0,0,0.45)',
                        zIndex: theme.zIndex.modal - 1,
                    }}
                />
            )}

            <Dialog open={ownedDialogOpen} onClose={handleOwnedClose} fullWidth maxWidth="xs">
                <DialogTitle>Already Owned</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        You already own <strong>{game.name}</strong>. The game has been added to your library.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={() => setOwnedDialogOpen(false)}>Close</Button>
                    <Button variant="contained" onClick={() => navigate('/library')} autoFocus>
                        Go to Library
                    </Button>
                </DialogActions>
            </Dialog>

            <PurchaseSuccessDialog open={successDialogOpen} gameName={game.name} onClose={handleSuccessClose} />

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
