import apiClient from './axiosInstance';
import type { Session } from "../model/session.ts";
import type {AxiosError} from "axios";

const BACKEND_URL: string = import.meta.env.VITE_BACKEND_URL;

export async function getSessionsByUserId(userId: string): Promise<Session[]> {
    try {
        const { data } = await apiClient.get<Session[]>(
            `${BACKEND_URL}/sessions/user/${userId}`
        );
        return data;
    } catch (error) {
        const axiosError = error as AxiosError;
        if (axiosError.response?.status === 404) {
            return [];
        }
        throw new Error(`Failed to fetch sessions: ${axiosError.response?.statusText || axiosError.message}`);
    }
}
