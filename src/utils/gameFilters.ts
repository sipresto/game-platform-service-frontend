import type { LibraryGame } from "../model/game.ts";

export function filterAndSortLibraryGames(
    games: LibraryGame[],
    searchText: string
): LibraryGame[] {
    let result = games;

    if (searchText) {
        const lower = searchText.toLowerCase();
        result = result.filter(game =>
            game.name.toLowerCase().includes(lower)
        );
    }

    return [...result].sort((a, b) => {
        if (a.isFavorited === b.isFavorited) return 0;
        return a.isFavorited ? -1 : 1;
    });
}