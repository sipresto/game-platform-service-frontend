import axios, { AxiosError, type AxiosInstance, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
import type Keycloak from 'keycloak-js';

// Define proper types for the getter functions
type GetKeycloakInstance = () => Keycloak | null;
type RefreshUserData = (forceTokenRefresh?: boolean) => Promise<void>;
type GetRefreshUserData = () => RefreshUserData;

// Create the axios instance
const apiClient: AxiosInstance = axios.create({
    timeout: 10000,
    withCredentials: true,
});

// Module-level state for the interceptor
let getKeycloakInstance: GetKeycloakInstance | null = null;
let getRefreshUserData: GetRefreshUserData | null = null;

// Define a custom type for the request config with our retry flag
interface RetryableAxiosRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

// Response interceptor for handling 401 errors
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
                        // Update default headers for future requests
                        apiClient.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

                        // Update the failed request's headers
                        originalRequest.headers = originalRequest.headers || {};
                        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;

                        // Retry the original request
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

// Function to attach the interceptor with proper context access
export function attachAuthInterceptor(
    keycloakGetter: GetKeycloakInstance,
    refreshUserDataGetter: GetRefreshUserData
): void {
    // Store the getter functions
    getKeycloakInstance = keycloakGetter;
    getRefreshUserData = refreshUserDataGetter;

    // Attach the interceptor if not already attached
    apiClient.interceptors.response.use(
        (response: AxiosResponse) => response,
        responseInterceptor
    );
}

export default apiClient;