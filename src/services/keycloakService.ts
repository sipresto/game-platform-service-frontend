import { useContext } from 'react';
import SecurityContext from '../context/SecurityContext';

export interface ApiError extends Error {
    status?: number;
    statusText?: string;
    response?: unknown;
}

export function useKeycloakAccountService() {
    const { keycloakInstance, loggedInUser, refreshUserData } = useContext(SecurityContext);

    const updateKeycloakAccount = async (
        username: string,
        email?: string,
        firstName?: string,
        lastName?: string
    ): Promise<void> => {
        if (!keycloakInstance || !loggedInUser) {
            const error: ApiError = new Error('Keycloak instance not available or user not logged in');
            error.status = 401;
            throw error;
        }
        try {
            const updated = await keycloakInstance.updateToken(30);
            if (updated) {
                console.log('Keycloak token was refreshed');
            }
            const keycloakUrl = keycloakInstance.authServerUrl;
            const realm = keycloakInstance.realm;
            const accountUpdatePayload = {
                username: username,
                firstName: firstName || '',
                lastName: lastName || '',
                email: email || loggedInUser.email || '',
            };
            const response = await fetch(
                `${keycloakUrl}/realms/${realm}/account`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${keycloakInstance.token}`,
                        'Accept': 'application/json',
                    },
                    body: JSON.stringify(accountUpdatePayload),
                }
            );
            if (!response.ok) {
                let errorMessage: string;
                try {
                    const errorData = await response.json() as { error?: string; message?: string };
                    errorMessage = errorData.error || errorData.message || 'Unknown error occurred';
                } catch {
                    errorMessage = await response.text() || 'Unknown error occurred';
                }
                const error: ApiError = new Error(errorMessage);
                error.status = response.status;
                error.statusText = response.statusText;
                try {
                    error.response = await response.json();
                } catch {
                    error.response = errorMessage;
                }
                throw error;
            }
            console.log('Keycloak account updated successfully on server');
            keycloakInstance.profile = {
                ...keycloakInstance.profile,
                username: username,
                firstName: firstName,
                lastName: lastName,
                email: email
            };
            await refreshUserData(true);
            console.log('Keycloak account update process completed');
        } catch (error) {
            console.error('Error updating Keycloak account:', error);
            if (error instanceof Error && !('status' in error)) {
                const apiError: ApiError = error as ApiError;
                apiError.status = 0;
                apiError.statusText = 'Network Error';
                throw apiError;
            }
            throw error;
        }
    };

    return {
        updateKeycloakAccount,
    };
}
