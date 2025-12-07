import apiClient from './axiosInstance';

interface AuthHeaders {
    Authorization?: string;
}

export function addAccessTokenToAuthHeader(token: string | undefined): void {
    if (token && token.trim().length > 0) {
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        removeAccessTokenFromAuthHeader();
    }
}

export function removeAccessTokenFromAuthHeader(): void {
    const headers = apiClient.defaults.headers.common as AuthHeaders;
    delete headers.Authorization;
}