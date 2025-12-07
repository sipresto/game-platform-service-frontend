import apiClient from './axiosInstance';
import type { AxiosError } from 'axios';
import type {ChargeResponse} from "../model/ChargeResponse.ts";
import type {Purchase} from "../model/purchase.ts";

const BACKEND_URL: string = import.meta.env.VITE_BACKEND_URL;

export async function chargeGame(
    gameId: string,
    stripeToken: string
): Promise<ChargeResponse> {
    try {
        const { data } = await apiClient.post<ChargeResponse>(
            `${BACKEND_URL}/payment/charge/${gameId}`,
            { stripeToken }
        );
        return data;
    } catch (error) {
        const axiosError = error as AxiosError<{ error: string }>;
        if (axiosError.response?.data?.error) {
            throw new Error(axiosError.response.data.error);
        }
        throw new Error(
            `Payment failed: ${axiosError.response?.statusText || axiosError.message}`
        );
    }
}

export async function completePurchase(
    gameId: string,
    chargeId: string
): Promise<Purchase> {
    try {
        const { data } = await apiClient.post<Purchase>(
            `${BACKEND_URL}/purchases/${gameId}`,
            { chargeId }
        );
        return data;
    } catch (error) {
        const axiosError = error as AxiosError;
        if (axiosError.response?.status === 401) {
            throw new Error('Authentication required to complete purchase');
        }
        if (axiosError.response?.status === 402) {
            throw new Error('Payment verification failed');
        }
        throw new Error(
            `Failed to complete purchase: ${axiosError.response?.statusText || axiosError.message}`
        );
    }
}