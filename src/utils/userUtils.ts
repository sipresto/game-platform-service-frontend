import type {BlockedUser, FriendRequest, PublicUserProfile} from "../model/userProfile.ts";

export const getProfileImageUrl = (userId: string, timestamp?: number): string | null => {
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string;
    if (!BACKEND_URL || !userId) return null;

    const url = `${BACKEND_URL}/users/profile-image/${userId}`;
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

export function filterUsers(
    publicUsers: PublicUserProfile[],
    friends: PublicUserProfile[],
    searchTerm: string
): PublicUserProfile[] {
    const userMap = new Map<string, PublicUserProfile>();

    publicUsers.forEach(user => {
        userMap.set(user.id, user);
    });

    friends.forEach(user => {
        if (!userMap.has(user.id)) {
            userMap.set(user.id, user);
        }
    });

    const allUsers = Array.from(userMap.values());

    if (!searchTerm.trim()) return allUsers;

    const term = searchTerm.toLowerCase();
    return allUsers.filter(user => {
        const displayName = user.profile?.displayName?.toLowerCase() || '';
        const username = user.username.toLowerCase();
        return displayName.includes(term) || username.includes(term);
    });
}

export function sortFriendRequestsByDate(requests: FriendRequest[]): FriendRequest[] {
    return [...requests].sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
}

export function filterAndSortBlockedUsers(
    users: BlockedUser[],
    searchTerm: string
): BlockedUser[] {
    let result = [...users];

    if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        result = result.filter(user => {
            const displayName = user.profile?.displayName?.toLowerCase() || '';
            const username = user.username.toLowerCase();
            return displayName.includes(term) || username.includes(term);
        });
    }

    result.sort((a, b) => {
        const nameA = (a.profile?.displayName || a.username).toLowerCase();
        const nameB = (b.profile?.displayName || b.username).toLowerCase();
        return nameA.localeCompare(nameB);
    });

    return result;
}