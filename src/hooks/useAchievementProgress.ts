import { useSuspenseQuery } from "@tanstack/react-query";
import { getAchievementProgressByUserId } from "../services/achievementProgressApi.ts";
import type { AchievementProgress } from "../model/achievementProgress.ts";

export function useAchievementsForUser(userId: string) {
    if (!userId) {
        throw new Error("userId required");
    }

    const { data } = useSuspenseQuery<AchievementProgress[]>({
        queryKey: ['achievements', userId],
        queryFn: () => getAchievementProgressByUserId(userId),
    });

    return { achievements: data };
}