import React from 'react';
import { TextField, InputAdornment, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface GameSearchProps {
    searchTerm: string;
    onSearchTermChange: (term: string) => void;
}

export function GameSearch({ searchTerm, onSearchTermChange }: GameSearchProps) {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onSearchTermChange(event.target.value);
    };

    return (
        <Box sx={{ mb: 4 }}>
            <TextField
                fullWidth
                label="Search for Games by Name"
                variant="outlined"
                value={searchTerm}
                onChange={handleChange}
                slotProps={{
                    input: {
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    },
                }}
            />
        </Box>
    );
}