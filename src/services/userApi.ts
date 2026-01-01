import apiClient from './axiosInstance';
import type {
    BlockedUser,
    PublicUserProfile,
    UserProfile,
    Visibility,
    VisibilitySettings,
    VisibleField
} from "../model/userProfile";

const BACKEND_URL: string = import.meta.env.VITE_BACKEND_URL + "/users";

export async function getUserProfile(): Promise<UserProfile> {
    const {data} = await apiClient.get<UserProfile>(`${BACKEND_URL}/me`);
    return data;
}

export async function getUser(id: string): Promise<PublicUserProfile> {
    const {data} = await apiClient.get<PublicUserProfile>(`${BACKEND_URL}/${id}`);
    return data;
}

export async function updateUserProfile(profileData: {
    displayName: string;
    bio: string
}): Promise<void> {
    await apiClient.put(
        `${BACKEND_URL}/profile`,
        profileData
    );
}

export async function getVisibilitySettings(): Promise<VisibilitySettings> {
    const {data} = await apiClient.get<VisibilitySettings>(
        `${BACKEND_URL}/privacy/settings`
    );
    return data;
}

export async function updateGlobalVisibility(visibility: Visibility): Promise<void> {
    await apiClient.put(
        `${BACKEND_URL}/privacy`,
        `"${visibility}"`,
        {
            headers: {
                'Content-Type': 'application/json',
            },
        }
    );
}

export async function updateFieldVisibility(
    field: VisibleField,
    visibility: Visibility
): Promise<void> {
    await apiClient.put(
        `${BACKEND_URL}/privacy/fields`,
        null,
        {
            params: {
                field,
                visibility
            }
        }
    );
}

export async function getPublicUsers(): Promise<PublicUserProfile[]> {
    const {data} = await apiClient.get<PublicUserProfile[]>(`${BACKEND_URL}`);
    return data;
}

export async function getFriendsList(): Promise<PublicUserProfile[]> {
    const {data} = await apiClient.get<PublicUserProfile[]>(`${BACKEND_URL}/friends`);
    return data;
}

export async function uploadProfileImage(file: File): Promise<void> {
    const formData = new FormData();
    formData.append('image', file);
    await apiClient.put(
        `${BACKEND_URL}/me/profile-image`,
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }
    );
}

export async function removeProfileImage(): Promise<void> {
    await apiClient.delete(`${BACKEND_URL}/me/delete/profile-image`);
}

export async function getProfileImageUrl(userId: string): Promise<string> {
    return `${BACKEND_URL}/profile-image/${userId}`;
}

export async function sendFriendRequest(receiverId: string): Promise<void> {
    await apiClient.post(
        `${BACKEND_URL}/${receiverId}/send-friend-request`
    );
}

export async function acceptFriendRequest(senderId: string): Promise<void> {
    await apiClient.put(`${BACKEND_URL}/${senderId}/friend-request/accept`);
}

export async function rejectFriendRequest(senderId: string): Promise<void> {
    await apiClient.put(`${BACKEND_URL}/${senderId}/friend-request/reject`);
}

export async function removeFriend(friendId: string): Promise<void> {
    await apiClient.patch(`${BACKEND_URL}/${friendId}/remove`);

}

export async function blockUser(userId: string): Promise<void> {
    await apiClient.patch(`${BACKEND_URL}/${userId}/block`);

}

export async function unblockUser(userId: string): Promise<void> {
    await apiClient.patch(`${BACKEND_URL}/${userId}/unblock`);

}

export async function getBlockedUsers(): Promise<BlockedUser[]> {
    const { data } = await apiClient.get<BlockedUser[]>(`${BACKEND_URL}/blocked`);
    return data;
}