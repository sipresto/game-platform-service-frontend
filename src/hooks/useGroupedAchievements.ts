import type {AchievementProgress} from "../model/achievementProgress.ts";
import {useMemo} from "react";

interface GroupedAchievements {
    gameName: string
    achievements: AchievementProgress[]
}

export function useGroupedAchievements(achievements: AchievementProgress[]) {
    return useMemo(() => {
        const grouped = achievements.reduce((acc, achievement) => {
            if (!acc[achievement.gameId]) {
                acc[achievement.gameId] = {
                    gameName: achievement.gameName,
                    achievements: []
                }
            }
            acc[achievement.gameId].achievements.push(achievement)
            return acc
        }, {} as Record<string, GroupedAchievements>)

        Object.values(grouped).forEach(group => {
            const completed = group.achievements
                .filter(a => a.completedAt !== null)
                .sort((a, b) => {
                    const dateA = new Date(a.completedAt!).getTime()
                    const dateB = new Date(b.completedAt!).getTime()
                    return dateB - dateA
                })

            const incomplete = group.achievements.filter(a => a.completedAt === null)

            group.achievements = [...completed, ...incomplete]
        })

        return grouped
    }, [achievements])
}