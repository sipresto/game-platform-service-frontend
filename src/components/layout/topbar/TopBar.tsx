import { AppBar, Toolbar, } from '@mui/material';
import { TopBarLeft } from "./TopBarLeft.tsx";
import { TopBarRight } from "./TopBarRight.tsx";

interface TopBarProps {
    onDrawerToggle: () => void;
}

export function TopBar({ onDrawerToggle }: TopBarProps) {
    return (
        <AppBar
            position="fixed"
            sx={{
                zIndex: (theme) => theme.zIndex.drawer + 1,
                bgcolor: 'primary.main',
                height: 64,
                justifyContent: 'center',
            }}
        >
            <Toolbar sx={{ justifyContent: 'space-between' }}>
                <TopBarLeft onDrawerToggle={onDrawerToggle}/>
                <TopBarRight/>
            </Toolbar>
        </AppBar>
    );
}
