import { useState, useEffect } from 'react';
import { getProfileImageUrl } from './userUtils.ts';

export const useProfileImageLoader = (userId: string) => {
    const [imageTimestamp, setImageTimestamp] = useState(Date.now());
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    const profileImageUrl = getProfileImageUrl(userId, imageTimestamp);

    useEffect(() => {
        if (!profileImageUrl) {
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setHasError(false);

        const img = new Image();
        img.src = profileImageUrl;

        const handleLoad = () => {
            setIsLoading(false);
        };

        const handleError = () => {
            setIsLoading(false);
            setHasError(true);
        };

        img.addEventListener('load', handleLoad);
        img.addEventListener('error', handleError);

        return () => {
            img.removeEventListener('load', handleLoad);
            img.removeEventListener('error', handleError);
        };
    }, [profileImageUrl]);

    const refreshImage = () => {
        setImageTimestamp(Date.now());
    };

    return {
        profileImageUrl,
        isLoading,
        hasError,
        refreshImage
    };
};