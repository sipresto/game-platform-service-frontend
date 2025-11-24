import { createContext } from 'react'
import type { User } from "../model/user.ts"
import type { UserProfile } from "../model/userProfile.ts"

export type SecurityContextType = {
    isInitialised: boolean
    isAuthenticated: () => boolean
    loggedInUser: User | undefined
    login: () => void

    profile: UserProfile | undefined
    profileIsLoading: boolean
}

export default createContext<SecurityContextType>({
    isInitialised: false,
    isAuthenticated: () => false,
    loggedInUser: undefined,
    login: () => {
    },

    profile: undefined,
    profileIsLoading: true,
})