export const SUPPORTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif'] as const;
export const MAX_FILE_SIZE_MB = 5;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
export const SUCCESS_MESSAGE_DURATION = 3000;
export const ERROR_MESSAGE_DURATION = 5000;

export type UploadStatus = 'idle' | 'success' | 'error';
export type SupportedImageType = typeof SUPPORTED_IMAGE_TYPES[number];

export interface ProfileImageUploadProps {
    userId: string;
    displayName?: string;
    size?: number;
}

export interface ValidationResult {
    isValid: boolean;
    error?: string;
}