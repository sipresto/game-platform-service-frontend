import { useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadProfileImage, removeProfileImage } from '../services/userApi';
import {useCurrentUser} from "./useUserProfile.ts";

interface UseProfileImageReturn {
    uploadImage: (file: File) => Promise<void>;
    removeImage: () => Promise<void>;
    isUploading: boolean;
    isRemoving: boolean;
    error: Error | null;
}

export function useProfileImage(): UseProfileImageReturn {
    const queryClient = useQueryClient();
    const { keycloakId } = useCurrentUser();

    const uploadMutation = useMutation({
        mutationFn: uploadProfileImage,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['userProfile'] });
            if (keycloakId) {
                console.log('Profile image uploaded successfully');
            }
        },
        onError: (error: Error) => {
            console.error('Failed to upload profile image:', error);
        },
    });

    const removeMutation = useMutation({
        mutationFn: removeProfileImage,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['userProfile'] });
            console.log('Profile image removed successfully');
        },
        onError: (error: Error) => {
            console.error('Failed to remove profile image:', error);
        },
    });

    return {
        uploadImage: uploadMutation.mutateAsync,
        removeImage: removeMutation.mutateAsync,
        isUploading: uploadMutation.isPending,
        isRemoving: removeMutation.isPending,
        error: uploadMutation.error || removeMutation.error,
    };
}