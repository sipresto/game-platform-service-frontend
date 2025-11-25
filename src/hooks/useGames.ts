import { useState, useEffect, useCallback } from 'react';
import { fetchGames } from '../services/gameService';
import type {Game} from "../model/game.ts";

export function useGames() {
    const [games, setGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const loadGames = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchGames();
            setGames(data);

            if (data.length > 0) {
                console.info(`Successfully loaded ${data.length} games.`);
            } else {
                console.info('Request successful, but no games exist.');
            }

        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unexpected error occurred');
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
       void loadGames();
    }, [loadGames]);

    return { games, loading, error, refresh: loadGames };
}