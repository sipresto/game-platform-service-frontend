import {useMutation, type UseMutationResult, useQuery, useQueryClient} from '@tanstack/react-query';
import {useContext} from 'react';
import SecurityContext from '../context/SecurityContext';
import type {PrivacyUpdateData, ProfileUpdateData, UserProfile} from '../model/userProfile';
import {useKeycloakAccountService} from "../services/keycloakService.ts";
import {
    getFriendsList,
    getPublicUsers,
    getUser,
    getUserProfile,
    updateUserPrivacy,
    updateUserProfile
} from "../services/userApi.ts";

export function useUserProfile() {
    const { loggedInUser } = useContext(SecurityContext);

    const token =
        loggedInUser?.accessToken ??
        loggedInUser?.idToken ??
        localStorage.getItem('accessToken');

    const query = useQuery<UserProfile, Error>({
        queryKey: ['userProfile'],
        queryFn: () => getUserProfile(),
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

    const userId = loggedInUser?.profile?.keycloakId || '';

    console.log('useCurrentUser: loggedInUser:', loggedInUser);
    console.log('useCurrentUser: keycloakId:', userId);
    console.log('useCurrentUser: isAuthenticated:', isAuthenticated());

    return {
        keycloakId: userId,
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
    const { keycloakId } = useCurrentUser();

    return useMutation({
        mutationFn: async (privacyData: PrivacyUpdateData) => {
            if (!keycloakId) {
                throw new Error('User ID not found. Please log in again.');
            }

            return await updateUserPrivacy(
                privacyData.profile_visibility
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
    const { token, keycloakId: currentUserKeycloakId } = useCurrentUser();

    const publicUsersQuery = useQuery({
        queryKey: ['publicUsers'],
        queryFn: () => getPublicUsers(),
        enabled: !!token,
        staleTime: 1000 * 60 * 5,
    });

    const friendsQuery = useQuery({
        queryKey: ['friends'],
        queryFn: () => getFriendsList(),
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

export function useUserProfileById(userId: string) {
    const { isAuthenticated, keycloakId: currentUserKeycloakId } = useCurrentUser();

    return useQuery<UserProfile | null, Error>({
        queryKey: ['userProfileById', userId],
        queryFn: async () => {
            if (userId === currentUserKeycloakId) {
                try {
                    return await getUserProfile();
                } catch (error) {
                    console.error('useUserProfileById: Failed to get current user:', error);
                }
            }
            else{
                try {
                    return await getUser(userId);
                }
                catch (error) {
                    console.error(`useUserProfileById: Failed to get user by ID ${userId}:`, error);
                }
            }

            let foundUser: UserProfile | null = null;

            try {
                const publicUsers = await getPublicUsers();
                foundUser = publicUsers.find(user => user.keycloakId === userId) || null;

                if (foundUser) {
                    return foundUser;
                }
            } catch (error) {
                console.warn("useUserProfileById: Could not fetch public users:", error);
            }

            if (!foundUser && isAuthenticated) {
                try {
                    const friends = await getFriendsList();
                    foundUser = friends.find(user => user.keycloakId === userId) || null;

                    if (foundUser) {
                        return foundUser;
                    }
                } catch (error) {
                    console.warn("useUserProfileById: Could not fetch friends list:", error);
                }
            }

            return null;
        },
        enabled: !!userId,
        staleTime: 0,
        refetchOnMount: true,
        refetchOnWindowFocus: true,
        retry: 1,
    });
}