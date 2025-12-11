import { useQuery } from "@tanstack/react-query";
import { useCurrentUser } from "./useUserProfile.ts";
import {getAchievementProgressByUserId} from "../services/achievementProgressApi.ts";
import type {AchievementProgress} from "../model/achievementProgress.ts";

export function useAchievementsForUser(userId: string) {
    const { isAuthenticated } = useCurrentUser();

    const {
        data: achievements = [],
        isLoading: loading,
        error
    } = useQuery<AchievementProgress[], Error>({
        queryKey: ['achievements', userId],
        queryFn: () => getAchievementProgressByUserId(userId),
        enabled: isAuthenticated && !!userId,
    });

    return {
        achievements,
        loading,
        error: error ? error.message : null
    };
}
