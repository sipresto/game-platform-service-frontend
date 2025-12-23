import { Box } from '@mui/material';
import type { ReactNode } from "react";

export function ChatPopup({ children }: { children: ReactNode }) {
    return (
        <Box
            sx={{
                position: 'fixed',
                bottom: 90,
                right: 24,
                width: 320,
                maxHeight: 400,
                bgcolor: 'background.paper',
                boxShadow: 3,
                borderRadius: 2,
                overflowY: 'auto',
                zIndex: 1500,
                p: 1,
                '&::-webkit-scrollbar': {
                    width: '8px',
                },
                '&::-webkit-scrollbar-thumb': {
                    backgroundColor: 'rgba(0,0,0,0.2)',
                    borderRadius: '4px',
                },
            }}
        >
            {children}
        </Box>
    );
}