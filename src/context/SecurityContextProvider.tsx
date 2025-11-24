import { type PropsWithChildren, useEffect, useState, useCallback, useRef, useMemo } from 'react'
import SecurityContext from './SecurityContext'
import { addAccessTokenToAuthHeader } from '../services/auth'
import Keycloak from 'keycloak-js'
import type { User } from "../model/user.ts"
import type { UserProfile} from "../model/userProfile.ts";
import { getUserProfile } from '../services/api'

declare global {
    interface Window {
        keycloakInstance?: Keycloak;
    }
}

const getKeycloakConfig = () => {
    const kcPath = import.meta.env.VITE_KC_URL || '/auth'
    const baseUrl = window.location.origin

    return {
        url: `${baseUrl}${kcPath}`,
        realm: import.meta.env.VITE_KC_REALM || 'game_platform',
        clientId: import.meta.env.VITE_KC_CLIENT_ID || 'game-platform',
    }
}

export default function SecurityContextProvider({ children }: PropsWithChildren) {
    const [loggedInUser, setLoggedInUser] = useState<User | undefined>(undefined)
    const [isInitialised, setIsInitialised] = useState(false)
    const [keycloakInstance, setKeycloakInstance] = useState<Keycloak | null>(null)
    const [profile, setProfile] = useState<UserProfile | undefined>(undefined);
    const [profileIsLoading, setProfileIsLoading] = useState(false);
    const initRef = useRef(false)

    useEffect(() => {
        if (initRef.current) return
        initRef.current = true

        const initKeycloak = async () => {
            try {
                const config = getKeycloakConfig()
                console.log('Initializing Keycloak with config:', config)

                const keycloak = new Keycloak(config)
                window.keycloakInstance = keycloak

                const authenticated = await keycloak.init({
                    onLoad: 'check-sso',
                    checkLoginIframe: false,
                    pkceMethod: 'S256',
                })

                console.log('Keycloak initialized, authenticated:', authenticated)

                if (authenticated && keycloak.token) {
                    addAccessTokenToAuthHeader(keycloak.token)

                    const name = keycloak.tokenParsed?.given_name ||
                        keycloak.tokenParsed?.preferred_username ||
                        keycloak.tokenParsed?.name ||
                        'Unknown User'

                    const realmRoles = keycloak.tokenParsed?.realm_access?.roles ?? []
                    const clientRoles = keycloak.tokenParsed?.resource_access?.[config.clientId]?.roles ?? []

                    setKeycloakInstance(keycloak)
                    setLoggedInUser({
                        name,
                        roles: [...realmRoles, ...clientRoles],
                        accessToken: keycloak.token,
                        idToken: keycloak.idToken,
                    })
                    setIsInitialised(true)
                } else {
                    setKeycloakInstance(keycloak)
                    setIsInitialised(true)
                }

            } catch (error) {
                console.error('Keycloak initialization failed:', error)
                setIsInitialised(true)
            }
        }

        initKeycloak()
    }, [])

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!isInitialised || !keycloakInstance?.authenticated) return;

            setProfileIsLoading(true);
            try {
                const userProfile = await getUserProfile();
                setProfile(userProfile as UserProfile);
            } catch (error) {
                console.error("Failed to fetch user profile (or create user):", error);
            } finally {
                setProfileIsLoading(false);
            }
        };

        if (isInitialised && keycloakInstance?.authenticated) {
            fetchUserProfile();
        }
    }, [isInitialised, keycloakInstance]);

    const login = useCallback(() => {
        if (keycloakInstance) {
            console.log('Starting login process...')
            keycloakInstance.login({
                redirectUri: window.location.href
            })
        } else {
            console.error('Keycloak instance not available')
        }
    }, [keycloakInstance])

    const isAuthenticated = useCallback(() => {
        return keycloakInstance?.authenticated ?? false
    }, [keycloakInstance])

    const contextValue = useMemo(() => ({
        isInitialised,
        isAuthenticated,
        loggedInUser,
        login,
        profile,
        profileIsLoading,
    }), [isInitialised, isAuthenticated, loggedInUser, login, profile, profileIsLoading]);

    return (
        <SecurityContext.Provider value={contextValue}>
            {children}
        </SecurityContext.Provider>
    )
}