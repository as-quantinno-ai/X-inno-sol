import React from "react";
import { Grid, FormControl, IconButton } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import PropTypes from "prop-types";
const FormHeader = ({ onCancel }) => (
    <Grid container spacing={0} style={{ padding: "0px", margin: "0px", display: "flex", alignItems: "center" }}>
        <Grid item xs={11} sm={11} lg={11} />
        <Grid item xs={1} sm={1} lg={1}>
            <FormControl sx={{ m: 1, paddingLeft: 3, minWidth: 0 }}>
                <IconButton onClick={onCancel} aria-label="Cancel">
                    <CancelIcon color="error" />
                </IconButton>
            </FormControl>
        </Grid>
    </Grid>
);
FormHeader.propTypes = {
    onCancel: PropTypes.func
};

export default FormHeader;
