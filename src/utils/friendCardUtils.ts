import type { SxProps } from '@mui/material';

export const getVisibilityLabel = (visibility: string) => {
    switch (visibility) {
        case 'PUBLIC':
            return 'Public';
        case 'FRIENDS_ONLY':
            return 'Friends Only';
        case 'PRIVATE':
            return 'Private';
        default:
            return visibility;
    }
};

export const cardStyles = ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 2,
    transition: 'all 0.2s ease',
    position: 'relative',
    overflow: 'hidden',
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    }
});

export const contentStyles = (showActions: boolean): SxProps => ({
    flexGrow: 1,
    pt: 2,
    pb: showActions ? 1 : 2,
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
});
