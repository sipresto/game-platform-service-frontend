import { Box, Typography } from '@mui/material';

export function ChatHeader({ name }: { name: string }) {
    return (
        <Box
            sx={{
                p: 2,
                borderBottom: '1px solid',
                borderColor: 'divider',
            }}
        >
            <Typography fontWeight={600}>{name}</Typography>
        </Box>
    );
}
