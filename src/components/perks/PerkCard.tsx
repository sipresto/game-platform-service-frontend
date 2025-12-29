import {
    Card,
    CardContent,
    Chip,
    Typography,
    Box,
    Stack, Button
} from '@mui/material';
import { getPerkTypeConfig } from '../../utils/perkUtils';
import type { Perk } from '../../model/perk';

interface PerkCardProps {
    perk: Perk;
    onPurchase?: (perkId: string) => void;
    onEquip?: (perkId: string) => void;
    isPurchasing?: boolean;
    isEquipping?: boolean;
}

export default function PerkCard({
                                     perk,
                                     onPurchase,
                                     onEquip,
                                     isPurchasing = false,
                                     isEquipping = false
                                 }: PerkCardProps) {
    const typeConfig = getPerkTypeConfig(perk.type);
    const Icon = typeConfig.icon;

    return (
        <Card
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    mb: 2,
                    gap: 1
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Icon sx={{ color: typeConfig.color }} />
                        <Typography variant="h6" component="div" sx={{ lineHeight: 1.2 }}>
                            {perk.name}
                        </Typography>
                    </Box>

                    <Chip
                        label={`${perk.pointCost} points`}
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{ flexShrink: 0 }}
                    />
                </Box>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    align="left"
                    sx={{ flexGrow: 1, mb: 2 }}
                >
                    {perk.description}
                </Typography>

                <Stack direction="row" spacing={1}>
                    {onPurchase && (
                        <Button
                            variant="contained"
                            size="small"
                            fullWidth
                            onClick={() => onPurchase(perk.perkId)}
                            disabled={isPurchasing}
                        >
                            {isPurchasing ? 'Purchasing...' : 'Purchase'}
                        </Button>
                    )}
                    {onEquip && (
                        <Button
                            variant="outlined"
                            size="small"
                            fullWidth
                            onClick={() => onEquip(perk.perkId)}
                            disabled={isEquipping}
                        >
                            {isEquipping ? 'Equipping...' : 'Equip'}
                        </Button>
                    )}
                </Stack>
            </CardContent>
        </Card>
    );
}