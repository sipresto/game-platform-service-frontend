"use client"

import type React from "react"
import { useState } from "react"
import { Button, Menu, Box, Typography, Slider, FormGroup, FormControlLabel, Checkbox, Divider } from "@mui/material"
import FilterListIcon from "@mui/icons-material/FilterList"
import type { GameFilterRequest } from "../model/gameRequest"

interface GameFilterProps {
    filters: GameFilterRequest
    onFiltersChange: (filters: GameFilterRequest) => void
}

const CATEGORIES = [
    { value: "STRATEGY", label: "Strategy" },
    { value: "BOARDGAME", label: "Board Game" },
    { value: "CARDGAME", label: "Card Game" },
    { value: "NATIVE", label: "Native" },
    { value: "EXTERNAL", label: "External" },
]

export function GameFilter({ filters, onFiltersChange }: GameFilterProps) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const open = Boolean(anchorEl)

    const [priceRange, setPriceRange] = useState<number[]>([filters.minPrice ?? 0, filters.maxPrice ?? 50])

    const [selectedCategories, setSelectedCategories] = useState<string[]>(filters.categories ?? [])

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    const handlePriceChange = (_event: Event, newValue: number | number[]) => {
        setPriceRange(newValue as number[])
    }

    const handleCategoryToggle = (category: string) => {
        setSelectedCategories((prev) => {
            if (prev.includes(category)) {
                return prev.filter((c) => c !== category)
            } else {
                return [...prev, category]
            }
        })
    }

    const handleApplyFilters = () => {
        const newFilters: GameFilterRequest = {
            minPrice: priceRange[0],
            maxPrice: priceRange[1] >= 50 ? undefined : priceRange[1],
            categories: selectedCategories.length > 0 ? selectedCategories : undefined,
        }
        onFiltersChange(newFilters)
        handleClose()
    }

    const handleClearFilters = () => {
        setPriceRange([0, 50])
        setSelectedCategories([])
        onFiltersChange({})
        handleClose()
    }

    const activeFilterCount =
        (filters.minPrice !== undefined || filters.maxPrice !== undefined ? 1 : 0) + (filters.categories?.length ?? 0)

    return (
        <Box>
            <Button variant="outlined" startIcon={<FilterListIcon />} onClick={handleClick} sx={{ mb: 4 }}>
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
                        Price Range
                    </Typography>
                    <Box sx={{ px: 1, mb: 2 }}>
                        <Slider
                            value={priceRange}
                            onChange={handlePriceChange}
                            valueLabelDisplay="auto"
                            min={0}
                            max={50}
                            marks={[
                                { value: 0, label: "€0" },
                                { value: 50, label: "€50+" },
                            ]}
                        />
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            €{priceRange[0]} - {priceRange[1] >= 50 ? "€50+" : `€${priceRange[1]}`}
                        </Typography>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        Categories
                    </Typography>
                    <FormGroup>
                        {CATEGORIES.map((category) => (
                            <FormControlLabel
                                key={category.value}
                                control={
                                    <Checkbox
                                        checked={selectedCategories.includes(category.value)}
                                        onChange={() => handleCategoryToggle(category.value)}
                                    />
                                }
                                label={category.label}
                            />
                        ))}
                    </FormGroup>

                    <Divider sx={{ my: 2 }} />

                    <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
                        <Button onClick={handleClearFilters} size="small">
                            Clear
                        </Button>
                        <Button onClick={handleApplyFilters} variant="contained" size="small">
                            Apply
                        </Button>
                    </Box>
                </Box>
            </Menu>
        </Box>
    )
}
