import type { SxProps } from '@mui/material';

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
        cursor: 'pointer',
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
