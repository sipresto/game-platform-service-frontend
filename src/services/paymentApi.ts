import apiClient from './axiosInstance';
import type {Purchase} from "../model/purchase.ts";
import type {ChargeResponse} from "../model/chargeResponse.ts";

const BACKEND_URL: string = import.meta.env.VITE_BACKEND_URL;

export async function chargeGame(
    gameId: string,
    stripeToken: string
): Promise<ChargeResponse> {
    const {data} = await apiClient.post<ChargeResponse>(
        `${BACKEND_URL}/payment/charge/${gameId}`,
        {stripeToken}
    );
    return data;
}

export async function completePurchase(
    gameId: string,
    chargeId: string
): Promise<Purchase> {
    const {data} = await apiClient.post<Purchase>(
        `${BACKEND_URL}/purchases/${gameId}`,
        {chargeId}
    );
    return data;
}