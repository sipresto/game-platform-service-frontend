import {type SupportedImageType, SUPPORTED_IMAGE_TYPES, MAX_FILE_SIZE_BYTES, MAX_FILE_SIZE_MB, type ValidationResult } from './types';

export const validateImageFile = (file: File): ValidationResult => {
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

export const getInitials = (name: string): string => {
    return name
        .split(' ')
        .map(part => part.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2);
};