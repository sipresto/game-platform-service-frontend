import { Public, Group, Lock } from '@mui/icons-material';
import type {Visibility, VisibleField} from "./userProfile.ts";
import React from "react";

interface VisibilityConfig {
    label: string;
    description: string;
    icon: React.ElementType;
    color: 'success' | 'warning' | 'error';
}

interface FieldConfig {
    label: string;
    description: string;
}

export const visibilityConfig: Record<Visibility, VisibilityConfig> = {
    PUBLIC: {
        label: 'Public',
        description: 'Anyone can see this',
        icon: Public,
        color: 'success'
    },
    FRIENDS_ONLY: {
        label: 'Friends Only',
        description: 'Only your friends can see this',
        icon: Group,
        color: 'warning'
    },
    PRIVATE: {
        label: 'Private',
        description: 'Only you can see this',
        icon: Lock,
        color: 'error'
    }
};

export const fieldConfig: Record<VisibleField, FieldConfig> = {
    PROFILE: {
        label: 'Profile (Bio)',
        description: 'Your display name is always visible. This controls who can see your bio.'
    },
    POINTS: {
        label: 'Points',
        description: 'Your achievement points and gaming statistics.'
    },
    FAVORITE_GAMES: {
        label: 'Favorite Games',
        description: 'The list of games you\'ve marked as favorites.'
    },
    OWNED_GAMES: {
        label: 'Owned Games',
        description: 'The complete list of games in your library.'
    },
    FRIENDS_LIST: {
        label: 'Friends List',
        description: 'Who can see your friends and social connections.'
    }
};