import React, { useState, useEffect } from 'react';
import { useUpdateProfile } from './useUserProfile';
import type { UserProfile } from '../model/userProfile';
import type { KeycloakUser } from '../model/keycloakUser';

export interface FormState {
    username: string;
    firstName: string;
    lastName: string;
    displayName: string;
    bio: string;
}

interface UseProfileFormProps {
    userProfile: UserProfile | undefined;
    loggedInUser: KeycloakUser | null;
}

export function useProfileForm({ userProfile, loggedInUser }: UseProfileFormProps) {
    const [formState, setFormState] = useState<FormState>({
        username: '',
        firstName: '',
        lastName: '',
        displayName: '',
        bio: ''
    });

    const [initialState, setInitialState] = useState<FormState>(formState);
    const updateProfileMutation = useUpdateProfile();

    // Initialize form state from user profile and Keycloak data
    useEffect(() => {
        if (loggedInUser || userProfile) {
            const newState: FormState = {
                username: loggedInUser?.profile?.username || userProfile?.username || '',
                firstName: loggedInUser?.profile?.firstName || '',
                lastName: loggedInUser?.profile?.lastName || '',
                displayName: userProfile?.profile?.displayName || '',
                bio: userProfile?.profile?.bio || ''
            };

            setFormState(newState);
            setInitialState(newState);
        }
    }, [loggedInUser, userProfile]);

    const handleFieldChange = (field: keyof FormState, value: string) => {
        setFormState(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleReset = () => {
        setFormState(initialState);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await updateProfileMutation.mutateAsync({
                username: formState.username,
                firstName: formState.firstName,
                lastName: formState.lastName,
                displayName: formState.displayName,
                bio: formState.bio
            });

            // Update initial state after successful save
            setInitialState(formState);
        } catch (error) {
            console.error('Failed to update profile:', error);
        }
    };

    const isDirty = JSON.stringify(formState) !== JSON.stringify(initialState);

    return {
        formState,
        isDirty,
        updateProfileMutation,
        handleFieldChange,
        handleReset,
        handleSubmit
    };
}