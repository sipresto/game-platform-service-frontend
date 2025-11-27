import {useQuery} from "@tanstack/react-query";
import {buyGame} from "../services/purchaseApi.ts";

export function usePurchaseGame(gameId: string | undefined) {
    return useQuery({
        queryKey: ['game', gameId],
        queryFn: () => buyGame(gameId!),
        enabled: !!gameId,
    })
}