import { Box, Typography, Tooltip, IconButton } from '@mui/material';
import { Refresh } from '@mui/icons-material';
import { UserSearchBar } from './UserSearchBar';

interface UsersSearchHeaderProps {
    searchTerm: string;
    onSearchTermChange: (value: string) => void;
    onRefresh: () => void;
    isRefreshing: boolean;
    filteredCount: number;
}

export function UsersSearchHeader({
                                      searchTerm,
                                      onSearchTermChange,
                                      onRefresh,
                                      isRefreshing,
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

                <Tooltip title="Refresh users list">
                    <IconButton
                        onClick={onRefresh}
                        disabled={isRefreshing}
                        sx={{
                            bgcolor: 'background.paper',
                            border: '1px solid',
                            borderColor: 'divider',
                            '&:hover': {
                                bgcolor: 'action.hover'
                            }
                        }}
                    >
                        <Refresh
                            sx={{
                                animation: isRefreshing ? 'spin 1s linear infinite' : 'none'
                            }}
                        />
                    </IconButton>
                </Tooltip>
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

                {isRefreshing && (
                    <Typography variant="caption" color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Refresh sx={{ fontSize: 14, animation: 'spin 1s linear infinite' }} />
                        Refreshing...
                    </Typography>
                )}
            </Box>
        </Box>
    );
}