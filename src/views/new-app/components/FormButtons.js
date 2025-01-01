import React from "react";
import PropTypes from "prop-types";
import { Grid, FormControl, Button } from "@mui/material";
// import SendIcon from "@mui/icons-material/Send";
// import CloseIcon from "@mui/icons-material/Close";

const FormFooterButtons = ({ onSubmit, onCancel }) => (
    <Grid item xs={12} sm={12} style={{ padding: "7px 0px", margin: "5px" }}>
        <Grid item xs={12} sm={12}>
            <Grid container justifyContent="space-between">
                <FormControl sx={{ m: 1, minWidth: 120, width: "45%" }}>
                    <Button type="submit" onClick={onSubmit} variant="contained">
                        SUBMIT
                    </Button>
                </FormControl>
                <FormControl sx={{ m: 1, minWidth: 120, width: "45%" }}>
                    <Button type="button" onClick={onCancel} color="secondary" variant="contained">
                        Cancel
                    </Button>
                </FormControl>
            </Grid>
        </Grid>
    </Grid>
);

FormFooterButtons.propTypes = {
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func
};

export default FormFooterButtons;
