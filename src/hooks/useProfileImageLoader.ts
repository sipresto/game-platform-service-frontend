import { useState, useEffect, useCallback } from 'react';
import { getProfileImageUrl } from '../utils/userUtils.ts';
import { useQueryClient } from '@tanstack/react-query';

export const useProfileImageLoader = (userId: string) => {
    const queryClient = useQueryClient();
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

    useEffect(() => {
        const unsubscribe = queryClient.getQueryCache().subscribe((event) => {
            if (
                event?.type === 'updated' &&
                event.query &&
                event.query.queryKey.includes('userProfile')
            ) {
                setImageTimestamp(Date.now());
            }
        });

        return () => {
            unsubscribe();
        };
    }, [queryClient]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setImageTimestamp(Date.now());
        }, 30000);

        return () => {
            clearInterval(intervalId);
        };
    }, []);

    const refreshImage = useCallback(() => {
        setImageTimestamp(Date.now());
    }, []);

    return {
        profileImageUrl,
        isLoading,
        hasError,
        refreshImage
    };
};