export interface UserProfile {
    id: string;
    keycloakId: string;
    username: string;
    email?: string;
    name?: string;
    roles?: string[];
    profile?: {
        displayName?: string;
        bio?: string;
    };
}

export interface ProfileUpdateData {
    username: string;
    firstName: string;
    lastName: string;
    displayName: string;
    bio: string;
}