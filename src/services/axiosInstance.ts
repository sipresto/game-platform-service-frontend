import axios, { AxiosError, type AxiosInstance, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
import type Keycloak from 'keycloak-js';

type GetKeycloakInstance = () => Keycloak | null;
type RefreshUserData = (forceTokenRefresh?: boolean) => Promise<void>;
type GetRefreshUserData = () => RefreshUserData;

const apiClient: AxiosInstance = axios.create({
    timeout: 10000,
    withCredentials: true,
});

let getKeycloakInstance: GetKeycloakInstance | null = null;
let getRefreshUserData: GetRefreshUserData | null = null;

interface RetryableAxiosRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

const responseInterceptor = async (error: AxiosError): Promise<AxiosResponse> => {
    const originalRequest = error.config as RetryableAxiosRequestConfig;

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
            if (getKeycloakInstance && getRefreshUserData) {
                const keycloakInstance = getKeycloakInstance();
                const refreshUserData = getRefreshUserData();

                if (keycloakInstance && refreshUserData) {
                    await refreshUserData(true);
                    const newToken = keycloakInstance.token;

                    if (newToken && typeof newToken === 'string') {
                        apiClient.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

                        originalRequest.headers = originalRequest.headers || {};
                        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;

                        return apiClient(originalRequest);
                    }
                }
            }
        } catch (refreshError: unknown) {
            console.error('Failed to refresh token:', refreshError);
            return Promise.reject(refreshError);
        }
    }

    return Promise.reject(error);
};

export function attachAuthInterceptor(
    keycloakGetter: GetKeycloakInstance,
    refreshUserDataGetter: GetRefreshUserData
): void {
    getKeycloakInstance = keycloakGetter;
    getRefreshUserData = refreshUserDataGetter;

    apiClient.interceptors.response.use(
        (response: AxiosResponse) => response,
        responseInterceptor
    );
}

export default apiClient;