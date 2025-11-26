import axios from 'axios';
import type {LibraryGame} from "../model/libraryGame.ts";

const BACKEND_URL: string = import.meta.env.VITE_BACKEND_URL;

const getAuthHeaders = (token?: string | null) => {
    const accessToken = token ?? localStorage.getItem('accessToken');
    return accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
};

export async function getOwnedGamesForUser(userId: string, token?: string | null): Promise<LibraryGame[]> {
    const { data } = await axios.get<LibraryGame[]>(
        `${BACKEND_URL}/user/${userId}/games`,
        { headers: getAuthHeaders(token) }
    );
    return data;
}