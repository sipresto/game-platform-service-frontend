import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Chip,
    Grid,
    Paper,
    Skeleton,
    Typography
} from "@mui/material"
import {ExpandMore, EmojiEvents as TrophyIcon} from "@mui/icons-material"
import type {AchievementProgress} from "../../model/achievementProgress"
import {AchievementCard} from "./AchievementCard.tsx";

interface AchievementsSectionProps {
    achievements: AchievementProgress[]
    loading: boolean
}

export function AchievementsSection({ achievements, loading }: AchievementsSectionProps) {
    const completedAchievements = achievements.filter((a) => a.completedAt !== null)

    const achievementsByGame = achievements.reduce((GameAchievementRecord, achievement) => {
        if (!GameAchievementRecord[achievement.gameId]) {
            GameAchievementRecord[achievement.gameId] = {
                gameName: achievement.gameName,
                achievements: []
            };
        }
        GameAchievementRecord[achievement.gameId].achievements.push(achievement);
        return GameAchievementRecord;
    }, {} as Record<string, { gameName: string; achievements: AchievementProgress[] }>);

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
                    label={`${achievements.length === 0 ? "No achievements" : completedAchievements.length + " / " + achievements.length + " achievements"} `}
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
            ) : (
                <>
                    {Object.keys(achievementsByGame).length > 0 ? (
                        Object.entries(achievementsByGame).map(([gameId, group]) => (
                            <Accordion key={gameId} sx={{ mb: 2 }}>
                                <AccordionSummary
                                    expandIcon={<ExpandMore />}
                                    aria-controls={`panel-${gameId}-content`}
                                    id={`panel-${gameId}-header`}
                                >
                                    <Typography variant="h6">{group.gameName}</Typography>

                                </AccordionSummary>
                                <Chip
                                    label={`${group.achievements.filter((a) => a.completedAt !== null).length + " / " + group.achievements.length + " achievements"} `}
                                    color="primary"
                                />
                                <AccordionDetails>
                                    <Grid container spacing={2}>
                                        {group.achievements
                                            .filter((achievement) => achievement.completedAt !== null)
                                            .sort((a, b) => {
                                                if (a.completedAt && b.completedAt) {
                                                    return new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime();
                                                }
                                                return 0;
                                            })
                                            .map((achievement) => (
                                                <Grid
                                                    key={`${achievement.gameId}-${achievement.achievementId}`}
                                                    size={{ xs: 12, sm: 6, md: 6, lg: 4 }}
                                                >
                                                    <AchievementCard achievement={achievement} />
                                                </Grid>
                                            ))}

                                        {group.achievements
                                            .filter((achievement) => achievement.completedAt === null)
                                            .map((achievement) => (
                                                <Grid
                                                    key={`${achievement.gameId}-${achievement.achievementId}`}
                                                    size={{ xs: 12, sm: 6, md: 6, lg: 4 }}
                                                >
                                                    <AchievementCard achievement={achievement} />
                                                </Grid>
                                            ))}
                                    </Grid>
                                </AccordionDetails>
                            </Accordion>
                        ))
                    ) : (
                        <Box sx={{ textAlign: "center", py: 4 }}>
                            <Typography variant="body1" color="text.secondary">
                                No achievements unlocked yet
                            </Typography>
                        </Box>
                    )}
                </>
            )}
        </Paper>
    )
}
