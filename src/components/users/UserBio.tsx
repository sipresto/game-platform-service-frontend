import { Typography } from '@mui/material';

interface UserBioProps {
    bio: string;
}

export const UserBio = ({ bio }: UserBioProps) => {
    return (
        <Typography
            variant="body2"
            color="text.secondary"
            sx={{
                mb: 2,
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
            }}
        >
            {bio}
        </Typography>
    );
};