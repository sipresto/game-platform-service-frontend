import apiClient from './axiosInstance';
import type {
    UserProfile,
    PublicUserProfile,
    Visibility,
    VisibleField,
    VisibilitySettings,
    BlockedUser
} from "../model/userProfile";
import type { AxiosError } from "axios";

const BACKEND_URL: string = import.meta.env.VITE_BACKEND_URL + "/users";

export async function getUserProfile(): Promise<UserProfile> {
    const { data } = await apiClient.get<UserProfile>(`${BACKEND_URL}/me`);
    return data;
}

export async function getUser(id: string): Promise<PublicUserProfile> {
    const { data } = await apiClient.get<PublicUserProfile>(`${BACKEND_URL}/${id}`);
    return data;
}

export async function updateUserProfile(profileData: {
    displayName: string;
    bio: string
}): Promise<void> {
    try {
        await apiClient.put(
            `${BACKEND_URL}/profile`,
            profileData
        );
    } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error(`Failed to update profile: ${axiosError.response?.statusText || axiosError.message}`);
    }
}

export async function getVisibilitySettings(): Promise<VisibilitySettings> {
    const { data } = await apiClient.get<VisibilitySettings>(
        `${BACKEND_URL}/privacy/settings`
    );
    return data;
}

export async function updateGlobalVisibility(visibility: Visibility): Promise<void> {
    try {
        await apiClient.put(
            `${BACKEND_URL}/privacy`,
            `"${visibility}"`,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
    } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error(`Failed to update global visibility: ${axiosError.response?.statusText || axiosError.message}`);
    }
}

export async function updateFieldVisibility(
    field: VisibleField,
    visibility: Visibility
): Promise<void> {
    try {
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
    } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error(`Failed to update field visibility: ${axiosError.response?.statusText || axiosError.message}`);
    }
}

export async function getPublicUsers(): Promise<PublicUserProfile[]> {
    const { data } = await apiClient.get<PublicUserProfile[]>(`${BACKEND_URL}`);
    return data;
}

export async function getFriendsList(): Promise<PublicUserProfile[]> {
    const { data } = await apiClient.get<PublicUserProfile[]>(`${BACKEND_URL}/friends`);
    return data;
}

export async function uploadProfileImage(file: File): Promise<void> {
    const formData = new FormData();
    formData.append('image', file);

    try {
        await apiClient.put(
            `${BACKEND_URL}/me/profile-image`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
    } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error(`Failed to upload profile image: ${axiosError.response?.statusText || axiosError.message}`);
    }
}

export async function removeProfileImage(): Promise<void> {
    try {
        await apiClient.delete(`${BACKEND_URL}/me/delete/profile-image`);
    } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error(`Failed to remove profile image: ${axiosError.response?.statusText || axiosError.message}`);
    }
}

export async function getProfileImageUrl(userId: string): Promise<string> {
    return `${BACKEND_URL}/profile-image/${userId}`;
}

export async function sendFriendRequest(receiverId: string): Promise<void> {
    try {
        await apiClient.post(
            `${BACKEND_URL}/${receiverId}/send-friend-request`
        );
    } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error(`Failed to send friend request: ${axiosError.response?.statusText || axiosError.message}`);
    }
}

export async function acceptFriendRequest(senderId: string): Promise<void> {
    try {
        await apiClient.put(`${BACKEND_URL}/${senderId}/friend-request/accept`);
    } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error(`Failed to accept friend request: ${axiosError.response?.statusText || axiosError.message}`);
    }
}

export async function rejectFriendRequest(senderId: string): Promise<void> {
    try {
        await apiClient.put(`${BACKEND_URL}/${senderId}/friend-request/reject`);
    } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error(`Failed to reject friend request: ${axiosError.response?.statusText || axiosError.message}`);
    }
}

export async function removeFriend(friendId: string): Promise<void> {
    try {
        await apiClient.patch(`${BACKEND_URL}/${friendId}/remove`);
    } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error(`Failed to remove friend: ${axiosError.response?.statusText || axiosError.message}`);
    }
}

export async function blockUser(userId: string): Promise<void> {
    try {
        await apiClient.patch(`${BACKEND_URL}/${userId}/block`);
    } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error(`Failed to block user: ${axiosError.response?.statusText || axiosError.message}`);
    }
}

export async function unblockUser(userId: string): Promise<void> {
    try {
        await apiClient.patch(`${BACKEND_URL}/${userId}/unblock`);
    } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error(`Failed to unblock user: ${axiosError.response?.statusText || axiosError.message}`);
    }
}

export async function getBlockedUsers(): Promise<BlockedUser[]> {
    const { data } = await apiClient.get<BlockedUser[]>(`${BACKEND_URL}/blocked`);
    return data;
}