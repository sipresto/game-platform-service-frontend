import { Box, Typography, Paper } from "@mui/material"
import { EmojiEvents as TrophyIcon } from "@mui/icons-material"
import type { AchievementProgress } from "../../model/achievementProgress"

interface AchievementCardProps {
    achievement: AchievementProgress
}

export function AchievementCard({ achievement }: AchievementCardProps) {
    const completedDate = achievement.completedAt ? new Date(achievement.completedAt).toLocaleDateString() : ""

    return (
        <Paper
            elevation={2}
            sx={{
                p: 2,
                borderRadius: 2,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 4,
                },
            }}
        >
            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5, mb: 1 }}>
                <TrophyIcon sx={{ color: "primary.main", fontSize: 28, flexShrink: 0, position: "absolute" }} />
                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                    <Typography
                        variant="subtitle1"
                        fontWeight={600}
                        sx={{
                            mb: 0.5,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                        }}
                    >
                        {achievement.achievementName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1 }}>
                        {achievement.gameName}
                    </Typography>
                </Box>
            </Box>
            <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                    mb: 1.5,
                    flexGrow: 1,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                }}
            >
                {achievement.achievementDescription}
            </Typography>
            <Typography variant="caption" color="success.main" fontWeight={500}>
                Completed {completedDate}
            </Typography>
        </Paper>
    )
}
