import {
    useMutation,
    type UseMutationResult,
    useQuery,
    useQueryClient,
    type UseQueryResult
} from '@tanstack/react-query';
import { useContext } from 'react';
import SecurityContext from '../context/SecurityContext';
import type {
    ProfileUpdateData,
    UserProfile,
    PublicUserProfile,
    VisibilitySettings,
    Visibility,
    VisibleField
} from '../model/userProfile';
import { useKeycloakAccountService } from "../services/keycloakService";
import {
    getFriendsList,
    getPublicUsers,
    getUser,
    getUserProfile,
    updateUserProfile,
    getVisibilitySettings,
    updateGlobalVisibility,
    updateFieldVisibility
} from "../services/userApi";

export function useCurrentUser() {
    const { loggedInUser, isAuthenticated } = useContext(SecurityContext);
    const userId = loggedInUser?.profile?.keycloakId || '';

    return {
        keycloakId: userId,
        token: loggedInUser?.accessToken,
        isAuthenticated: isAuthenticated() && !!userId,
        user: loggedInUser
    };
}

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

export function useUserProfileById(userId: string): UseQueryResult<PublicUserProfile | null, Error> {
    const { keycloakId: currentUserKeycloakId } = useCurrentUser();
    const { data: currentUserProfile } = useUserProfile();

    return useQuery<PublicUserProfile | null, Error>({
        queryKey: ['userProfileById', userId],
        queryFn: async () => {
            if (userId === currentUserKeycloakId && currentUserProfile) {
                return {
                    id: currentUserProfile.id,
                    username: currentUserProfile.username,
                    profile: currentUserProfile.profile,
                    points: currentUserProfile.points,
                    favoriteGames: currentUserProfile.favoriteGames,
                    ownedGames: currentUserProfile.ownedGames,
                    friends: currentUserProfile.friends,
                    keycloakId: currentUserProfile.keycloakId
                };
            }

            try {
                return await getUser(userId);
            } catch (error) {
                console.error(`Failed to get user by ID ${userId}:`, error);
                return null;
            }
        },
        enabled: !!userId,
        staleTime: 1000 * 60 * 2,
        retry: 1,
    });
}

export function useUpdateProfile(): UseMutationResult<
    void,
    Error,
    ProfileUpdateData
> {
    const queryClient = useQueryClient();
    const { updateKeycloakAccount } = useKeycloakAccountService();

    return useMutation({
        mutationFn: async (profileData: ProfileUpdateData): Promise<void> => {
            await updateKeycloakAccount(
                profileData.username,
                undefined,
                profileData.firstName,
                profileData.lastName
            );

            await updateUserProfile({
                displayName: profileData.displayName,
                bio: profileData.bio
            });
        },
        onMutate: async (newProfileData) => {
            await queryClient.cancelQueries({ queryKey: ['userProfile'] });
            const previousProfile = queryClient.getQueryData<UserProfile>(['userProfile']);

            if (previousProfile) {
                queryClient.setQueryData<UserProfile>(['userProfile'], {
                    ...previousProfile,
                    username: newProfileData.username,
                    profile: {
                        ...previousProfile.profile,
                        displayName: newProfileData.displayName,
                        bio: newProfileData.bio
                    }
                });
            }

            return { previousProfile };
        },
        onError: (error, _variables, context) => {
            if (context?.previousProfile) {
                queryClient.setQueryData(['userProfile'], context.previousProfile);
            }
            console.error('Profile update failed:', error);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['userProfile'] });
        }
    });
}

export function useVisibilitySettings(): UseQueryResult<VisibilitySettings, Error> {
    const { token } = useCurrentUser();

    return useQuery<VisibilitySettings, Error>({
        queryKey: ['visibilitySettings'],
        queryFn: () => getVisibilitySettings(),
        enabled: !!token,
        staleTime: 1000 * 60 * 5,
        retry: 1,
    });
}

export function useUpdateGlobalVisibility(): UseMutationResult<
    void,
    Error,
    Visibility
> {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (visibility: Visibility) => {
            await updateGlobalVisibility(visibility);
        },
        onMutate: async (newVisibility) => {
            await queryClient.cancelQueries({ queryKey: ['visibilitySettings'] });
            const previousSettings = queryClient.getQueryData<VisibilitySettings>(['visibilitySettings']);

            if (previousSettings) {
                const newSettings: VisibilitySettings = {
                    fieldVisibilities: {
                        ...previousSettings.fieldVisibilities,
                        POINTS: newVisibility,
                        FAVORITE_GAMES: newVisibility,
                        OWNED_GAMES: newVisibility,
                        FRIENDS_LIST: newVisibility
                    }
                };
                queryClient.setQueryData(['visibilitySettings'], newSettings);
            }

            return { previousSettings };
        },
        onError: (error, _variables, context) => {
            if (context?.previousSettings) {
                queryClient.setQueryData(['visibilitySettings'], context.previousSettings);
            }
            console.error('Failed to update global visibility:', error);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['visibilitySettings'] });
            queryClient.invalidateQueries({ queryKey: ['userProfile'] });
        },
    });
}

export function useUpdateFieldVisibility(): UseMutationResult<
    void,
    Error,
    { field: VisibleField; visibility: Visibility }
> {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ field, visibility }) => {
            await updateFieldVisibility(field, visibility);
        },
        onMutate: async ({ field, visibility }) => {
            await queryClient.cancelQueries({ queryKey: ['visibilitySettings'] });
            const previousSettings = queryClient.getQueryData<VisibilitySettings>(['visibilitySettings']);

            if (previousSettings) {
                const newSettings: VisibilitySettings = {
                    fieldVisibilities: {
                        ...previousSettings.fieldVisibilities,
                        [field]: visibility
                    }
                };
                queryClient.setQueryData(['visibilitySettings'], newSettings);
            }

            return { previousSettings };
        },
        onError: (error, _variables, context) => {
            if (context?.previousSettings) {
                queryClient.setQueryData(['visibilitySettings'], context.previousSettings);
            }
            console.error('Failed to update field visibility:', error);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['visibilitySettings'] });
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