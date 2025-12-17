export function getDifficultyDisplayName(difficulty: string): string {
    switch (difficulty) {
        case 'EASY': return 'Easy';
        case 'HARD': return 'Medium';
        case 'IMPOSSIBLE': return 'Hard';
        default: return difficulty;
    }
}