import { Chip } from '@mui/material';
import { Person } from '@mui/icons-material';
import { timeAgo } from '../../utils/dateUtils';

interface TimeChipProps {
    createdAt: string;
}

export function TimeChip({ createdAt }: TimeChipProps) {
    return (
        <Chip
            icon={<Person />}
            label={timeAgo(createdAt)}
            size="small"
            variant="outlined"
            sx={{
                fontSize: '0.75rem',
                height: 24
            }}
        />
    );
}