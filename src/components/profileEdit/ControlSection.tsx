import { Box, Button } from '@mui/material';
import { PhotoCamera, Delete } from '@mui/icons-material';
import React, {type RefObject} from 'react';

interface ControlSectionProps {
    fileInputRef: RefObject<HTMLInputElement | null>;
    handleUploadClick: () => void;
    handleRemoveClick: () => void;
    handleFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
    isActionDisabled: boolean;
    isUploading: boolean;
    isRemoving: boolean;
    supportedImageTypes: readonly string[];
}

export const ControlSection = ({
                                                                  fileInputRef,
                                                                  handleUploadClick,
                                                                  handleRemoveClick,
                                                                  handleFileSelect,
                                                                  isActionDisabled,
                                                                  isUploading,
                                                                  isRemoving,
                                                                  supportedImageTypes
                                                              } : ControlSectionProps) => {
    return (
        <>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                    variant="contained"
                    startIcon={<PhotoCamera />}
                    onClick={handleUploadClick}
                    disabled={isActionDisabled}
                    aria-label="Upload profile picture"
                >
                    {isUploading ? 'Uploading...' : 'Upload Photo'}
                </Button>

                <Button
                    variant="outlined"
                    startIcon={<Delete />}
                    onClick={handleRemoveClick}
                    disabled={isActionDisabled}
                    color="error"
                    aria-label="Remove profile picture"
                >
                    {isRemoving ? 'Removing...' : 'Remove'}
                </Button>
            </Box>

            <input
                ref={fileInputRef}
                type="file"
                accept={supportedImageTypes.join(',')}
                onChange={handleFileSelect}
                style={{ display: 'none' }}
                aria-label="Profile image file input"
            />
        </>
    );
};