export interface UserProfile {
    id: string;
    keycloakId: string;
    username: string;
    email?: string;
    name?: string;
    roles?: string[];
    visibility: 'PUBLIC' | 'FRIENDS_ONLY' | 'PRIVATE';
    profile?: {
        displayName?: string;
        bio?: string;
    };
    friendRequests: {
        senderId: string;
        createdAt: string;
    }[];
    friends: string[];
}

export interface ProfileUpdateData {
    username: string;
    firstName: string;
    lastName: string;
    displayName: string;
    bio: string;
    profile_visibility?: 'PUBLIC' | 'FRIENDS_ONLY' | 'PRIVATE';
}

export interface PrivacyUpdateData {
    profile_visibility: 'PUBLIC' | 'FRIENDS_ONLY' | 'PRIVATE';
}