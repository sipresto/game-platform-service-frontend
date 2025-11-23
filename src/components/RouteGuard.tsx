import {type PropsWithChildren, useContext, useEffect, useRef} from 'react'
import SecurityContext from '../context/SecurityContext.ts'

export function RouteGuard({children}: PropsWithChildren) {
    const {isInitialised, isAuthenticated, login} = useContext(SecurityContext)
    const loginTriggeredRef = useRef(false)

    useEffect(() => {
        if (isInitialised && !isAuthenticated() && !loginTriggeredRef.current) {
            loginTriggeredRef.current = true
            console.log('RouteGuard: Not authenticated, initiating login...')
            login()
        }
    }, [isInitialised, isAuthenticated, login])

    if (!isInitialised) {
        return <div>Loading...</div>
    }

    if (!isAuthenticated()) {
        return null
    }

    return <>{children}</>
}