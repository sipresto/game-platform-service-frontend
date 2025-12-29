import { Button, ButtonGroup, Paper } from '@mui/material';
import { TuneOutlined, ViewListOutlined } from '@mui/icons-material';

type ViewMode = 'simple' | 'advanced';

interface ViewModeToggleProps {
    viewMode: ViewMode;
    onChange: (mode: ViewMode) => void;
}

export function ViewModeToggle({ viewMode, onChange }: ViewModeToggleProps) {
    return (
        <Paper
            elevation={0}
            sx={{
                p: 1,
                mb: 3,
                border: 1,
                borderColor: 'divider',
                display: 'inline-flex',
                borderRadius: 2
            }}
        >
            <ButtonGroup variant="outlined" size="small">
                <Button
                    onClick={() => onChange('simple')}
                    variant={viewMode === 'simple' ? 'contained' : 'outlined'}
                    startIcon={<ViewListOutlined />}
                >
                    Simple
                </Button>
                <Button
                    onClick={() => onChange('advanced')}
                    variant={viewMode === 'advanced' ? 'contained' : 'outlined'}
                    startIcon={<TuneOutlined />}
                >
                    Advanced
                </Button>
            </ButtonGroup>
        </Paper>
    );
}