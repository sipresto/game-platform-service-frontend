import {Box, Chip, Grid, Paper, Skeleton, Typography} from "@mui/material"
import {EmojiEvents as TrophyIcon} from "@mui/icons-material"
import type {AchievementProgress} from "../../model/achievementProgress"
import {AchievementCard} from "./AchievementCard.tsx";

interface AchievementsSectionProps {
    achievements: AchievementProgress[]
    loading: boolean
}

export function AchievementsSection({ achievements, loading }: AchievementsSectionProps) {
    const completedAchievements = achievements.filter((a) => a.completedAt !== null)

    return (
        <Paper elevation={1} sx={{ p: 3, borderRadius: 2, flexGrow: 1 }}>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 3,
                    pb: 2,
                    borderBottom: 1,
                    borderColor: "divider",
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <TrophyIcon sx={{ fontSize: 28, color: "primary.main" }} />
                    <Typography variant="h5" fontWeight={700}>
                        Achievements
                    </Typography>
                </Box>
                <Chip
                    label={`${completedAchievements.length} ${completedAchievements.length === 1 ? "achievement" : "achievements"}`}
                    color="primary"
                />
            </Box>
            {loading ? (
                <Grid container spacing={2}>
                    {[1, 2, 3, 4].map((i) => (
                        <Grid key={i} size={{ xs: 12, sm: 6, md: 6, lg: 4 }}>
                            <Skeleton variant="rectangular" height={150} sx={{ borderRadius: 1 }} />
                        </Grid>
                    ))}
                </Grid>
            ) : completedAchievements.length > 0 ? (
                <Grid container spacing={2}>
                    {completedAchievements.map((achievement) => (
                        <Grid key={`${achievement.gameId}-${achievement.achievementId}`} size={{ xs: 12, sm: 6, md: 6, lg: 4 }}>
                            <AchievementCard achievement={achievement} />
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Box sx={{ textAlign: "center", py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                        No achievements unlocked yet
                    </Typography>
                </Box>
            )}
        </Paper>
    )
}
