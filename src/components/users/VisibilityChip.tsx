import { Chip, Box } from '@mui/material';
import { Visibility as VisibilityIcon } from '@mui/icons-material';
import { getVisibilityInfo } from '../../utils/userUtils.ts';

interface VisibilityChipProps {
    visibility: string;
}

export const VisibilityChip = ({ visibility }: VisibilityChipProps) => {
    const visibilityInfo = getVisibilityInfo(visibility);

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <VisibilityIcon fontSize="small" color="action" />
            <Chip
                label={visibilityInfo.label}
                size="small"
                color={visibilityInfo.color}
                variant="outlined"
                sx={{ fontSize: '0.75rem' }}
            />
        </Box>
    );
};