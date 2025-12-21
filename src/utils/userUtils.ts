export const getProfileImageUrl = (userId: string, timestamp?: number): string | null => {
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string;
    if (!BACKEND_URL || !userId) return null;

    const url = `${BACKEND_URL}/users/${userId}/profile-image`;
    return timestamp ? `${url}?t=${timestamp}` : url;
};

export const getInitials = (name: string): string => {
    return name
        .split(' ')
        .map(part => part.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2);
};

export const getVisibilityInfo = (visibility: string) => {
    switch (visibility) {
        case 'PUBLIC': return { label: 'Public', color: 'success' as const };
        case 'FRIENDS_ONLY': return { label: 'Friends Only', color: 'warning' as const };
        case 'PRIVATE': return { label: 'Private', color: 'default' as const };
        default: return { label: 'Unknown', color: 'default' as const };
    }
};