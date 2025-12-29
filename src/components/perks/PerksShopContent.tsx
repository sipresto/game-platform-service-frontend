import {
    Paper,
    Typography,
    Box,
    Alert,
    CircularProgress,
    Snackbar,
} from '@mui/material';
import { useState } from 'react';
import { groupPerksByType } from '../../utils/perkUtils';
import PerkSection from './PerkSection';
import { usePerks, usePurchasePerk, useEquipPerk } from "../../hooks/usePerks.ts";

export default function PerksShopContent() {
    const { perks, isLoading, error } = usePerks();
    const { buyPerk } = usePurchasePerk();
    const { equipPerk } = useEquipPerk();

    const [purchasingPerkId, setPurchasingPerkId] = useState<string | null>(null);
    const [equippingPerkId, setEquippingPerkId] = useState<string | null>(null);
    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
        open: false,
        message: '',
        severity: 'success'
    });

    const handlePurchase = (perkId: string) => {
        setPurchasingPerkId(perkId);
        buyPerk(perkId, {
            onSuccess: () => {
                setSnackbar({ open: true, message: 'Perk purchased successfully!', severity: 'success' });
                setPurchasingPerkId(null);
            },
            onError: (error) => {
                setSnackbar({ open: true, message: `Purchase failed: ${error.message}`, severity: 'error' });
                setPurchasingPerkId(null);
            }
        });
    };

    const handleEquip = (perkId: string) => {
        setEquippingPerkId(perkId);
        equipPerk(perkId, {
            onSuccess: () => {
                setSnackbar({ open: true, message: 'Perk equipped successfully!', severity: 'success' });
                setEquippingPerkId(null);
            },
            onError: (error) => {
                setSnackbar({ open: true, message: `Equip failed: ${error.message}`, severity: 'error' });
                setEquippingPerkId(null);
            }
        });
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

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
                            onPurchase={handlePurchase}
                            onEquip={handleEquip}
                            purchasingPerkId={purchasingPerkId}
                            equippingPerkId={equippingPerkId}
                        />
                    );
                })}
            </Paper>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
}
