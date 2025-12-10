export interface AchievementProgress {
    gameId: string;
    gameName: string;
    achievementId: string;
    achievementName: string;
    achievementDescription: string;
    requiredValue: number | null;
    currentProgress: number | null;
    completedAt: string | null;
}
