import { useMutation, useQueryClient } from '@tanstack/react-query';
import { removeProfileImage, uploadProfileImage } from '../services/userApi';

interface UseProfileImageReturn {
    uploadImage: (file: File) => Promise<void>;
    removeImage: () => Promise<void>;
    isUploading: boolean;
    isRemoving: boolean;
    error: Error | null;
}

export function useProfileImage(): UseProfileImageReturn {
    const queryClient = useQueryClient();

    const uploadMutation = useMutation({
        mutationFn: uploadProfileImage,
        onSuccess: async() => {
            await queryClient.invalidateQueries({ queryKey: ['userProfile'] });
        },
    });

    const removeMutation = useMutation({
        mutationFn: removeProfileImage,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['userProfile'] });
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