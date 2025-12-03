import apiClient from './axiosInstance';

export function addAccessTokenToAuthHeader(token: string | undefined): void {
    if (token) {
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        removeAccessTokenFromAuthHeader();
    }
}

export function removeAccessTokenFromAuthHeader(): void {
    delete apiClient.defaults.headers.common['Authorization'];
}
