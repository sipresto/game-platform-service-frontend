import { Box, Typography } from '@mui/material';
import { GameList } from "../components/gameList.tsx";

export function StorePage() {
    return (
        <Box>
            <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3 }}>
            </Typography>
            <GameList />
        </Box>
    );
}