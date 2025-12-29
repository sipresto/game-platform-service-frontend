import axios, {
    AxiosError,
    type AxiosInstance,
    type AxiosResponse,
    type InternalAxiosRequestConfig
} from 'axios';
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

let isRefreshing = false;
let failedQueue: Array<{
    resolve: (token: string) => void,
    reject: (error: unknown) => void
}> = [];

const processQueue = (error: unknown, token: string | null = null): void => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else if (token) {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

const responseInterceptor = async (error: AxiosError): Promise<AxiosResponse> => {
    const originalRequest = error.config as RetryableAxiosRequestConfig;

    if (error.response?.status === 401 && originalRequest) {
        if (originalRequest._retry) {
            return Promise.reject(error);
        }

        if (isRefreshing) {
            return new Promise<string>((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            })
                .then((token: string) => {
                    originalRequest.headers = originalRequest.headers || {};
                    originalRequest.headers['Authorization'] = `Bearer ${token}`;
                    return apiClient(originalRequest);
                })
                .catch((err: unknown) => {
                    return Promise.reject(err);
                });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
            if (getKeycloakInstance && getRefreshUserData) {
                const keycloakInstance = getKeycloakInstance();
                const refreshUserData = getRefreshUserData();

                if (keycloakInstance && refreshUserData) {
                    await refreshUserData(true);
                    const newToken = keycloakInstance.token;

                    if (newToken) {
                        apiClient.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

                        processQueue(null, newToken);

                        originalRequest.headers = originalRequest.headers || {};
                        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;

                        return apiClient(originalRequest);
                    }
                }
            }
            new Error('Token refresh failed: Missing keycloak instance or refresh function');
        } catch (refreshError: unknown) {
            console.error('Failed to refresh token:', refreshError);
            processQueue(refreshError, null);

            if (getKeycloakInstance) {
                const keycloakInstance = getKeycloakInstance();
                keycloakInstance?.login();
            }

            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
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