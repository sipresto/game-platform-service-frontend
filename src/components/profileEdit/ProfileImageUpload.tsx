import { Box, Paper, Stack, Typography } from '@mui/material';
import { RemoveConfirmationDialog } from './RemoveConfirmationDialog';
import { AvatarSection } from './AvatarSection';
import { ControlSection } from './ControlSection';
import { StatusAlerts } from './StatusAlerts';
import {
    MAX_FILE_SIZE_MB,
    type ProfileImageUploadProps,
    SUPPORTED_IMAGE_TYPES,
} from "../../utils/types.ts";
import { getInitials } from "../../utils/imageUtils.ts";
import { useProfileImageManager } from '../../hooks/useProfileImageManager';

export const ProfileImageUpload = ({
                                       displayName = 'KeycloakUser',
                                       size = 120
                                   }: ProfileImageUploadProps) => {
    const {
        fileInputRef,
        uploadStatus,
        validationError,
        uploadError,
        isRemoveDialogOpen,
        profileImageUrl,
        isOwnProfile,
        isActionDisabled,
        isUploading,
        isRemoving,
        handleFileSelect,
        handleRemoveClick,
        handleRemoveConfirm,
        handleRemoveCancel,
        handleUploadClick,
        handleClearValidationError,
        handleClearUploadStatus,
    } = useProfileImageManager();

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