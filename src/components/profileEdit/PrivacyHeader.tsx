import { Typography, Box } from '@mui/material';

interface PrivacyHeaderProps {
    title?: string;
    description?: string;
}

export function PrivacyHeader({
                                  title = 'Privacy Settings',
                                  description = 'Control who can see your profile information and gaming activity.'
                              }: PrivacyHeaderProps) {
    return (
        <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                {title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
                {description}
            </Typography>
        </Box>
    );
}