import React from 'react';
import { TextField, InputAdornment, Paper } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import IconButton from '@mui/material/IconButton';

interface UserSearchBarProps {
    searchTerm: string;
    onSearchTermChange: (term: string) => void;
}

export function UserSearchBar({ searchTerm, onSearchTermChange }: UserSearchBarProps) {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onSearchTermChange(event.target.value);
    };

    const handleClear = () => {
        onSearchTermChange('');
    };

    return (
        <Paper elevation={1} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
            <TextField
                fullWidth
                label="Search users by name"
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
                        endAdornment: searchTerm && (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="Clear search"
                                    onClick={handleClear}
                                    edge="end"
                                    size="small"
                                >
                                    <ClearIcon />
                                </IconButton>
                            </InputAdornment>
                        ),
                    },
                }}
                sx={{
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 1,
                    }
                }}
                placeholder="Search by display name or username..."
            />
        </Paper>
    );
}