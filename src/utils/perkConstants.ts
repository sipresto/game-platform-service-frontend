import type {SxProps, Theme} from '@mui/material';

// --- BORDERS ---
export const BORDER_STYLES: Record<string, SxProps<Theme>> = {
    // Golden Frame
    'a7f3e4c2-8b91-4d5a-9f2e-1c3b5d7e9a4f': {
        border: '4px solid #FFD700',
        boxShadow: '0 0 15px rgba(255, 215, 0, 0.6)',
    },
    // Silver Edge
    'b2d8f1a9-3c4e-4a7b-8d1f-2e5a6c8b9d0e': {
        border: '4px solid #C0C0C0',
        boxShadow: '0 0 10px rgba(192, 192, 192, 0.4)',
    },
    // Burning Edges (Animated Pulse)
    'd4f7b3e9-2a5c-4d8f-9b1e-3c6a7d9f0b2e': {
        border: '4px solid #FF4500',
        boxShadow: '0 0 20px #FF4500',
        animation: 'pulse-red 2s infinite',
        '@keyframes pulse-red': {
            '0%': { boxShadow: '0 0 0 0 rgba(255, 69, 0, 0.7)' },
            '70%': { boxShadow: '0 0 0 10px rgba(255, 69, 0, 0)' },
            '100%': { boxShadow: '0 0 0 0 rgba(255, 69, 0, 0)' },
        },
    },
    // Frozen Frame
    'e1a8c5f2-4b9d-4e7a-8c2f-5d9b1e3a6c8f': {
        border: '4px solid #00FFFF',
        boxShadow: '0 0 15px #00FFFF',
    },
    // Rainbow Prism (Gradient Border)
    'f3b9d2e7-5c8a-4f1b-9d4e-2a7c6f8b0d3e': {
        border: '4px solid transparent',
        background: 'linear-gradient(white, white) padding-box, linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet) border-box',
        boxShadow: '0 0 15px rgba(255, 0, 255, 0.5)',
    },
    // Shadow Realm
    'c2f9d4a7-5b8e-4c3a-9f1d-2e6b7a8c0d5f': {
        border: '4px solid #333',
        boxShadow: '0 0 20px rgba(0, 0, 0, 0.8)',
    }
};

// --- TITLES ---
export const TITLE_LABELS: Record<string, string> = {
    'e4b8d2f9-3a7c-4e5b-9d1f-2c6a8f0b3e7d': 'Master Strategist',
    'c8f2d9a4-3b5e-4c7a-9d2f-5e8a1b6c0d4f': 'Night Owl',
    'd5a9f3c7-2e8b-4d4f-8a1c-6b9e3d0f5a7c': 'Speed Demon',
    'e2c8f4a9-5d7b-4e3c-9a6f-1b4d8e0c2f5a': 'Grand Tactician',
    'f9b3d7e2-4a8c-4f5d-8b1e-3c7a6f9d0b2e': 'Living Legend',
    'a4e8c2f9-3d7b-4a5c-9f2e-1b6d8a0c4f7e': 'Rising Star',
    'd9a5f2c8-3e7d-4b4a-8f1c-6d9b2e5a0c3f': 'Comeback Kid',
    'f8b2d4c9-5a7e-4f3b-8d6a-1c9e5f0b2d7a': 'The Analyst',
};

// --- THEMES ---
export interface ThemeStyleConfig {
    background: string;
    color: string;
    accentColor: string;
    secondaryTextColor?: string;
}

export const THEME_STYLES: Record<string, ThemeStyleConfig> = {
    // Dark Mode
    'a6d9f3c8-4e7b-4a2d-9f5c-1b8e6a0d3f7c': {
        background: 'linear-gradient(145deg, #3b3b3b 0%, #555555 100%)',
        color: '#FFD700',
        accentColor: '#FFD700',
        secondaryTextColor: '#C0C0C0',
    },
    // Ocean Depths
    'b2e8a7f4-3c9d-4b5e-8f1a-6d9c2e0b4f7a': {
        background: 'linear-gradient(180deg, #001f3f 0%, #0077be 100%)',
        color: '#ffffff',
        accentColor: '#0077be',
        secondaryTextColor: '#e0e0e0',
    },
    // Sunset Vibes
    'c7f4d9a3-5b8e-4c2a-9d6f-2e5b8a1c0d4f': {
        background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)',
        color: '#2d2d2d',
        accentColor: '#ff6b95',
    }
};