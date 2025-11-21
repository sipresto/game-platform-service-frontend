import {type PropsWithChildren, useContext, useEffect, useState} from 'react'
import SecurityContext from '../context/SecurityContext.ts'
import { useLocation } from 'react-router'

export function RouteGuard({children}: PropsWithChildren) {
    const {isInitialised, isAuthenticated, login} = useContext(SecurityContext)
    const [loginTriggered, setLoginTriggered] = useState(false)
    const location = useLocation()

    useEffect(() => {
        if (isInitialised && !isAuthenticated() && !loginTriggered) {
            console.log('RouteGuard: Not authenticated, initiating login...')
            setLoginTriggered(true)
            setTimeout(() => {
                login()
            }, 50)
        }
    }, [isInitialised, isAuthenticated, login, loginTriggered, location])

    if (!isInitialised) {
        return <div>Initializing authentication...</div>
    }

    if (!isAuthenticated() && loginTriggered) {
        return <div>Redirecting to login...</div>
    }

    if (!isAuthenticated()) {
        return <div>Checking authentication...</div>
    }

    return children
}