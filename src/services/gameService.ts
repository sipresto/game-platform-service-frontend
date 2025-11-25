import type {Game} from '../model/game';
import type {GameFilterRequest} from "../model/gameRequest.ts";

const GAMES_ENDPOINT = '/api/games';

export const fetchGames = async (): Promise<Game[]> => {
    const response = await fetch(GAMES_ENDPOINT);
    if (response.status === 404) return [];

    if (!response.ok) {
        throw new Error(`Failed to fetch games, try again later. `);
    }

    const data: unknown = await response.json();
    if (!Array.isArray(data)) throw new Error('Invalid API response');

    return data as Game[];
};

export const filterGames = async (filter: GameFilterRequest): Promise<Game[]> => {
    const response = await fetch(`${GAMES_ENDPOINT}/filter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(filter),
    });

    if (response.status === 404) return [];

    if (!response.ok) {
        throw new Error(`Failed to filter games: ${response.statusText}`);
    }

    const data: unknown = await response.json();
    if (!Array.isArray(data)) throw new Error('Invalid API response');

    return data as Game[];
};