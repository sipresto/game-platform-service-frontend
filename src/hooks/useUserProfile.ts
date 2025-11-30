import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {getUserProfile, updateUserProfile} from '../services/api';
import {useContext} from 'react';
import SecurityContext from '../context/SecurityContext';
import type {ProfileUpdateData, UserProfile} from '../model/userProfile';
import {useKeycloakAccountService} from "../services/keycloakService.ts";

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

export function useUpdateProfile() {
    const queryClient = useQueryClient();
    const { updateKeycloakAccount } = useKeycloakAccountService();

    return useMutation({
        mutationFn: async (profileData: ProfileUpdateData) => {
            await updateKeycloakAccount(
                profileData.username,
                undefined,
                profileData.firstName,
                profileData.lastName
            );

            return await updateUserProfile({
                displayName: profileData.displayName,
                bio: profileData.bio
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['userProfile']});
        },
    });
}