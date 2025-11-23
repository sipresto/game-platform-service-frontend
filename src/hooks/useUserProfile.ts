import { useQuery } from '@tanstack/react-query';
import { getUserProfile } from '../services/api';
import { useContext } from 'react';
import SecurityContext from '../context/SecurityContext';
import type { UserProfile } from '../model/userProfile';

export function useUserProfile() {
    const { loggedInUser } = useContext(SecurityContext);

    const token =
        loggedInUser?.accessToken ??
        loggedInUser?.idToken ??
        localStorage.getItem('accessToken');

    const query = useQuery<UserProfile, Error>({
        queryKey: ['userProfile'],
        queryFn: () => getUserProfile(token ?? null),
        enabled: !!token,
        staleTime: 1000 * 60 * 5,
        retry: 1,
    });

    return {
        ...query,
        profile: query.data,
    };
}
