export interface Session {
    id: string;
    gameId: string;
    playerIds: string[];
    difficulty: 'EASY' | 'HARD' | 'IMPOSSIBLE';
    winnerId: string | null;
    result: 'PLAYER_WIN' | 'AI_WIN' | 'DRAW';
    completedAt: string;
    userResult?: 'WIN' | 'LOSS' | 'DRAW';
    isAgainstAI?: boolean;
    opponentName?: string;
}