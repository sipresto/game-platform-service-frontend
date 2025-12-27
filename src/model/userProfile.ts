export type Visibility = 'PRIVATE' | 'FRIENDS_ONLY' | 'PUBLIC';

export type VisibleField =
    | 'PROFILE'
    | 'POINTS'
    | 'FAVORITE_GAMES'
    | 'OWNED_GAMES'
    | 'FRIENDS_LIST';

export interface VisibilitySettings {
    fieldVisibilities: Record<VisibleField, Visibility>;
}

export interface UserProfile {
    id: string;
    keycloakId: string;
    username: string;
    email: string;
    profile: {
        displayName: string;
        bio?: string;
    };
    visibilitySettings: VisibilitySettings;
    points: number;
    incomingFriendRequests: {
        senderId: string;
        createdAt: string;
    }[];
    friends: string[];
    outgoingFriendRequests: {
        receiverId: string;
        createdAt: string;
    }[];
    ownedGames: string[];
    favoriteGames: string[];
}

export interface PublicUserProfile {
    id: string;
    username: string;
    profile: {
        displayName: string;
        bio?: string;
        hasProfileImage?: boolean;
    };
    points?: number;
    favoriteGames?: string[];
    ownedGames?: string[];
    friends?: string[];
    keycloakId: string;
}

export interface ProfileUpdateData {
    username: string;
    firstName: string;
    lastName: string;
    displayName: string;
    bio: string;
}

export interface FieldVisibilityUpdateData {
    field: VisibleField;
    visibility: Visibility;
}

export const defaultVisibilitySettings = (): VisibilitySettings => ({
    fieldVisibilities: {
        PROFILE: 'PUBLIC',
        POINTS: 'PUBLIC',
        FAVORITE_GAMES: 'PUBLIC',
        OWNED_GAMES: 'FRIENDS_ONLY',
        FRIENDS_LIST: 'FRIENDS_ONLY',
    }
});

export const createVisibilityTemplate = (template: Visibility): VisibilitySettings => ({
    fieldVisibilities: {
        PROFILE: 'PUBLIC',
        POINTS: template,
        FAVORITE_GAMES: template,
        OWNED_GAMES: template,
        FRIENDS_LIST: template,
    }
});

export const getFieldVisibility = (
    settings: VisibilitySettings,
    field: VisibleField
): Visibility => {
    return settings.fieldVisibilities[field];
};

export const getAllFields = (): VisibleField[] => [
    'PROFILE',
    'POINTS',
    'FAVORITE_GAMES',
    'OWNED_GAMES',
    'FRIENDS_LIST'
];

export const getMostRestrictiveVisibility = (settings: VisibilitySettings): Visibility => {
    const visibilities = Object.values(settings.fieldVisibilities);
    if (visibilities.some(v => v === 'PRIVATE')) return 'PRIVATE';
    if (visibilities.some(v => v === 'FRIENDS_ONLY')) return 'FRIENDS_ONLY';
    return 'PUBLIC';
};

export const hasUniformVisibility = (settings: VisibilitySettings): boolean => {
    const fields = getAllFields().filter(f => f !== 'PROFILE');
    const visibilities = fields.map(f => settings.fieldVisibilities[f]);
    return visibilities.every(v => v === visibilities[0]);
};