import type { EnhancedSession } from './sessionEnhancer';

export interface Filters {
    result: string[];
    difficulty: string[];
    opponent: string[];
    search: string;
}

export function filterSessions(
    sessions: EnhancedSession[],
    filters: Filters,
    gameNamesMap: Record<string, string>
): EnhancedSession[] {
    let result = [...sessions];

    if (filters.search.trim()) {
        const searchLower = filters.search.toLowerCase().trim();
        result = result.filter(session => {
            const gameName = gameNamesMap[session.gameId] || '';
            return gameName.toLowerCase().includes(searchLower);
        });
    }

    if (filters.result.length > 0) {
        result = result.filter(session => {
            return filters.result.includes(session.enhancedUserResult);
        });
    }

    if (filters.difficulty.length > 0) {
        result = result.filter(session => filters.difficulty.includes(session.difficulty));
    }

    if (filters.opponent.length > 0) {
        result = result.filter(session => {
            const isAI = session.isAgainstAI;
            if (filters.opponent.includes('ai') && isAI) return true;
            return filters.opponent.includes('player') && !isAI;
        });
    }

    return result;
}