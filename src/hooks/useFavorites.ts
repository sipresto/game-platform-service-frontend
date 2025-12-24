import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { LibraryGame } from "../model/game";
import { favoriteGame, unfavoriteGame } from "../services/favoritesApi.ts";
import { useCurrentUser } from "./useUserProfile.ts";

export function useToggleFavoriteGame() {
    const queryClient = useQueryClient();
    const { keycloakId: userId } = useCurrentUser();

    const { mutate: toggleFavorite, isPending, isError, error } = useMutation({
        mutationFn: async (game: LibraryGame & { isFavorited: boolean }) => {
            if (game.isFavorited) {
                await unfavoriteGame(game.gameId);
            } else {
                await favoriteGame(game.gameId);
            }
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['ownedGames', userId] });
        },
    });

    return {
        toggleFavorite,
        isPending,
        isError,
        error,
    };
}
