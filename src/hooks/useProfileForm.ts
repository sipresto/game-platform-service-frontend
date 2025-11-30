import { useState, useEffect, useCallback } from 'react';
import { useUpdateProfile } from './useUserProfile';
import type {ProfileUpdateData, UserProfile} from "../model/userProfile.ts";
import type {User} from "../model/user.ts";

interface FormState {
    username: string;
    firstName: string;
    lastName: string;
    displayName: string;
    bio: string;
}

interface UseProfileFormProps {
    userProfile: UserProfile | null | undefined;
    loggedInUser: User | null;
}

export function useProfileForm({ userProfile, loggedInUser }: UseProfileFormProps) {
    const [formState, setFormState] = useState<FormState>({
        username: '',
        firstName: '',
        lastName: '',
        displayName: '',
        bio: '',
    });

    const [isDirty, setIsDirty] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);

    const updateProfileMutation = useUpdateProfile();

    useEffect(() => {
        if (loggedInUser && !isInitialized) {
            const currentFirstName = loggedInUser.profile?.firstName || '';
            const currentLastName = loggedInUser.profile?.lastName || '';
            const tempDisplayName = loggedInUser.name || '';

            setFormState({
                username: loggedInUser.username || '',
                firstName: currentFirstName,
                lastName: currentLastName,
                displayName: tempDisplayName,
                bio: '',
            });
            setIsInitialized(true);
        }
    }, [loggedInUser, isInitialized]);

    useEffect(() => {
        if (userProfile && isInitialized) {
            const backendDisplayName = userProfile.profile?.displayName || '';
            const backendBio = userProfile.profile?.bio || '';

            setFormState(prev => ({
                ...prev,
                displayName: backendDisplayName,
                bio: backendBio,
            }));
        }
    }, [userProfile, isInitialized]);

    useEffect(() => {
        if (updateProfileMutation.isSuccess) {
            setIsDirty(false);
        }
    }, [updateProfileMutation.isSuccess]);

    const checkDirtyState = useCallback(() => {
        if (!loggedInUser) return;

        const initialUsername = loggedInUser.username || '';
        const initialFirstName = loggedInUser.profile?.firstName || '';
        const initialLastName = loggedInUser.profile?.lastName || '';
        const initialDisplayName = userProfile?.profile?.displayName || loggedInUser.name || '';
        const initialBio = userProfile?.profile?.bio || '';

        const isUsernameChanged = formState.username !== initialUsername;
        const isFirstNameChanged = formState.firstName !== initialFirstName;
        const isLastNameChanged = formState.lastName !== initialLastName;
        const isDisplayNameChanged = formState.displayName !== initialDisplayName;
        const isBioChanged = formState.bio !== initialBio;

        setIsDirty(isUsernameChanged || isFirstNameChanged || isLastNameChanged || isDisplayNameChanged || isBioChanged);
    }, [formState, userProfile, loggedInUser]);

    const handleFieldChange = useCallback((field: keyof FormState, value: string) => {
        setFormState(prev => ({ ...prev, [field]: value }));
    }, []);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        if (!formState.username.trim() || !formState.displayName.trim() || !formState.firstName.trim()) {
            return;
        }

        const updateData: ProfileUpdateData = {
            username: formState.username.trim(),
            firstName: formState.firstName.trim(),
            lastName: formState.lastName.trim(),
            displayName: formState.displayName.trim(),
            bio: formState.bio.trim()
        };

        updateProfileMutation.mutate(updateData);
    };

    const handleReset = () => {
        if (loggedInUser) {
            const initialDisplayName = userProfile?.profile?.displayName || loggedInUser.name || '';
            const initialBio = userProfile?.profile?.bio || '';

            setFormState({
                username: loggedInUser.username || '',
                firstName: loggedInUser.profile?.firstName || '',
                lastName: loggedInUser.profile?.lastName || '',
                displayName: initialDisplayName,
                bio: initialBio,
            });
        }
        setIsDirty(false);
        updateProfileMutation.reset();
    };

    useEffect(() => {
        checkDirtyState();
    }, [formState, checkDirtyState]);

    return {
        formState,
        isDirty,
        updateProfileMutation,
        handleFieldChange,
        handleReset,
        handleSubmit
    };
}