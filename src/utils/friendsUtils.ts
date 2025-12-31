import type { PublicUserProfile } from '../model/userProfile';

export function filterAndSortFriends(
    friends: PublicUserProfile[],
    searchTerm: string
): PublicUserProfile[] {
    let result = [...friends];

    if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        result = result.filter(friend => {
            const displayName = friend.profile?.displayName?.toLowerCase() || '';
            const username = friend.username.toLowerCase();
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