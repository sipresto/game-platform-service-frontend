import { type PropsWithChildren, useEffect, useState, useCallback, useRef } from 'react';
import SecurityContext from './SecurityContext';
import { addAccessTokenToAuthHeader, removeAccessTokenFromAuthHeader } from '../services/auth';
import Keycloak, { type KeycloakError } from 'keycloak-js';
import type { KeycloakUser } from "../model/keycloakUser.ts";
import {attachAuthInterceptor} from "../services/axiosInstance.ts";

const getKeycloakConfig = () => {
    const kcPath = import.meta.env.VITE_KC_URL || '/auth';
    const baseUrl = window.location.origin;
    return {
        url: `${baseUrl}${kcPath}`,
        realm: import.meta.env.VITE_KC_REALM || 'game_platform',
        clientId: import.meta.env.VITE_KC_CLIENT_ID || 'game-platform',
    };
};

const createUserFromKeycloak = (
    keycloak: Keycloak,
    config: ReturnType<typeof getKeycloakConfig>
): KeycloakUser | undefined => {
    if (!keycloak.tokenParsed || !keycloak.authenticated) return undefined;

    const profile = keycloak.profile || {};
    const tokenParsed = keycloak.tokenParsed || {};
    const givenName = profile.firstName || tokenParsed.given_name || '';
    const familyName = profile.lastName || tokenParsed.family_name || '';
    const preferredUsername = profile.username || tokenParsed.preferred_username || '';
    const email = profile.email || tokenParsed.email;

    const name = givenName && familyName
        ? `${givenName} ${familyName}`
        : profile.username || tokenParsed.name || tokenParsed.preferred_username || 'Unknown KeycloakUser';

    const realmRoles = tokenParsed.realm_access?.roles ?? [];
    const clientRoles = tokenParsed.resource_access?.[config.clientId]?.roles ?? [];

    return {
        name,
        username: preferredUsername,
        email: email || '',
        roles: [...realmRoles, ...clientRoles],
        accessToken: keycloak.token || '',
        idToken: keycloak.idToken || '',
        profile: {
            keycloakId: tokenParsed.sub || '',
            username: preferredUsername,
            email: email || '',
            name: name,
            firstName: givenName,
            lastName: familyName,
            roles: [...realmRoles, ...clientRoles],
            displayName: name,
            profile_visibility: 'PUBLIC'
        }
    };
};

export default function SecurityContextProvider({ children }: PropsWithChildren) {
    const [loggedInUser, setLoggedInUser] = useState<KeycloakUser | undefined>(undefined);
    const [isInitialised, setIsInitialised] = useState(false);
    const [keycloakInstance, setKeycloakInstance] = useState<Keycloak | null>(null);
    const initRef = useRef(false);
    const configRef = useRef(getKeycloakConfig());

    const login = useCallback(() => {
        if (keycloakInstance) {
            console.log('Starting login process...');
            keycloakInstance.login({
                redirectUri: window.location.origin + '/store'
            });
        } else {
            console.error('Keycloak instance not available');
        }
    }, [keycloakInstance]);

    const logout = useCallback(() => {
        if (keycloakInstance) {
            console.log('Starting logout process...');
            setLoggedInUser(undefined);
            removeAccessTokenFromAuthHeader();
            keycloakInstance.logout({
                redirectUri: window.location.origin + '/store'
            });
        } else {
            console.error('Keycloak instance not available');
        }
    }, [keycloakInstance]);

    const isAuthenticated = useCallback(() => {
        return keycloakInstance?.authenticated ?? false;
    }, [keycloakInstance]);

    const refreshUserData = useCallback(async (forceTokenRefresh: boolean = false): Promise<void> => {
        if (!keycloakInstance || !keycloakInstance.authenticated) {
            console.warn('Cannot refresh user data: not authenticated');
            return;
        }

        try {
            console.log('Starting user data refresh, forceTokenRefresh:', forceTokenRefresh);

            if (forceTokenRefresh) {
                const tokenRefreshed = await keycloakInstance.updateToken(-1);
                console.log('Token force refresh result:', tokenRefreshed);
                if (tokenRefreshed && keycloakInstance.token) {
                    addAccessTokenToAuthHeader(keycloakInstance.token);
                }
            }

            await keycloakInstance.loadUserProfile();
            console.log('KeycloakUser profile loaded from Keycloak server');

            const updatedUser = createUserFromKeycloak(keycloakInstance, configRef.current);
            if (updatedUser) {
                setLoggedInUser(updatedUser);
                console.log('KeycloakUser data refreshed and state updated');
            }
        } catch (error: unknown) {
            console.error('Failed to refresh user data:', error);
            if (forceTokenRefresh) {
                console.log('Token refresh failed, forcing login...');
                login();
            }
        }
    }, [keycloakInstance, login]);

    useEffect(() => {
        if (initRef.current) return;
        initRef.current = true;

        const initKeycloak = async () => {
            try {
                const config = configRef.current;
                console.log('Initializing Keycloak with config:', config);
                const keycloak = new Keycloak(config);
                const authenticated = await keycloak.init({
                    onLoad: 'check-sso',
                    checkLoginIframe: false,
                    pkceMethod: 'S256',
                });

                console.log('Keycloak initialized, authenticated:', authenticated);
                if (authenticated && keycloak.token) {
                    addAccessTokenToAuthHeader(keycloak.token);
                    const user = createUserFromKeycloak(keycloak, config);
                    setKeycloakInstance(keycloak);
                    setLoggedInUser(user);
                } else {
                    setKeycloakInstance(keycloak);
                    setLoggedInUser(undefined);
                    removeAccessTokenFromAuthHeader();
                }

                setIsInitialised(true);
            } catch (error: unknown) {
                console.error('Keycloak initialization failed:', error);
                setLoggedInUser(undefined);
                removeAccessTokenFromAuthHeader();
                setIsInitialised(true);
            }
        };

        initKeycloak();
    }, []);

    useEffect(() => {
        if (keycloakInstance && refreshUserData) {
            attachAuthInterceptor(
                () => keycloakInstance,
                () => refreshUserData
            );
        }
    }, [keycloakInstance, refreshUserData]);

    useEffect(() => {
        if (keycloakInstance) {
            keycloakInstance.onTokenExpired = () => {
                console.log('Token expired, refreshing...')
                keycloakInstance.updateToken(60)
                    .then(refreshed => {
                        if (refreshed && keycloakInstance.token) {
                            addAccessTokenToAuthHeader(keycloakInstance.token)
                        }
                    })
                    .catch((error: KeycloakError) => {
                        console.error('Proactive token refresh failed:', error)
                    })
            }

            keycloakInstance.onAuthError = (errorData: KeycloakError) => {
                console.error('Keycloak auth error:', errorData)
                login()
            }

            keycloakInstance.onAuthLogout = () => {
                console.log('Keycloak logged out')
                setLoggedInUser(undefined)
                removeAccessTokenFromAuthHeader()
            }
        }
    }, [keycloakInstance, login])

    return (
        <SecurityContext.Provider value={{
            isInitialised,
            isAuthenticated,
            loggedInUser,
            login,
            logout,
            keycloakInstance,
            refreshUserData,
        }}>
            {children}
        </SecurityContext.Provider>
    );
}