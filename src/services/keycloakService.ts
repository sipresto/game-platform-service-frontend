import { useContext } from 'react';
import SecurityContext from '../context/SecurityContext';

interface KeycloakProfile {
    email?: string;
    firstName?: string;
    lastName?: string;
    username?: string;
}

interface KeycloakUpdateData {
    username: string;
    email: string;
    firstName: string;
    lastName: string;
}

export function useKeycloakAccountService() {
    const { keycloakInstance, loggedInUser } = useContext(SecurityContext);

    const updateKeycloakAccount = async (username: string, email?: string, firstName?: string, lastName?: string): Promise<void> => {
        if (!keycloakInstance || !loggedInUser) {
            throw new Error('Keycloak instance not available or user not logged in');
        }

        try {
            const updated = await keycloakInstance.updateToken(30);
            if (updated) {
                console.log('Keycloak token was refreshed');
            }

            await keycloakInstance.loadUserProfile();
            const currentProfile = keycloakInstance.profile as KeycloakProfile;

            const updateData: KeycloakUpdateData = {
                username: username,
                email: email || currentProfile?.email || loggedInUser.email || '',
                firstName: firstName || currentProfile?.firstName || loggedInUser.name?.split(' ')[0] || 'User',
                lastName: lastName || currentProfile?.lastName || loggedInUser.name?.split(' ').slice(1).join(' ') || ' '
            };

            console.log('Sending Keycloak update:', updateData);

            const response = await fetch(
                `${keycloakInstance.authServerUrl}/realms/${keycloakInstance.realm}/account`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${keycloakInstance.token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updateData),
                }
            );

            if (!response.ok) {
                const errorText = await response.text();
                new Error(`Account update failed: ${response.status} ${response.statusText} - ${errorText}`);
            }

            console.log('Keycloak account updated successfully');
        } catch (error) {
            console.error('Error updating Keycloak account:', error);
            throw new Error(`Failed to update account: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };

    return {
        updateKeycloakAccount,
    };
}