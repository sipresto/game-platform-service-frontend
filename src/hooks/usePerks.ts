import { useState, useEffect, useCallback } from 'react';
import type { Perk } from '../model/perk';
import {fetchPerks} from "../services/perkApi.ts";

export function usePerksData() {
    const [perks, setPerks] = useState<Perk[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchData = useCallback(async () => {
        try {
            setIsLoading(true);
            const perksData = await fetchPerks();
            setPerks(perksData);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to load perks'));
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        void fetchData();
    }, [fetchData]);

    return { perks, isLoading, error };
}