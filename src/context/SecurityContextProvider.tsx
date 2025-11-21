import {type PropsWithChildren, useEffect, useState, useCallback} from 'react'
import SecurityContext from './SecurityContext'
import {addAccessTokenToAuthHeader} from '../services/auth'
import Keycloak from 'keycloak-js'
import type {User} from "../model/user.ts"

const getKeycloakConfig = () => {
    return {
        url: import.meta.env.VITE_KC_URL || 'http://localhost:8280',
        realm: import.meta.env.VITE_KC_REALM || 'game_platform',
        clientId: import.meta.env.VITE_KC_CLIENT_ID || 'game-platform',
    }
}

export default function SecurityContextProvider({children}: PropsWithChildren) {
    const [loggedInUser, setLoggedInUser] = useState<User | undefined>(undefined)
    const [isInitialised, setIsInitialised] = useState(false)
    const [keycloakInstance, setKeycloakInstance] = useState<Keycloak | null>(null)

    useEffect(() => {
        const initKeycloak = async () => {
            try {
                const config = getKeycloakConfig()
                console.log('Initializing Keycloak with config:', config)

                const keycloak = new Keycloak(config)
                setKeycloakInstance(keycloak)

                const authenticated = await keycloak.init({
                    onLoad: 'check-sso',
                    checkLoginIframe: false,
                    pkceMethod: 'S256',
                    scope: 'openid profile email', // Add more scopes
                })

                console.log('Keycloak initialized, authenticated:', authenticated)

                if (authenticated) {
                    addAccessTokenToAuthHeader(keycloak.token)
                    updateUserFromToken(keycloak)
                }

                setIsInitialised(true)

            } catch (error) {
                console.error('Keycloak initialization failed:', error)
                setIsInitialised(true)
            }
        }

        initKeycloak()
    }, [])

    const updateUserFromToken = (keycloak: Keycloak) => {
        if (!keycloak.tokenParsed) {
            setLoggedInUser(undefined)
            return
        }

        const name = keycloak.tokenParsed.given_name ||
            keycloak.tokenParsed.preferred_username ||
            keycloak.tokenParsed.name ||
            'Unknown User'

        const realmRoles = keycloak.tokenParsed.realm_access?.roles ?? []
        const clientRoles = keycloak.tokenParsed.resource_access?.[getKeycloakConfig().clientId]?.roles ?? []

        setLoggedInUser({
            name,
            roles: [...realmRoles, ...clientRoles],
            accessToken: keycloak.token,
            idToken: keycloak.idToken,
        })
    }

    const login = useCallback(() => {
        if (keycloakInstance) {
            console.log('Starting login process...')
            keycloakInstance.login({
                redirectUri: window.location.origin + window.location.pathname
            })
        } else {
            console.error('Keycloak instance not available')
        }
    }, [keycloakInstance])

    const isAuthenticated = useCallback(() => {
        return keycloakInstance?.authenticated ?? false
    }, [keycloakInstance])

    return (
        <SecurityContext.Provider value={{
            isInitialised,
            isAuthenticated,
            loggedInUser,
            login,
        }}>
            {children}
        </SecurityContext.Provider>
    )
}