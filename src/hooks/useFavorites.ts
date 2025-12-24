import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { LibraryGame } from "../model/game";
import { favoriteGame, unfavoriteGame } from "../services/favoritesApi.ts";

export function useToggleFavoriteGame() {
    const queryClient = useQueryClient();

    const { mutate: toggleFavorite, isPending, isError, error } = useMutation({
        mutationFn: async (game: LibraryGame & { isFavorited: boolean }) => {
            if (game.isFavorited) {
                await unfavoriteGame(game.gameId);
            } else {
                await favoriteGame(game.gameId);
            }
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['myOwnedGames'] });
        },
    });

    return {
        toggleFavorite,
        isPending,
        isError,
        error,
    };
}
