import type { BlockedUser } from '../model/userProfile';

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