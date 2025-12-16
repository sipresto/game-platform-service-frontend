import type { EnhancedSession } from './sessionEnhancer';

export type SortField = 'date' | 'result' | 'difficulty' | 'players';
export type SortDirection = 'asc' | 'desc';

export function sortSessions(
    sessions: EnhancedSession[],
    sortField: SortField,
    sortDirection: SortDirection
): EnhancedSession[] {
    const result = [...sessions];

    result.sort((a, b) => {
        let comparison = 0;

        switch (sortField) {
            case 'date': {
                const dateA = new Date(a.completedAt).getTime();
                const dateB = new Date(b.completedAt).getTime();
                comparison = dateA - dateB;
                break;
            }

            case 'result': {
                const resultOrder: Record<string, number> = { WIN: 1, DRAW: 2, LOSS: 3 };
                comparison = (resultOrder[a.enhancedUserResult] || 4) - (resultOrder[b.enhancedUserResult] || 4);
                break;
            }

            case 'difficulty': {
                const difficultyOrder: Record<string, number> = { EASY: 1, HARD: 2, IMPOSSIBLE: 3 };
                comparison = (difficultyOrder[a.difficulty] || 4) - (difficultyOrder[b.difficulty] || 4);
                break;
            }

            case 'players':
                comparison = (a.playerIds?.length || 0) - (b.playerIds?.length || 0);
                break;
        }

        return sortDirection === 'asc' ? comparison : -comparison;
    });

    return result;
}