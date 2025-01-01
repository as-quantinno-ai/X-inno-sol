import React, { useState } from "react";
import PropTypes from "prop-types";

import { Select, MenuItem } from "@mui/material";

import SubCard from "ui-component/cards/SubCard";

const FontSize = ({ handleFontSizeClick }) => {
    const [fontSize, setFontSize] = useState(12);

    const handleFontSizeChange = (event) => {
        setFontSize(event.target.value);
        handleFontSizeClick(`${event.target.value}px`);
    };

    return (
        <SubCard title="Font Size" sx={{ top: 0 }} style={{ height: "100%", width: "99%", padding: "4px", paddingTop: "0px" }}>
            <Select value={fontSize} onChange={handleFontSizeChange}>
                <MenuItem value={12}>12</MenuItem>
                <MenuItem value={14}>14</MenuItem>
                <MenuItem value={16}>16</MenuItem>
                <MenuItem value={18}>18</MenuItem>
                <MenuItem value={20}>20</MenuItem>
            </Select>
        </SubCard>
    );
};

FontSize.propTypes = {
    handleFontSizeClick: PropTypes.func
};
export default FontSize;
