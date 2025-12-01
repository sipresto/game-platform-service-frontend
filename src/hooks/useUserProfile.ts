import {useMutation, type UseMutationResult, useQuery, useQueryClient} from '@tanstack/react-query';
import {getUserProfile, updateUserProfile} from '../services/api';
import {useContext} from 'react';
import SecurityContext from '../context/SecurityContext';
import type {PrivacyUpdateData, ProfileUpdateData, UserProfile} from '../model/userProfile';
import {useKeycloakAccountService} from "../services/keycloakService.ts";
import {updateUserPrivacy} from "../services/userApi.ts";

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

export function useCurrentUser() {
    const { loggedInUser, isAuthenticated } = useContext(SecurityContext);

    return {
        userId: loggedInUser?.profile?.userId || '',
        token: loggedInUser?.accessToken,
        isAuthenticated: isAuthenticated() && !!loggedInUser?.profile?.userId,
        user: loggedInUser
    };
}

export function usePrivacySettings(): UseMutationResult<
    void,
    Error,
    PrivacyUpdateData
> {
    const queryClient = useQueryClient();
    const { userId, token } = useCurrentUser();

    return useMutation({
        mutationFn: async (privacyData: PrivacyUpdateData) => {
            if (!userId) {
                throw new Error('User ID not found. Please log in again.');
            }

            return await updateUserPrivacy(
                privacyData.profile_visibility,
                token ?? localStorage.getItem('accessToken')
            );
        },
        onMutate: async (newPrivacyData) => {
            await queryClient.cancelQueries({ queryKey: ['userProfile'] });
            const previousProfile = queryClient.getQueryData<UserProfile>(['userProfile']);

            if (previousProfile) {
                queryClient.setQueryData(['userProfile'], {
                    ...previousProfile,
                    visibility: newPrivacyData.profile_visibility,
                });
            }
            return { previousProfile };
        },
        onError: (err, _newPrivacyData, context) => {
            if (context?.previousProfile) {
                queryClient.setQueryData(['userProfile'], context.previousProfile);
            }
            console.error('Failed to update privacy settings:', err);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['userProfile'] });
        },
    });
}