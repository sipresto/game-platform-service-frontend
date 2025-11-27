import {
    Card,
    CardContent,
    CardMedia,
    Typography,
    Box,
    Chip,
    ButtonBase
} from '@mui/material';
import {useNavigate} from 'react-router';
import {useContext} from 'react';
import SecurityContext from '../context/SecurityContext';
import type {Game} from "../model/game.ts";

interface GameCardProps {
    game: Game;
    isLibrary?: boolean;
}

export function GameCard({game, isLibrary = false}: GameCardProps) {
    const navigate = useNavigate();
    const {isAuthenticated, login} = useContext(SecurityContext);
    const descriptionLimit = 150;

    const handleGameClick = () => {
        if (isAuthenticated() && isLibrary) {
            navigate(`/lobby/${game.gameId}`);
        } else if (!isAuthenticated()) {
            login();
        }
    };

    return (
        <ButtonBase
            sx={{
                width: '100%',
                textAlign: 'left',
                borderRadius: 1,
                '&:hover': {
                    '& .game-card': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    }
                },
            }}
            onClick={handleGameClick}
        >
            <Card
                className="game-card"
                sx={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    transition: 'all 0.2s ease',
                    overflow: 'hidden',
                    backgroundColor: 'background.paper',
                    '&:hover': {
                        borderColor: 'primary.main',
                    },
                }}
            >
                <Box sx={{width: '100%', height: 140, position: 'relative'}}>
                    <CardMedia
                        component="img"
                        image={game.imageUrl || `https://placehold.co/400x140/1B2838/FFFFFF?text=${encodeURIComponent(game.name)}`}
                        alt={game.name}
                        sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                        }}
                    />
                    {/* Authentication status indicator */}
                    {/*{!isAuthenticated() && (
                        <Box
                            sx={{
                                position: 'absolute',
                                top: 8,
                                right: 8,
                                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                color: 'white',
                                px: 1,
                                py: 0.5,
                                borderRadius: 1,
                                fontSize: '0.7rem',
                                fontWeight: 'bold',
                            }}
                        >
                            {isLibrary ? "Login to Play" : "Login to Purchase"}
                        </Box>
                    )}*/}
                </Box>

                <CardContent sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1.5,
                    flexGrow: 1,
                }}>
                    <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1}}>
                        <Typography
                            variant="h6"
                            component="h2"
                            fontWeight="bold"
                            lineHeight={1.2}
                            sx={{
                                fontSize: '1.1rem',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                flex: 1,
                                mr: 2,
                            }}
                        >
                            {game.name}
                        </Typography>

                        {!isLibrary && (
                            <Typography
                                variant="h6"
                                color="primary.main"
                                fontWeight="bold"
                                sx={{
                                    fontSize: '1.1rem',
                                    flexShrink: 0,
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                ${game.price.toFixed(2)}
                            </Typography>
                        )}
                    </Box>

                    <Box sx={{display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 1.5}}>
                        {game.categories.slice(0, 4).map((category) => (
                            <Chip
                                key={category}
                                label={category}
                                size="small"
                                sx={{
                                    height: 22,
                                    fontSize: '0.7rem',
                                }}
                            />
                        ))}
                    </Box>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            lineHeight: 1.5,
                            fontSize: '0.85rem',
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            flexGrow: 1,
                        }}
                    >
                        {game.description.substring(0, descriptionLimit)}
                        {game.description.length > descriptionLimit ? '...' : ''}
                    </Typography>

                    {/* Play button indicator */}
                    <Box sx={{display: 'flex', justifyContent: 'flex-end', mt: 1}}>
                        <Typography
                            variant="caption"
                            color={isAuthenticated() ? "primary.main" : "text.secondary"}
                            sx={{
                                fontWeight: 'bold',
                                fontSize: '0.75rem',
                                textTransform: 'uppercase',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5,
                            }}
                        >
                            {isLibrary
                                ? isAuthenticated()
                                    ? "Play Now →"
                                    : "Login to Play →"
                                : isAuthenticated()
                                    ? "Add to Library →"
                                    : "Login to Purchase →"}
                        </Typography>
                    </Box>
                </CardContent>
            </Card>
        </ButtonBase>
    );
}