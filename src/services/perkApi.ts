import apiClient from './axiosInstance';
import type { Perk } from "../model/perk.ts";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const fetchPerks = async (): Promise<Perk[]> => {
    const response = await apiClient.get<Perk[]>(`${BACKEND_URL}/perks/user`);
    return response.data;
};

export const getUserPoints = async (): Promise<number> => {
    const response = await apiClient.get<number>(`${BACKEND_URL}/users/me/points`);
    return response.data;
};

export const purchasePerk = async (perkId: string): Promise<void> => {
    await apiClient.post(`${BACKEND_URL}/perks/purchase/${perkId}`);
};

export const equipPerk = async (perkId: string): Promise<void> => {
    await apiClient.post(`${BACKEND_URL}/perks/${perkId}/equip`);
};

export const unequipPerk = async (perkId: string): Promise<void> => {
    await apiClient.post(`${BACKEND_URL}/perks/${perkId}/unequip`);
};