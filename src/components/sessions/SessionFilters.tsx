"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
    Button,
    Menu,
    Box,
    Typography,
    FormGroup,
    FormControlLabel,
    Checkbox,
    Divider
} from "@mui/material"
import FilterListIcon from "@mui/icons-material/FilterList"
import {
    MilitaryTech,
    Block,
    Handshake,
    SentimentVerySatisfied,
    SentimentNeutral,
    SentimentVeryDissatisfied,
    SmartToy,
    Person
} from '@mui/icons-material';

interface SessionFilterPopupProps {
    filters: {
        result: string[];
        difficulty: string[];
        opponent: string[];
    };
    onFiltersChange: (filters: { result: string[]; difficulty: string[]; opponent: string[] }) => void;
    onClearFilters: () => void;
}

export function SessionFilterPopup({ filters, onFiltersChange }: SessionFilterPopupProps) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const open = Boolean(anchorEl)

    const [internalResult, setInternalResult] = useState<string[]>(filters.result || [])
    const [internalDifficulty, setInternalDifficulty] = useState<string[]>(filters.difficulty || [])
    const [internalOpponent, setInternalOpponent] = useState<string[]>(filters.opponent || [])

    const difficultyMapping = {
        'EASY': { display: 'Easy', icon: <SentimentVerySatisfied fontSize="small" /> },
        'HARD': { display: 'Medium', icon: <SentimentNeutral fontSize="small" /> },
        'IMPOSSIBLE': { display: 'Hard', icon: <SentimentVeryDissatisfied fontSize="small" /> }
    };

    useEffect(() => {
        if (open) {
            setInternalResult(filters.result || [])
            setInternalDifficulty(filters.difficulty || [])
            setInternalOpponent(filters.opponent || [])
        }
    }, [open, filters])

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    const handleResultToggle = (value: string) => {
        const newResult = internalResult.includes(value)
            ? internalResult.filter(v => v !== value)
            : [...internalResult, value];

        setInternalResult(newResult);

        onFiltersChange({
            result: newResult,
            difficulty: internalDifficulty,
            opponent: internalOpponent
        });
    }

    const handleDifficultyToggle = (value: string) => {
        const newDifficulty = internalDifficulty.includes(value)
            ? internalDifficulty.filter(v => v !== value)
            : [...internalDifficulty, value];

        setInternalDifficulty(newDifficulty);

        onFiltersChange({
            result: internalResult,
            difficulty: newDifficulty,
            opponent: internalOpponent
        });
    }

    const handleOpponentToggle = (value: string) => {
        const newOpponent = internalOpponent.includes(value)
            ? internalOpponent.filter(v => v !== value)
            : [...internalOpponent, value];

        setInternalOpponent(newOpponent);

        onFiltersChange({
            result: internalResult,
            difficulty: internalDifficulty,
            opponent: newOpponent
        });
    }

    const handleClearFilters = () => {
        setInternalResult([]);
        setInternalDifficulty([]);
        setInternalOpponent([]);

        onFiltersChange({
            result: [],
            difficulty: [],
            opponent: []
        });
    }

    const activeFilterCount =
        (filters.result?.length || 0) +
        (filters.difficulty?.length || 0) +
        (filters.opponent?.length || 0)

    return (
        <Box>
            <Button
                variant="outlined"
                startIcon={<FilterListIcon />}
                onClick={handleClick}
                size="small"
                sx={{
                    height: '40px',
                    minWidth: 'auto',
                    px: 1.2,
                    whiteSpace: 'nowrap',
                    color: 'text.primary', borderColor: 'action.disabled',
                    '&:hover': {
                        borderColor: 'text.primary'
                    }
                }}
            >
                Filters
                {activeFilterCount > 0 && ` (${activeFilterCount})`}
            </Button>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                slotProps={{
                    paper: {
                        sx: {
                            width: 320,
                            maxHeight: 500,
                            p: 2,
                        },
                    },
                }}
            >
                <Box sx={{ px: 1 }}>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        Your Result
                    </Typography>
                    <FormGroup sx={{ mb: 2 }}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={internalResult.includes('WIN')}
                                    onChange={() => handleResultToggle('WIN')}
                                />
                            }
                            label={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <MilitaryTech fontSize="small" />
                                    Win
                                </Box>
                            }
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={internalResult.includes('LOSS')}
                                    onChange={() => handleResultToggle('LOSS')}
                                />
                            }
                            label={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Block fontSize="small" />
                                    Loss
                                </Box>
                            }
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={internalResult.includes('DRAW')}
                                    onChange={() => handleResultToggle('DRAW')}
                                />
                            }
                            label={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Handshake fontSize="small" />
                                    Draw
                                </Box>
                            }
                        />
                    </FormGroup>

                    <Divider sx={{ my: 2 }} />

                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        Difficulty
                    </Typography>
                    <FormGroup sx={{ mb: 2 }}>
                        {Object.entries(difficultyMapping).map(([backendValue, config]) => (
                            <FormControlLabel
                                key={backendValue}
                                control={
                                    <Checkbox
                                        checked={internalDifficulty.includes(backendValue)}
                                        onChange={() => handleDifficultyToggle(backendValue)}
                                    />
                                }
                                label={
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        {config.icon}
                                        {config.display}
                                    </Box>
                                }
                            />
                        ))}
                    </FormGroup>

                    <Divider sx={{ my: 2 }} />

                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        Opponent
                    </Typography>
                    <FormGroup sx={{ mb: 2 }}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={internalOpponent.includes('ai')}
                                    onChange={() => handleOpponentToggle('ai')}
                                />
                            }
                            label={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <SmartToy fontSize="small" />
                                    vs AI
                                </Box>
                            }
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={internalOpponent.includes('player')}
                                    onChange={() => handleOpponentToggle('player')}
                                />
                            }
                            label={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Person fontSize="small" />
                                    vs Player
                                </Box>
                            }
                        />
                    </FormGroup>

                    <Divider sx={{ my: 2 }} />

                    <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
                        <Button onClick={handleClearFilters} size="small" sx={{color: 'text.primary'}}>
                            Clear All Filters
                        </Button>
                    </Box>
                </Box>
            </Menu>
        </Box>
    )
}