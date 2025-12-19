import { Box, Typography } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';

interface FriendCardBioProps {
    bio?: string;
}

export function FriendCardBio({ bio }: FriendCardBioProps) {
    const theme = useTheme();

    if (bio) {
        return (
            <Box sx={{
                mb: 1.5,
                display: 'flex',
                flexDirection: 'column',
            }}>
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        lineHeight: 1.5,
                        fontSize: '0.875rem',
                        px: 1,
                        py: 1,
                        borderRadius: 1,
                        backgroundColor: alpha(theme.palette.background.default, 0.5),
                        borderLeft: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                    }}
                >
                    {bio}
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{
            mb: 1.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 60,
        }}>
            <Typography
                variant="body2"
                color="text.disabled"
                sx={{
                    fontStyle: 'italic',
                    textAlign: 'center',
                    px: 2,
                }}
            >
                No bio yet
            </Typography>
        </Box>
    );
}