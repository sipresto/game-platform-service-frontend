import {useMutation, type UseMutationResult, useQuery, useQueryClient} from '@tanstack/react-query';
import {getUserProfile, updateUserProfile} from '../services/api';
import {useContext} from 'react';
import SecurityContext from '../context/SecurityContext';
import type {PrivacyUpdateData, ProfileUpdateData, UserProfile} from '../model/userProfile';
import {useKeycloakAccountService} from "../services/keycloakService.ts";
import {getFriendsList, getPublicUsers, updateUserPrivacy} from "../services/userApi.ts";

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

export function useUpdateProfile(): UseMutationResult<
    UserProfile,
    Error,
    ProfileUpdateData
> {
    const queryClient = useQueryClient();
    const { updateKeycloakAccount } = useKeycloakAccountService();

    return useMutation({
        mutationFn: async (profileData: ProfileUpdateData): Promise<UserProfile> => {
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
        onSuccess: (updatedProfile, variables) => {
            queryClient.setQueryData(['userProfile'], (old: UserProfile | undefined) => {
                if (!old) return updatedProfile;

                return {
                    ...old,
                    username: variables.username,
                    profile: {
                        ...old.profile,
                        displayName: variables.displayName,
                        bio: variables.bio
                    }
                };
            });

            queryClient.invalidateQueries({ queryKey: ['userProfile'] });

            console.log('Profile update successful');
        },
        onError: (error) => {
            console.error('Profile update failed:', error);
        }
    });
}

export function useCurrentUser() {
    const { loggedInUser, isAuthenticated } = useContext(SecurityContext);

    const userId = loggedInUser?.profile?.userId || '';

    console.log('useCurrentUser: loggedInUser:', loggedInUser);
    console.log('useCurrentUser: userId/keycloakId:', userId);
    console.log('useCurrentUser: isAuthenticated:', isAuthenticated());

    return {
        userId: userId, // This is actually the Keycloak ID
        keycloakId: userId, // Same as above, for clarity
        token: loggedInUser?.accessToken,
        isAuthenticated: isAuthenticated() && !!userId,
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

export function useAllUsers() {
    const { token, userId: currentUserKeycloakId } = useCurrentUser();

    const publicUsersQuery = useQuery({
        queryKey: ['publicUsers'],
        queryFn: () => getPublicUsers(token ?? null),
        enabled: !!token,
        staleTime: 1000 * 60 * 5,
    });

    const friendsQuery = useQuery({
        queryKey: ['friends'],
        queryFn: () => getFriendsList(token ?? null),
        enabled: !!token,
        staleTime: 1000 * 60 * 5,
    });

    return {
        publicUsers: publicUsersQuery.data || [],
        friends: friendsQuery.data || [],
        currentUserKeycloakId,
        isLoading: publicUsersQuery.isLoading || friendsQuery.isLoading,
        isError: publicUsersQuery.isError || friendsQuery.isError,
        error: publicUsersQuery.error || friendsQuery.error,
    };
}

export function useUserProfileById(targetKeycloakId: string) {
    const { token, isAuthenticated, userId: currentUserKeycloakId } = useCurrentUser();

    return useQuery<UserProfile | null, Error>({
        queryKey: ['userProfileById', targetKeycloakId],
        queryFn: async () => {
            if (targetKeycloakId === currentUserKeycloakId) {
                try {
                    return await getUserProfile(token ?? null);
                } catch (error) {
                    console.error('useUserProfileById: Failed to get current user:', error);
                }
            }

            let foundUser: UserProfile | null = null;

            try {
                const publicUsers = await getPublicUsers(token);
                foundUser = publicUsers.find(user => user.keycloakId === targetKeycloakId) || null;

                if (foundUser) {
                    return foundUser;
                }
            } catch (error) {
                console.warn("useUserProfileById: Could not fetch public users:", error);
            }

            if (!foundUser && isAuthenticated) {
                try {
                    const friends = await getFriendsList(token);
                    foundUser = friends.find(user => user.keycloakId === targetKeycloakId) || null;

                    if (foundUser) {
                        return foundUser;
                    }
                } catch (error) {
                    console.warn("useUserProfileById: Could not fetch friends list:", error);
                }
            }

            return null;
        },
        enabled: !!targetKeycloakId,
        staleTime: 0, // Don't use stale data
        refetchOnMount: true, // Always refetch when component mounts
        refetchOnWindowFocus: true, // Refetch when window gets focus
        retry: 1,
    });
}