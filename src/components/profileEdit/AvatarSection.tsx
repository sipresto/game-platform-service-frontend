import { Box, Avatar, CircularProgress } from '@mui/material';
import React from "react";

interface AvatarSectionProps {
    profileImageUrl: string | null;
    displayName: string;
    size: number;
    isUploading: boolean;
    getInitials: (name: string) => string;
}

export const AvatarSection: React.FC<AvatarSectionProps> = ({
                                                                profileImageUrl,
                                                                displayName,
                                                                size,
                                                                isUploading,
                                                                getInitials
                                                            }) => {
    return (
        <Box sx={{ position: 'relative' }}>
            <Avatar
                src={profileImageUrl || undefined}
                sx={{
                    width: size,
                    height: size,
                    fontSize: size / 2,
                    bgcolor: 'primary.main',
                }}
                alt={`${displayName}'s profile picture`}
            >
                {getInitials(displayName)}
            </Avatar>

            {isUploading && (
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: 'rgba(0, 0, 0, 0.5)',
                        borderRadius: '50%',
                    }}
                >
                    <CircularProgress
                        size={size / 3}
                        sx={{ color: 'white' }}
                        aria-label="Uploading image"
                    />
                </Box>
            )}
        </Box>
    );
};