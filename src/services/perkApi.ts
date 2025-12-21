import apiClient from './axiosInstance';
import type { AxiosError } from "axios";
import type {Perk} from "../model/perk.ts";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;


function extractError(error: unknown): { status?: number; statusText?: string; message: string } {
    const axiosError = error as AxiosError;
    return {
        status: axiosError.response?.status,
        statusText: axiosError.response?.statusText,
        message: axiosError.message,
    };
}

export const fetchPerks = async (): Promise<Perk[]> => {
    try {
        const response = await apiClient.get<Perk[]>(
            `${BACKEND_URL}/perks`
        );
        return response.data;
    } catch (error) {
        const err = extractError(error);
        if (err.status === 404) {
            return [];
        }
        throw new Error(`Failed to fetch perks: ${err.statusText || err.message}`);
    }
};



