export interface UserProfile {
    userId: string;
    username: string;
    email?: string;
    name?: string;
    roles?: string[];
    bio?: string;
}