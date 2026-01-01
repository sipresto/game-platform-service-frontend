import { useState } from 'react';
import { usePerks, useUserPoints, usePurchasePerk, useEquipPerk, useUnequipPerk } from "./usePerks.ts";

interface SnackbarState {
    open: boolean;
    message: string;
    severity: 'success' | 'error';
}

export function usePerkShop() {
    const { perks, isLoading: perksLoading, error: perksError } = usePerks();
    const { points: userPoints, isLoading: pointsLoading } = useUserPoints();
    const { buyPerk } = usePurchasePerk();
    const { equipPerk } = useEquipPerk();
    const { unequipPerk } = useUnequipPerk();

    const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
    const [actionType, setActionType] = useState<'buying' | 'equipping' | 'unequipping' | null>(null);

    const [snackbar, setSnackbar] = useState<SnackbarState>({
        open: false,
        message: '',
        severity: 'success'
    });

    const handleAction = (
        perkId: string,
        type: 'buying' | 'equipping' | 'unequipping',
        actionFn: (id: string, options: { onSuccess: () => void; onError: (err: Error) => void }) => void,
        successMessage: string
    ) => {
        setActionLoadingId(perkId);
        setActionType(type);

        actionFn(perkId, {
            onSuccess: () => {
                setSnackbar({ open: true, message: successMessage, severity: 'success' });
                setActionLoadingId(null);
                setActionType(null);
            },
            onError: (error) => {
                setSnackbar({ open: true, message: `${type} failed: ${error.message}`, severity: 'error' });
                setActionLoadingId(null);
                setActionType(null);
            }
        });
    };

    const purchasePerk = (perkId: string) =>
        handleAction(perkId, 'buying', buyPerk, 'Perk purchased successfully!');

    const equipPerkHandler = (perkId: string) =>
        handleAction(perkId, 'equipping', equipPerk, 'Perk equipped successfully!');

    const unequipPerkHandler = (perkId: string) =>
        handleAction(perkId, 'unequipping', unequipPerk, 'Perk unequipped successfully!');

    const closeSnackbar = () => setSnackbar(prev => ({ ...prev, open: false }));

    return {
        perks,
        userPoints,
        isLoading: perksLoading || pointsLoading,
        error: perksError,

        purchasePerk,
        equipPerk: equipPerkHandler,
        unequipPerk: unequipPerkHandler,
        closeSnackbar,

        snackbar,
        purchasingPerkId: actionType === 'buying' ? actionLoadingId : null,
        equippingPerkId: actionType === 'equipping' ? actionLoadingId : null,
        unequippingPerkId: actionType === 'unequipping' ? actionLoadingId : null,
    };
}