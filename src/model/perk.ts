export interface Perk {
    perkId: string;
    name: string;
    description: string;
    pointCost: number;
    type: 'BORDER' | 'TITLE' | 'THEME';
    purchased: boolean;
    equipped: boolean;
}