import apiClient from './axiosInstance';
import type {Session} from "../model/session.ts";

const BACKEND_URL: string = import.meta.env.VITE_BACKEND_URL;

export async function getSessionsForSelf(): Promise<Session[]> {
    const {data} = await apiClient.get<Session[]>(
        `${BACKEND_URL}/sessions/user`
    );
    return data;
}
