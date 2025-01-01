import React, { useState } from "react";
import PropTypes from "prop-types";

import { Grid, Radio, RadioGroup, FormControlLabel } from "@mui/material";

import SubCard from "ui-component/cards/SubCard";

const TextStyle = ({ handleFontStyleClick }) => {
    const [textStyle, setTextStyle] = useState("light");
    // const [currentColor, setCurrentColor] = useState("black");

    const handleTextStyleChange = (event) => {
        setTextStyle(event.target.value);
        handleFontStyleClick(event.target.value);
    };

    return (
        <SubCard title="Font Style" sx={{ top: 0 }} style={{ height: "100%", width: "99%", padding: "4px", paddingTop: "0px" }}>
            <Grid container direction="column" spacing={2} style={{ padding: "4px" }}>
                <RadioGroup value={textStyle} onChange={handleTextStyleChange}>
                    <FormControlLabel value="light" control={<Radio />} label="light" />
                    <FormControlLabel value="bold" control={<Radio />} label="Bold" />
                    <FormControlLabel value="medium" control={<Radio />} label="medium" />
                    <FormControlLabel value="semibold" control={<Radio />} label="semibold" />
                </RadioGroup>
            </Grid>
        </SubCard>
    );
};
TextStyle.propTypes = {
    handleFontStyleClick: PropTypes.func
};

export default TextStyle;
