import { Box, Avatar, Typography, Skeleton } from '@mui/material';
import { MilitaryTech, Block, Handshake, Gamepad } from '@mui/icons-material';

type UserResult = 'WIN' | 'LOSS' | 'DRAW' | 'LOADING';

interface ResultBadgeProps {
    result: UserResult;
}

export function ResultBadge({ result }: ResultBadgeProps) {
    const getResultConfig = (result: UserResult) => {
        switch (result) {
            case 'WIN':
                return {
                    color: 'success' as const,
                    bgcolor: 'success.light',
                    icon: <MilitaryTech />,
                    label: 'Win'
                };
            case 'LOSS':
                return {
                    color: 'error' as const,
                    bgcolor: 'error.light',
                    icon: <Block />,
                    label: 'Loss'
                };
            case 'DRAW':
                return {
                    color: 'warning' as const,
                    bgcolor: 'warning.light',
                    icon: <Handshake />,
                    label: 'Draw'
                };
            case 'LOADING':
                return {
                    color: 'default' as const,
                    bgcolor: 'grey.200',
                    icon: <Skeleton variant="circular" width={24} height={24} />,
                    label: '...'
                };
            default:
                return {
                    color: 'default' as const,
                    bgcolor: 'grey.300',
                    icon: <Gamepad />,
                    label: 'Unknown'
                };
        }
    };

    const config = getResultConfig(result);

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar sx={{ bgcolor: config.bgcolor, width: 40, height: 40 }}>
                {config.icon}
            </Avatar>
            <Box>
                <Typography variant="subtitle2" fontWeight={600}>
                    {config.label}
                </Typography>
            </Box>
        </Box>
    );
}