import type { UserProfile } from './userProfile';

export interface User {
    accessToken?: string;
    idToken?: string;
    refreshToken?: string;

    profile?: UserProfile;

    name?: string;
    username?: string;
    email?: string;
    roles?: string[];
}
