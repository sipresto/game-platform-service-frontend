import apiClient from "../services/axiosInstance.ts";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export async function favoriteGame(gameId: string): Promise<void> {
    await apiClient.patch(
        `${BACKEND_URL}/games/library/favorite/${gameId}`
    );
}

export async function unfavoriteGame(gameId: string): Promise<void> {
    await apiClient.patch(
        `${BACKEND_URL}/games/library/unfavorite/${gameId}`
    );
}
