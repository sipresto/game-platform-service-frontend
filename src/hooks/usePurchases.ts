import {useQuery} from "@tanstack/react-query";
import {buyGame} from "../services/purchaseApi.ts";
import {useContext} from "react";
import SecurityContext from "../context/SecurityContext.ts";

const useToken = () => {
    const { loggedInUser } = useContext(SecurityContext);
    return loggedInUser?.accessToken ?? loggedInUser?.idToken ?? localStorage.getItem('accessToken');
};

export function usePurchaseGame(gameId: string | undefined) {
    const token = useToken();

    return useQuery({
        queryKey: ['game', gameId],
        queryFn: () => buyGame(gameId!, token),
        enabled: !!gameId && !!token
    })
}