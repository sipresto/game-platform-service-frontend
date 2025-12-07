export interface Game {
    gameId: string;
    name: string;
    description: string;
    rules: string;
    price?: number;
    categories: string[];
    imageUrl?: string;
}