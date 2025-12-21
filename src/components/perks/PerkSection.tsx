import { Box, Typography, Divider, Grid } from '@mui/material';
import { getPerkTypeConfig } from '../../utils/perkUtils';
import PerkCard from './PerkCard';
import type { Perk } from '../../model/perk';

interface PerkSectionProps {
    type: string;
    perks: Perk[];
}

export default function PerkSection({ type, perks }: PerkSectionProps) {
    const typeConfig = getPerkTypeConfig(type);
    const Icon = typeConfig.icon;

    return (
        <Box sx={{ mb: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <Icon sx={{ fontSize: 32, color: typeConfig.color }} />
                <Typography variant="h4" component="h2">
                    {typeConfig.title}
                </Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={3} alignItems="stretch">
                {perks.map((perk) => (
                    <Grid
                        key={perk.perkId}
                        size={{ xs: 12, sm: 6, md: 3 }}
                    >
                        <PerkCard perk={perk} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}