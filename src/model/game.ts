export interface Game {
    gameId: string;
    name: string;
    description: string;
    price?: number;
    categories: string[];
    imageUrl?: string;
}