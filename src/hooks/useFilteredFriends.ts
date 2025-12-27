import { useMemo } from 'react';
import type { PublicUserProfile } from "../model/userProfile.ts";

export function useFilteredFriends(friends: PublicUserProfile[], search: string) {
    return useMemo(() => {
        if (!search) return [];
        const lowerSearch = search.toLowerCase();
        return friends.filter(f =>
            f.username.toLowerCase().includes(lowerSearch) ||
            f.profile?.displayName?.toLowerCase().includes(lowerSearch)
        );
    }, [friends, search]);
}