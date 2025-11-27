export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

export type SessionResult = 'WIN' | 'LOSS' | 'DRAW';

export interface Session {
    id: string;
    gameId: string;
    playerIds: string[];
    difficulty: Difficulty;
    winnerId?: string;
    result: SessionResult;
    completedAt: string;
}