import { Accordion, AccordionDetails, AccordionSummary, Box, Chip, Grid, Paper, Typography } from "@mui/material"
import { EmojiEvents as TrophyIcon, ExpandMore } from "@mui/icons-material"
import type { AchievementProgress } from "../../model/achievementProgress"
import { AchievementCard } from "./AchievementCard.tsx"
import { useGroupedAchievements } from "../../hooks/useGroupedAchievements.ts";

interface AchievementsSectionProps {
    achievements: AchievementProgress[]
    achievementsVisible: boolean
}

export function AchievementsSection({ achievements, achievementsVisible }: AchievementsSectionProps) {
    const groupedAchievements = useGroupedAchievements(achievements)
    const completedCount = achievements.filter(a => a.completedAt !== null).length

    return (
        <Paper elevation={ 1 } sx={ { p: 3, borderRadius: 2, flexGrow: 1 } }>
            <Box
                sx={ {
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 3,
                    pb: 2,
                    borderBottom: 1,
                    borderColor: "divider",
                } }
            >
                <Box sx={ { display: "flex", alignItems: "center", gap: 1 } }>
                    <TrophyIcon sx={ { fontSize: 28, color: "primary.main" } }/>
                    <Typography variant="h5" fontWeight={ 700 }>
                        Achievements
                    </Typography>
                </Box>
                <Chip
                    label={ `${ achievements.length === 0 ? "No achievements" : completedCount + " / " + achievements.length + " achievements" }` }
                    color="primary"
                />
            </Box>

            <>
                { Object.keys(groupedAchievements).length > 0 ? (
                    Object.entries(groupedAchievements).map(([gameId, group]) => (
                        <Accordion key={ gameId } sx={ { mb: 2 } }>
                            <AccordionSummary
                                expandIcon={ <ExpandMore/> }
                                aria-controls={ `panel-${ gameId }-content` }
                                id={ `panel-${ gameId }-header` }
                            >
                                <Box sx={ { display: "flex", alignItems: "center", gap: 2, width: "100%" } }>
                                    <Typography variant="h6">{ group.gameName }</Typography>
                                    <Chip
                                        label={ `${ group.achievements.filter((a) => a.completedAt !== null).length } / ${ group.achievements.length } achievements` }
                                        color="primary"
                                        size="small"
                                    />
                                </Box>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Grid container spacing={ 2 }>
                                    { group.achievements.map((achievement) => (
                                        <Grid
                                            key={ `${ achievement.gameId }-${ achievement.achievementId }` }
                                            size={ { xs: 12, sm: 6, md: 6, lg: 4 } }
                                        >
                                            <AchievementCard achievement={ achievement }/>
                                        </Grid>
                                    )) }
                                </Grid>
                            </AccordionDetails>
                        </Accordion>
                    ))
                ) : (
                    achievementsVisible ?
                    <Box sx={ { textAlign: "center", py: 4 } }>
                        <Typography variant="body1" color="text.secondary">
                            No achievements unlocked yet
                        </Typography>
                    </Box>
                        :
                        <Box sx={ { textAlign: "center", py: 4 } }>
                            <Typography variant="body1" color="text.secondary">
                                This user's achievements are not visible
                            </Typography>
                        </Box>
                ) }
            </>
        </Paper>
    )
}