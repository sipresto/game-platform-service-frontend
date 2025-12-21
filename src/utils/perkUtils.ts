import {
    BorderOuter,
    EmojiEvents,
    Palette
} from '@mui/icons-material';
import type { SvgIconComponent } from '@mui/icons-material';
import type { Perk } from '../model/perk';

export function groupPerksByType(perks: Perk[]): Record<string, Perk[]> {
    return perks.reduce((acc, perk) => {
        if (!acc[perk.type]) {
            acc[perk.type] = [];
        }
        acc[perk.type].push(perk);
        return acc;
    }, {} as Record<string, Perk[]>);
}

export interface PerkTypeConfig {
    title: string;
    icon: SvgIconComponent;
    color: string;
}

export function getPerkTypeConfig(type: string): PerkTypeConfig {
    const configs: Record<string, PerkTypeConfig> = {
        BORDER: {
            title: 'Profile Borders',
            icon: BorderOuter,
            color: '#ffd700'
        },
        TITLE: {
            title: 'Player Titles',
            icon: EmojiEvents,
            color: '#9c27b0'
        },
        THEME: {
            title: 'Profile Themes',
            icon: Palette,
            color: '#00bcd4'
        }
    };

    return configs[type] || {
        title: type,
        icon: BorderOuter,
        color: '#757575'
    };
}