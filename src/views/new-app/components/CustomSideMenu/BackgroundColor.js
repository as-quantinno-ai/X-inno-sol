import React, { useState } from "react";
import { ChromePicker } from "react-color";
import SubCard from "ui-component/cards/SubCard";
// import { Grid, Avatar, Button } from "@mui/material";
import PropTypes from "prop-types";
const BackgroundColor = ({ handleBackgroundColorClick }) => {
    const [color, setColor] = useState("#fff");

    const handleBackgroundColorChange = (updatedcolor) => {
        setColor(updatedcolor);
        handleBackgroundColorClick(updatedcolor);
    };

    return (
        <SubCard title="Background Color" sx={{ top: 0 }} style={{ height: "100%", width: "100%", padding: "0px", paddingTop: "0px" }}>
            <ChromePicker
                color={color}
                onChange={(updatedcolor) => handleBackgroundColorChange(updatedcolor.hex)}
                disableAlpha
                width="200px"
            />
        </SubCard>
    );
};

BackgroundColor.propTypes = {
    handleBackgroundColorClick: PropTypes.func
};
export default BackgroundColor;
