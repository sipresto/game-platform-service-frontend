import {
    Card,
    CardContent,
    Chip,
    Typography,
    Box,
    Button
} from '@mui/material';
import { getPerkTypeConfig } from '../../utils/perkUtils';
import type { Perk } from '../../model/perk';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface PerkCardProps {
    perk: Perk;
    onPurchase: (perkId: string) => void;
    onEquip: (perkId: string) => void;
    onUnequip: (perkId: string) => void;
    isPurchasing: boolean;
    isEquipping: boolean;
    isUnequipping: boolean;
    userPoints: number;
}

export default function PerkCard({
                                     perk,
                                     onPurchase,
                                     onEquip,
                                     onUnequip,
                                     isPurchasing,
                                     isEquipping,
                                     isUnequipping,
                                     userPoints
                                 }: PerkCardProps) {
    const typeConfig = getPerkTypeConfig(perk.type);
    const Icon = typeConfig.icon;

    const renderActionButton = () => {
        if (perk.equipped) {
            return (
                <Button
                    variant="outlined"
                    color="warning"
                    fullWidth
                    onClick={() => onUnequip(perk.perkId)}
                    disabled={isUnequipping}
                >
                    {isUnequipping ? 'Unequipping...' : 'Unequip'}
                </Button>
            );
        }

        if (perk.purchased) {
            return (
                <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => onEquip(perk.perkId)}
                    disabled={isEquipping}
                >
                    {isEquipping ? 'Equipping...' : 'Equip'}
                </Button>
            );
        }

        const canAfford = userPoints >= perk.pointCost;

        return (
            <Button
                variant="contained"
                fullWidth
                onClick={() => onPurchase(perk.perkId)}
                disabled={isPurchasing || !canAfford}
                color={canAfford ? "primary" : "error"}
            >
                {isPurchasing ? 'Purchasing...' : `Purchase (${perk.pointCost})`}
            </Button>
        );
    };

    return (
        <Card
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                border: perk.equipped ? `2px solid ${typeConfig.color}` : undefined
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

                    {!perk.purchased && (
                        <Chip
                            label={`${perk.pointCost} pts`}
                            size="small"
                            color="primary"
                            variant="outlined"
                            sx={{ flexShrink: 0 }}
                        />
                    )}
                    {perk.purchased && !perk.equipped && (
                        <CheckCircleIcon color="success" />
                    )}
                </Box>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    align="left"
                    sx={{ flexGrow: 1, mb: 2 }}
                >
                    {perk.description}
                </Typography>

                <Box mt="auto">
                    {renderActionButton()}
                </Box>
            </CardContent>
        </Card>
    );
}