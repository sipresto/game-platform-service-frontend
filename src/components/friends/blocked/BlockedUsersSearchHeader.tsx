import { Box, TextField, Typography, Tooltip, IconButton } from '@mui/material';
import { Refresh } from '@mui/icons-material';

interface BlockedUsersSearchHeaderProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    onRefresh?: () => void | Promise<void>;
    isRefreshing?: boolean;
    filteredCount: number;
    totalCount: number;
}

export function BlockedUsersSearchHeader({
                                             searchTerm,
                                             onSearchChange,
                                             onRefresh,
                                             isRefreshing,
                                             filteredCount,
                                             totalCount
                                         }: BlockedUsersSearchHeaderProps) {
    const handleRefresh = () => {
        if (onRefresh && !isRefreshing) {
            const result = onRefresh();
            if (result instanceof Promise) {
                return result;
            }
        }
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', alignItems: 'center' }}>
                <TextField
                    placeholder="Search blocked users..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    size="small"
                    sx={{ flexGrow: 1, minWidth: 200 }}
                />

                {onRefresh && (
                    <Tooltip title="Refresh blocked users">
                        <IconButton
                            onClick={handleRefresh}
                            disabled={isRefreshing}
                            size="small"
                        >
                            <Refresh
                                sx={{
                                    animation: isRefreshing ? 'spin 1s linear infinite' : 'none'
                                }}
                            />
                        </IconButton>
                    </Tooltip>
                )}
            </Box>

            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2
            }}>
                <Typography variant="body2" color="text.secondary">
                    Showing {filteredCount} of {totalCount} blocked user{totalCount !== 1 ? 's' : ''}
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