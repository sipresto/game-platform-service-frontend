import {useMutation} from "@tanstack/react-query";
import {buyGame} from "../services/purchaseApi.ts";

export function usePurchaseGame() {

    const purchaseMutation = useMutation(
        {mutationFn: (gameId: string) => buyGame(gameId)}
    );

    return {
        purchaseGame: purchaseMutation
    }
}
