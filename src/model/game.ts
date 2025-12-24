export interface BaseGame {
    gameId: string;
    name: string;
    description: string;
    categories: string[];
    imageUrl?: string;
}

export interface Game extends BaseGame {
    rules: string;
    price: number;
}

export interface LibraryGame extends BaseGame {
    isFavorited: boolean;
}