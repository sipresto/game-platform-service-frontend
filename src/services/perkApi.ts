import apiClient from './axiosInstance';
import type {Perk} from "../model/perk.ts";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const fetchPerks = async (): Promise<Perk[]> => {
    const response = await apiClient.get<Perk[]>(
        `${BACKEND_URL}/perks`
    );
    return response.data;
};



