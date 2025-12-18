import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useUserProfile, useCurrentUser } from './useUserProfile';
import { useProfileImage } from './useProfileImage';
import {ERROR_MESSAGE_DURATION, SUCCESS_MESSAGE_DURATION, type UploadStatus} from "../utils/types.ts";
import {getProfileImageUrl, validateImageFile} from "../utils/utils.ts";

interface UseProfileImageManagerProps {
    userId: string;
}

interface UseProfileImageManagerReturn {
    uploadStatus: UploadStatus;
    validationError: string | null;
    isRemoveDialogOpen: boolean;
    profileImageUrl: string | null;
    isOwnProfile: boolean;
    isActionDisabled: boolean;
    imageTimestamp: number;

    fileInputRef: React.RefObject<HTMLInputElement | null>;

    handleFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
    handleRemoveClick: () => void;
    handleRemoveConfirm: () => Promise<void>;
    handleRemoveCancel: () => void;
    handleUploadClick: () => void;
    handleClearValidationError: () => void;
    handleClearUploadStatus: () => void;

    isUploading: boolean;
    isRemoving: boolean;
    uploadError: Error | null;
}

export const useProfileImageManager = ({
                                           userId
                                       }: UseProfileImageManagerProps): UseProfileImageManagerReturn => {
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const { uploadImage, removeImage, isUploading, isRemoving, error: uploadError } = useProfileImage();

    const { keycloakId: currentUserKeycloakId } = useCurrentUser();
    const { data: userProfile } = useUserProfile();

    const [uploadStatus, setUploadStatus] = useState<UploadStatus>('idle');
    const [validationError, setValidationError] = useState<string | null>(null);
    const [imageTimestamp, setImageTimestamp] = useState(Date.now());
    const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);

    const isOwnProfile = userProfile?.keycloakId === currentUserKeycloakId;
    const profileImageUrl = BACKEND_URL
        ? getProfileImageUrl(userId, BACKEND_URL, imageTimestamp)
        : null;

    const handleFileSelect = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const validation = validateImageFile(file);
        if (!validation.isValid) {
            setValidationError(validation.error || null);
            return;
        }

        setValidationError(null);

        try {
            setUploadStatus('idle');
            await uploadImage(file);

            setImageTimestamp(Date.now());
            setUploadStatus('success');

            setTimeout(() => {
                setUploadStatus('idle');
            }, SUCCESS_MESSAGE_DURATION);
        } catch (err) {
            setUploadStatus('error');
            console.error('Upload failed:', err);

            setTimeout(() => {
                setUploadStatus('idle');
            }, ERROR_MESSAGE_DURATION);
        } finally {
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    }, [uploadImage]);

    const handleRemoveClick = useCallback(() => {
        setIsRemoveDialogOpen(true);
    }, []);

    const handleRemoveConfirm = useCallback(async () => {
        try {
            await removeImage();
            setImageTimestamp(Date.now());
        } catch (err) {
            console.error('Remove failed:', err);
        } finally {
            setIsRemoveDialogOpen(false);
        }
    }, [removeImage]);

    const handleRemoveCancel = useCallback(() => {
        setIsRemoveDialogOpen(false);
    }, []);

    const handleUploadClick = useCallback(() => {
        fileInputRef.current?.click();
    }, []);

    const handleClearValidationError = useCallback(() => {
        setValidationError(null);
    }, []);

    const handleClearUploadStatus = useCallback(() => {
        setUploadStatus('idle');
    }, []);

    useEffect(() => {
        if (validationError) {
            const timer = setTimeout(() => {
                setValidationError(null);
            }, ERROR_MESSAGE_DURATION);
            return () => clearTimeout(timer);
        }
    }, [validationError]);

    const isActionDisabled = isUploading || isRemoving;

    return {
        uploadStatus,
        validationError,
        isRemoveDialogOpen,
        profileImageUrl,
        isOwnProfile,
        isActionDisabled,
        imageTimestamp,

        fileInputRef,

        handleFileSelect,
        handleRemoveClick,
        handleRemoveConfirm,
        handleRemoveCancel,
        handleUploadClick,
        handleClearValidationError,
        handleClearUploadStatus,

        isUploading,
        isRemoving,
        uploadError,
    };
};