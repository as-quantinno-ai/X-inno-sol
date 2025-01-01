import React, { useState } from "react";
import PropTypes from "prop-types";

import { Select, MenuItem } from "@mui/material";

import SubCard from "ui-component/cards/SubCard";

function FontColor({ handleForegroundColorClick }) {
    const [foregroundColor, setForegroundColor] = useState("#000000");

    const handleForegroundColorChange = (event) => {
        setForegroundColor(event.target.value);
        handleForegroundColorClick(event.target.value);
    };

    return (
        <SubCard title="Text Color" sx={{ top: 0 }} style={{ height: "100%", width: "99%", padding: "4px", paddingTop: "0px" }}>
            <Select value={foregroundColor} onChange={handleForegroundColorChange}>
                <MenuItem value="#000000">Black</MenuItem>
                <MenuItem value="#FFFFFF">White</MenuItem>
                <MenuItem value="#FF0000">Red</MenuItem>
                <MenuItem value="#00FF00">Green</MenuItem>
                <MenuItem value="#0000FF">Blue</MenuItem>
            </Select>
        </SubCard>
    );
}

FontColor.propTypes = {
    handleForegroundColorClick: PropTypes.func
};
export default FontColor;
