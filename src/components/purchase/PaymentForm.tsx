import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import {
    Box,
    Button,
    CircularProgress,
    Paper,
    Typography,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import LockIcon from '@mui/icons-material/Lock';
import type { Game } from '../../model/game';

interface PaymentFormProps {
    game: Game;
    onSuccess: () => void;
    onError: (error: string) => void;
    onSubmit: (stripeToken: string) => Promise<void>;
}

const CARD_ELEMENT_OPTIONS = {
    style: {
        base: {
            fontSize: '16px',
            color: '#424770',
            '::placeholder': {
                color: '#aab7c4',
            },
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
            fontSmoothing: 'antialiased',
        },
        invalid: {
            color: '#9e2146',
            iconColor: '#9e2146',
        },
    },
};

export function PaymentForm({ game, onSubmit, onError }: PaymentFormProps) {
    const stripe = useStripe();
    const elements = useElements();
    const [processing, setProcessing] = useState(false);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setProcessing(true);

        try {
            const cardElement = elements.getElement(CardElement);
            if (!cardElement) {
                throw new Error('Card element not found');
            }

            const { error: tokenError, token } = await stripe.createToken(cardElement);

            if (tokenError) {
                throw new Error(tokenError.message);
            }

            if (!token) {
                throw new Error('Failed to create payment token');
            }

            await onSubmit(token.id);
        } catch (err) {
            const msg =
                err instanceof Error
                    ? err.message
                    : 'Payment failed. Please try again.';
            onError(msg);
        } finally {
            setProcessing(false);
        }
    };

    return (
        <Box>
            <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                    What You'll Get
                </Typography>
                <List dense>
                    <ListItem>
                        <ListItemIcon>
                            <CheckCircleOutlineIcon color="success" />
                        </ListItemIcon>
                        <ListItemText
                            primary="Instant access to the game"
                            secondary="Play immediately after purchase"
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <CheckCircleOutlineIcon color="success" />
                        </ListItemIcon>
                        <ListItemText
                            primary="Added to your library"
                            secondary="Access your game anytime, anywhere"
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <CheckCircleOutlineIcon color="success" />
                        </ListItemIcon>
                        <ListItemText
                            primary="Lifetime ownership"
                            secondary="No subscription required"
                        />
                    </ListItem>
                </List>
            </Box>

            <Divider sx={{ my: 3 }} />

            <form onSubmit={handleSubmit}>
                <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" gutterBottom fontWeight="bold">
                        Payment Details
                    </Typography>
                    <Paper
                        variant="outlined"
                        sx={{
                            p: 2,
                            border: '1px solid rgba(0, 0, 0, 0.23)',
                            borderRadius: 1,
                            '&:hover': {
                                borderColor: 'rgba(0, 0, 0, 0.87)',
                            },
                        }}
                    >
                        <CardElement options={CARD_ELEMENT_OPTIONS} />
                    </Paper>
                    <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <LockIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary">
                            Your payment information is secure and encrypted
                        </Typography>
                    </Box>
                </Box>

                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    fullWidth
                    disabled={!stripe || processing}
                    sx={{
                        py: 1.5,
                        fontSize: '1.1rem',
                        fontWeight: 'bold'
                    }}
                >
                    {processing ? (
                        <CircularProgress size={24} color="inherit" />
                    ) : (
                        `Complete Purchase - €${game.price?.toFixed(2) || '0.00'}`
                    )}
                </Button>

                <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: 'block', mt: 2, textAlign: 'center' }}
                >
                    By completing this purchase, you agree to our terms of service
                </Typography>
            </form>
        </Box>
    );
}