import {type PropsWithChildren, useEffect, useState, useCallback, useRef} from 'react'
import SecurityContext from './SecurityContext'
import {addAccessTokenToAuthHeader, removeAccessTokenFromAuthHeader} from '../services/auth'
import Keycloak from 'keycloak-js'
import type {User} from "../model/user.ts"

const getKeycloakConfig = () => {
    const kcPath = import.meta.env.VITE_KC_URL || '/auth'
    const baseUrl = window.location.origin

    return {
        url: `${baseUrl}${kcPath}`,
        realm: import.meta.env.VITE_KC_REALM || 'game_platform',
        clientId: import.meta.env.VITE_KC_CLIENT_ID || 'game-platform',
    }
}

export default function SecurityContextProvider({children}: PropsWithChildren) {
    const [loggedInUser, setLoggedInUser] = useState<User | undefined>(undefined)
    const [isInitialised, setIsInitialised] = useState(false)
    const [keycloakInstance, setKeycloakInstance] = useState<Keycloak | null>(null)
    const initRef = useRef(false)

    useEffect(() => {
        if (initRef.current) return
        initRef.current = true

        const initKeycloak = async () => {
            try {
                const config = getKeycloakConfig()
                console.log('Initializing Keycloak with config:', config)

                const keycloak = new Keycloak(config)

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
                } else {
                    setKeycloakInstance(keycloak)
                    setLoggedInUser(undefined)
                    removeAccessTokenFromAuthHeader()
                }
                setIsInitialised(true)

            } catch (error) {
                console.error('Keycloak initialization failed:', error)
                setLoggedInUser(undefined)
                removeAccessTokenFromAuthHeader()
                setIsInitialised(true)
            }
        }

        initKeycloak()
    }, [])

    const login = useCallback(() => {
        if (keycloakInstance) {
            console.log('Starting login process...')
            keycloakInstance.login({
                redirectUri: window.location.origin + '/store'
            })
        } else {
            console.error('Keycloak instance not available')
        }
    }, [keycloakInstance])

    const logout = useCallback(() => {
        if (keycloakInstance) {
            console.log('Starting logout process...')
            setLoggedInUser(undefined)
            removeAccessTokenFromAuthHeader()

            keycloakInstance.logout({
                redirectUri: window.location.origin + '/store'
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
            logout,
        }}>
            {children}
        </SecurityContext.Provider>
    )
}