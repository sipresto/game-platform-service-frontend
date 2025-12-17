import React, { useState, useRef, useCallback, useEffect } from 'react';
import {Box, Paper, Stack, Typography} from '@mui/material';
import { useProfileImage } from '../../hooks/useProfileImage';
import { useUserProfile, useCurrentUser } from '../../hooks/useUserProfile';
import { RemoveConfirmationDialog } from './RemoveConfirmationDialog';
import { AvatarSection } from './AvatarSection';
import { ControlSection } from './ControlSection';
import { StatusAlerts } from './StatusAlerts';

const SUPPORTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif'] as const;
const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const SUCCESS_MESSAGE_DURATION = 3000;
const ERROR_MESSAGE_DURATION = 5000;

type UploadStatus = 'idle' | 'success' | 'error';
type SupportedImageType = typeof SUPPORTED_IMAGE_TYPES[number];

interface ProfileImageUploadProps {
    userId: string;
    displayName?: string;
    size?: number;
}

const getProfileImageUrl = (userId: string, backendUrl: string, timestamp: number): string | null => {
    if (!backendUrl || !userId) return null;
    return `${backendUrl}/${userId}/profile-image?t=${timestamp}`;
};

const validateImageFile = (file: File): { isValid: boolean; error?: string } => {
    if (!SUPPORTED_IMAGE_TYPES.includes(file.type as SupportedImageType)) {
        return {
            isValid: false,
            error: `Please select a JPEG, PNG, or GIF image. Supported types: ${SUPPORTED_IMAGE_TYPES.join(', ')}`
        };
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
        return {
            isValid: false,
            error: `Image must be less than ${MAX_FILE_SIZE_MB}MB.`
        };
    }

    return { isValid: true };
};

export const ProfileImageUpload: React.FC<ProfileImageUploadProps> = ({
                                                                          userId,
                                                                          displayName = 'User',
                                                                          size = 120
                                                                      }) => {
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    if (!BACKEND_URL) {
        console.error('BACKEND_URL environment variable is not defined');
    }

    const fileInputRef = useRef<HTMLInputElement>(null);
    const { uploadImage, removeImage, isUploading, isRemoving, error: uploadError } = useProfileImage();
    const { keycloakId: currentUserKeycloakId } = useCurrentUser();
    const { data: userProfile } = useUserProfile();

    const [uploadStatus, setUploadStatus] = useState<UploadStatus>('idle');
    const [validationError, setValidationError] = useState<string | null>(null);
    const [imageTimestamp, setImageTimestamp] = useState(Date.now());
    const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);

    const isOwnProfile = userProfile?.keycloakId === currentUserKeycloakId;

    const profileImageUrl = getProfileImageUrl(userId, BACKEND_URL, imageTimestamp);

    const getInitials = useCallback((name: string): string => {
        return name
            .split(' ')
            .map(part => part.charAt(0))
            .join('')
            .toUpperCase()
            .slice(0, 2);
    }, []);

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
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

            const successTimer = setTimeout(() => {
                setUploadStatus('idle');
            }, SUCCESS_MESSAGE_DURATION);

            return () => clearTimeout(successTimer);
        } catch (err) {
            setUploadStatus('error');
            console.error('Upload failed:', err);

            const errorTimer = setTimeout(() => {
                setUploadStatus('idle');
            }, ERROR_MESSAGE_DURATION);

            return () => clearTimeout(errorTimer);
        } finally {
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleRemoveClick = () => {
        setIsRemoveDialogOpen(true);
    };

    const handleRemoveConfirm = async () => {
        try {
            await removeImage();
            setImageTimestamp(Date.now());
        } catch (err) {
            console.error('Remove failed:', err);
        } finally {
            setIsRemoveDialogOpen(false);
        }
    };

    const handleRemoveCancel = () => {
        setIsRemoveDialogOpen(false);
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleClearValidationError = () => {
        setValidationError(null);
    };

    const handleClearUploadStatus = () => {
        setUploadStatus('idle');
    };

    useEffect(() => {
        if (validationError) {
            const timer = setTimeout(() => {
                setValidationError(null);
            }, ERROR_MESSAGE_DURATION);
            return () => clearTimeout(timer);
        }
    }, [validationError]);

    const isActionDisabled = isUploading || isRemoving;

    return (
        <>
            <Paper
                elevation={0}
                sx={{
                    p: 3,
                    border: 1,
                    borderColor: 'divider',
                    borderRadius: 2,
                    backgroundColor: 'background.default',
                    mb: 3,
                }}
            >
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    Profile Picture
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Upload a photo to personalize your profile. Max size: {MAX_FILE_SIZE_MB}MB (JPEG, PNG, GIF)
                </Typography>

                <Stack direction="row" spacing={3} alignItems="center">
                    <AvatarSection
                        profileImageUrl={profileImageUrl}
                        displayName={displayName}
                        size={size}
                        isUploading={isUploading}
                        getInitials={getInitials}
                    />

                    <Box sx={{ flexGrow: 1 }}>
                        <Stack spacing={2}>
                            {isOwnProfile ? (
                                <ControlSection
                                    fileInputRef={fileInputRef}
                                    handleUploadClick={handleUploadClick}
                                    handleRemoveClick={handleRemoveClick}
                                    handleFileSelect={handleFileSelect}
                                    isActionDisabled={isActionDisabled}
                                    isUploading={isUploading}
                                    isRemoving={isRemoving}
                                    supportedImageTypes={SUPPORTED_IMAGE_TYPES}
                                />
                            ) : (
                                <Typography variant="body2" color="text.secondary">
                                    This user's profile picture
                                </Typography>
                            )}

                            <StatusAlerts
                                validationError={validationError}
                                uploadError={uploadError}
                                uploadStatus={uploadStatus}
                                onClearValidationError={handleClearValidationError}
                                onClearUploadStatus={handleClearUploadStatus}
                            />
                        </Stack>
                    </Box>
                </Stack>
            </Paper>

            <RemoveConfirmationDialog
                open={isRemoveDialogOpen}
                onConfirm={handleRemoveConfirm}
                onCancel={handleRemoveCancel}
                isRemoving={isRemoving}
            />
        </>
    );
};