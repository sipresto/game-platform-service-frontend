import {
    Paper,
    Typography,
    Box,
    Alert,
    CircularProgress,
} from '@mui/material';
import { groupPerksByType } from '../utils/perkUtils';
import PerkSection from '../components/perks/PerkSection';
import {usePerksData} from "../hooks/usePerks.ts";

export function PerksShopPage() {
    const { perks, isLoading, error } = usePerksData();

    if (isLoading) {
        return (
            <Box sx={{ width: '100%', py: 4, display: 'flex', justifyContent: 'center' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ width: '100%', p: { xs: 1, sm: 2, md: 3 } }}>
                <Alert severity="error">Error loading perks: {error.message}</Alert>
            </Box>
        );
    }

    const groupedPerks = groupPerksByType(perks);
    const perkTypes = ['BORDER', 'TITLE', 'THEME'];

    return (
        <Box sx={{ width: '100%', p: { xs: 1, sm: 2, md: 3 } }}>
            <Typography variant="h4" fontWeight={600} gutterBottom>
                Perk Shop
            </Typography>

            <Paper sx={{ p: 3 }}>
                {perkTypes.map((type) => {
                    const perksForType = groupedPerks[type] || [];
                    if (perksForType.length === 0) return null;

                    return (
                        <PerkSection
                            key={type}
                            type={type}
                            perks={perksForType}
                        />
                    );
                })}
            </Paper>
        </Box>
    );
}