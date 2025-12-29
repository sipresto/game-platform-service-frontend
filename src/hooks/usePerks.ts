import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Perk } from '../model/perk';
import { equipPerk, fetchPerks, getUserPoints, purchasePerk } from "../services/perkApi.ts";

export function usePerks() {
    const { data: perks, isLoading, error } = useQuery<Perk[]>({
        queryKey: ['perks'],
        queryFn: fetchPerks,
    });

    return {
        perks,
        isLoading,
        error
    };
}

export function useUserPoints() {
    const { data: points, isLoading, error } = useQuery<number>({
        queryKey: ['userPoints'],
        queryFn: getUserPoints,
    });

    return {
        points,
        isLoading,
        error
    };
}

export function usePurchasePerk() {
    const queryClient = useQueryClient();

    const { mutate: buyPerk, isPending, isError, error } = useMutation({
        mutationFn: (perkId: string) => purchasePerk(perkId),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['perks'] });
            await queryClient.invalidateQueries({ queryKey: ['userPoints'] });
        }
    });

    return { buyPerk, isPending, isError, error };
}

export function useEquipPerk() {
    const queryClient = useQueryClient();

    const { mutate: equipPerkMutation, isPending, isError, error } = useMutation({
        mutationFn: (perkId: string) => equipPerk(perkId),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['perks'] });
        }
    });

    return { equipPerk: equipPerkMutation, isPending, isError, error };
}
