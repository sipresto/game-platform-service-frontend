import {useMutation, useQueryClient} from '@tanstack/react-query';
import {chargeGame, completePurchase} from '../services/paymentApi';
import type {Purchase} from "../model/purchase.ts";

interface PurchaseParams {
    gameId: string;
    stripeToken: string;
}

export function usePurchaseGame() {
    const queryClient = useQueryClient();

    return useMutation<Purchase, Error, PurchaseParams>({
        mutationFn: async ({ gameId, stripeToken }: PurchaseParams) => {
            const chargeResponse = await chargeGame(gameId, stripeToken);

            if (!chargeResponse.id) {
                throw new Error('Payment charge failed');
            }

            return await completePurchase(gameId, chargeResponse.id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['userProfile'] });
            queryClient.invalidateQueries({ queryKey: ['ownedGames'] });
        },
        onError: (error) => {
            console.error('Purchase failed:', error);
        },
    });
}