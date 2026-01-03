import { IconButton } from "@mui/material"
import Brightness4Icon from "@mui/icons-material/Brightness4"
import Brightness7Icon from "@mui/icons-material/Brightness7"
import { useColorScheme } from "@mui/material/styles"

export function ThemeSwitcher() {
    const { mode, setMode } = useColorScheme()

    const handleToggle = () => {
        setMode(mode === "light" ? "dark" : "light")
    }

    return (
        <IconButton
            onClick={handleToggle}
            color="inherit"
            size="small"
            title={mode === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
        >
            {mode === "light" ? <Brightness4Icon/> : <Brightness7Icon/>}
        </IconButton>
    )
}
