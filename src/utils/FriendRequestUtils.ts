import type {FriendRequest} from "../model/userProfile.ts";

export function sortFriendRequestsByDate(requests: FriendRequest[]): FriendRequest[] {
    return [...requests].sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
}