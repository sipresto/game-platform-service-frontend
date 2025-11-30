export interface User {
    name: string;
    username: string;
    email?: string;
    roles?: string[];
    accessToken?: string;
    idToken?: string;
    profile: {
        userId: string;
        username: string;
        email?: string;
        name: string;
        firstName?: string;
        lastName?: string;
        roles?: string[];
        displayName?: string;
        bio?: string;
    };
}