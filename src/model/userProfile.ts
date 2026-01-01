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
    equippedBorderId?: string | null;
    equippedTitleId?: string | null;
    equippedThemeId?: string | null;
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
    equippedBorderId?: string | null;
    equippedTitleId?: string | null;
    equippedThemeId?: string | null;
}

export interface ProfileUpdateData {
    username: string;
    firstName: string;
    lastName: string;
    displayName: string;
    bio: string;
}

export const getAllFields = (): VisibleField[] => [
    'PROFILE',
    'POINTS',
    'FAVORITE_GAMES',
    'OWNED_GAMES',
    'FRIENDS_LIST'
];

export const hasUniformVisibility = (settings: VisibilitySettings): boolean => {
    const fields = getAllFields().filter(f => f !== 'PROFILE');
    const visibilities = fields.map(f => settings.fieldVisibilities[f]);
    return visibilities.every(v => v === visibilities[0]);
};