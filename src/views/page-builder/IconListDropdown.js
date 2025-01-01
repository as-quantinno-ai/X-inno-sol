import React, { useState, useRef, useMemo } from "react";
import { CircularProgress, Box, FormControl, InputLabel, MenuItem, Select, ListSubheader, TextField, InputAdornment } from "@mui/material";
import * as MuiIcons from "@mui/icons-material";
import SearchIcon from "@mui/icons-material/Search";
import PropTypes from "prop-types";
// const IconListDropdown = ({ handleIconChange, selectedIcon, style, size, type }) => {
const IconListDropdown = ({ handleIconChange, selectedIcon, size, type }) => {
    const formatIconName = (name) => (name ? name.replace(/([A-Z])/g, " $1").trim() : "");
    const [visibleItems, setVisibleItems] = useState(10);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState("");
    const searchTimeoutRef = useRef(null);
    const iconList = useMemo(
        () =>
            Object.keys(MuiIcons).map((iconName) => ({
                name: iconName,
                icon: MuiIcons[iconName]
            })),
        []
    );

    const filteredIconList = useMemo(() => {
        const lowerCaseSearchText = searchText.toLowerCase();
        return searchText
            ? iconList.filter((iconItem) => iconItem.name.toLowerCase().includes(lowerCaseSearchText))
            : iconList.slice(0, visibleItems);
    }, [searchText, visibleItems, iconList]);

    const loadMoreItems = () => {
        if ((!searchText && visibleItems < iconList.length) || (searchText && visibleItems < filteredIconList.length)) {
            setLoading(true);
            setTimeout(() => {
                setVisibleItems((prev) => prev + 10);
                setLoading(false);
            }, 1000);
        }
    };

    const handleScroll = (event) => {
        const { scrollHeight, scrollTop, clientHeight } = event.target;
        const threshold = 5;
        const isAtBottom = Math.abs(scrollHeight - scrollTop - clientHeight) <= threshold;

        if (isAtBottom && !loading) {
            loadMoreItems();
        }
    };

    const handleSearchChange = (event) => {
        const value = event.target.value;

        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        searchTimeoutRef.current = setTimeout(() => {
            setSearchText(value);
        }, 300);
    };

    const clearSearchText = () => {
        setSearchText("");
    };

    const validSelectedIcon = useMemo(() => iconList.find((iconItem) => iconItem.name === selectedIcon) || {}[(iconList, selectedIcon)]);

    return (
        <FormControl fullWidth size={size}>
            <InputLabel>{`${type} Icon`}</InputLabel>
            <Select
                labelId="select-icon"
                id="select-icon"
                className="custom-form-inps"
                value={selectedIcon || ""}
                onChange={handleIconChange}
                label={`${type} Icon`}
                name="style"
                required
                style={{ height: 40 }}
                onScroll={handleScroll}
                MenuProps={{
                    PaperProps: {
                        style: {
                            maxHeight: 300,
                            marginTop: 10
                        },
                        onScroll: (event) => {
                            handleScroll(event);
                        }
                    }
                }}
                onClose={clearSearchText}
            >
                <ListSubheader>
                    <TextField
                        size="small"
                        autoFocus
                        placeholder="Type to search..."
                        fullWidth
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            )
                        }}
                        sx={{ marginTop: "8px" }}
                        onChange={handleSearchChange}
                        onKeyDown={(e) => {
                            if (e.key !== "Escape") {
                                e.stopPropagation();
                            }
                        }}
                    />
                </ListSubheader>
                {filteredIconList.map((iconItem) => (
                    <MenuItem key={iconItem.name} value={iconItem.name}>
                        {React.createElement(iconItem.icon)} {formatIconName(iconItem.name)}
                    </MenuItem>
                ))}
                {validSelectedIcon?.name && !filteredIconList.some((item) => item.name === validSelectedIcon.name) && (
                    <MenuItem key={validSelectedIcon.name} value={validSelectedIcon.name}>
                        {React.createElement(validSelectedIcon.icon)} {formatIconName(validSelectedIcon.name)}
                    </MenuItem>
                )}

                {loading && (
                    <MenuItem disabled>
                        <Box display="flex" alignItems="center" justifyContent="center" width="100%" height="100%">
                            <CircularProgress size={20} sx={{ alignSelf: "center" }} />
                        </Box>
                    </MenuItem>
                )}
            </Select>
        </FormControl>
    );
};

IconListDropdown.propTypes = {
    handleIconChange: PropTypes.func,
    selectedIcon: PropTypes.string,
    // style: PropTypes.string,
    size: PropTypes.string,
    type: PropTypes.string
};
export default IconListDropdown;
