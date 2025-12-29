import { type PropsWithChildren, useContext, useEffect } from 'react'
import SecurityContext from '../context/SecurityContext.ts'

export function RouteGuard({ children }: PropsWithChildren) {
    const { isInitialised, isAuthenticated, login } = useContext(SecurityContext)

    useEffect(() => {
        if (isInitialised && !isAuthenticated()) {
            console.log('RouteGuard: Not authenticated, initiating login...')
            login()
        }
    }, [isInitialised, isAuthenticated, login])

    if (!isInitialised) {
        return <div>Loading...</div>
    }

    return <>{children}</>
}