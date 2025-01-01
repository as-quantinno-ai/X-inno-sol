import React, { useState } from "react";
import PropTypes from "prop-types";

import { Select, MenuItem } from "@mui/material";
import SubCard from "ui-component/cards/SubCard";

function FontFamily({ handleFontFamilyClick }) {
    const [font, setFont] = useState("Arial");

    const handleFontChange = (event) => {
        setFont(event.target.value);
        handleFontFamilyClick(event.target.value);
    };

    return (
        <SubCard title="Font Size" sx={{ top: 0 }} style={{ height: "100%", width: "99%", padding: "4px", paddingTop: "0px" }}>
            <Select value={font} onChange={handleFontChange}>
                <MenuItem value="Arial">Arial</MenuItem>
                <MenuItem value="Helvetica">Helvetica</MenuItem>
                <MenuItem value="Times New Roman">Times New</MenuItem>
                <MenuItem value="Georgia">Georgia</MenuItem>
                <MenuItem value="Verdana">Verdana</MenuItem>
            </Select>
        </SubCard>
    );
}

FontFamily.propTypes = {
    handleFontFamilyClick: PropTypes.func
};
export default FontFamily;
