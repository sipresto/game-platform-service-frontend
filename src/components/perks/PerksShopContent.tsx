import {
    Paper,
    Typography,
    Box,
    Alert,
    CircularProgress,
    Snackbar,
} from '@mui/material';
import { groupPerksByType } from '../../utils/perkUtils';
import PerkSection from './PerkSection';
import {usePerkShop} from "../../hooks/usePerkShop.ts";

export default function PerksShopContent() {
    const {
        perks,
        userPoints,
        isLoading,
        error,
        purchasePerk,
        equipPerk,
        unequipPerk,
        closeSnackbar,
        snackbar,
        purchasingPerkId,
        equippingPerkId,
        unequippingPerkId
    } = usePerkShop();

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

    const groupedPerks = groupPerksByType(perks || []);
    const perkTypes = ['BORDER', 'TITLE', 'THEME'];

    return (
        <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4" fontWeight={600}>
                    Perk Shop
                </Typography>
                <Paper sx={{ px: 2, py: 1, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                        Points: {userPoints ?? 0}
                    </Typography>
                </Paper>
            </Box>

            <Paper sx={{ p: 3 }}>
                {perkTypes.map((type) => {
                    const perksForType = groupedPerks[type] || [];
                    if (perksForType.length === 0) return null;

                    return (
                        <PerkSection
                            key={type}
                            type={type}
                            perks={perksForType}
                            userPoints={userPoints ?? 0}
                            onPurchase={purchasePerk}
                            onEquip={equipPerk}
                            onUnequip={unequipPerk}
                            purchasingPerkId={purchasingPerkId}
                            equippingPerkId={equippingPerkId}
                            unequippingPerkId={unequippingPerkId}
                        />
                    );
                })}
            </Paper>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={closeSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={closeSnackbar}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
}