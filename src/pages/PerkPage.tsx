import { Box } from '@mui/material';
import PerksShopContent from '../components/perks/PerksShopContent';

export function PerksShopPage() {
    return (
        <Box sx={{ width: '100%', p: { xs: 1, sm: 2, md: 3 } }}>
            <PerksShopContent />
        </Box>
    );
}