import { Box, Typography } from '@mui/material';
import { UserSearchBar } from './UserSearchBar';

interface UsersSearchHeaderProps {
    searchTerm: string;
    onSearchTermChange: (value: string) => void;
    filteredCount: number;
}

export function UsersSearchHeader({
                                      searchTerm,
                                      onSearchTermChange,
                                      filteredCount
                                  }: UsersSearchHeaderProps) {
    return (
        <Box>
            <Box sx={{
                display: 'flex',
                gap: 2,
                mb: 3,
                alignItems: 'center'
            }}>
                <Box sx={{ flexGrow: 1 }}>
                    <UserSearchBar
                        searchTerm={searchTerm}
                        onSearchTermChange={onSearchTermChange}
                    />
                </Box>
            </Box>

            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2
            }}>
                <Typography variant="body2" color="text.secondary">
                    Showing {filteredCount} user{filteredCount !== 1 ? 's' : ''}
                    {searchTerm && ` matching "${searchTerm}"`}
                </Typography>
            </Box>
        </Box>
    );
}