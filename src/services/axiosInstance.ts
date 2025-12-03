import axios from 'axios';
import { useContext } from 'react';
import SecurityContext from '../context/SecurityContext';

const apiClient = axios.create();

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const { keycloakInstance, refreshUserData } = useContext(SecurityContext);
                if (keycloakInstance && refreshUserData) {
                    await refreshUserData(true);
                    const newToken = keycloakInstance.token;
                    if (newToken) {
                        apiClient.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
                        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
                        return apiClient(originalRequest);
                    }
                }
            } catch (refreshError) {
                console.error('Failed to refresh token:', refreshError);
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;
