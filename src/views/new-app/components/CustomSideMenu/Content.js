import React from "react";
import { forwardRef } from "react";
import PropTypes from "prop-types";
import { Button, TextField, InputLabel, Grid } from "@mui/material";
import SubCard from "ui-component/cards/SubCard";

// eslint-disable-next-line react/display-name
const CustomTextField = forwardRef((props, ref) => <TextField inputRef={ref} {...props} />);

const Content = ({
    handleContentSubmit,
    content,
    // ref,
    selectedCard,
    handleCloseDrawer,
    contentHeaderInputRef,
    contentBodyInputRef,
    headerValues,
    contentValues
}) => {
    const headerValue = headerValues[selectedCard?.layout?.layoutid] || "";
    const contentValue = contentValues[selectedCard?.layout?.layoutid] || "";

    return (
        <SubCard title="Chart Content" sx={{ top: 0 }} style={{ height: "100%", width: "99%", padding: "2px", paddingTop: "0px" }}>
            <Grid>
                <Grid>
                    <InputLabel sx={{ paddingBottom: "10px", paddingTop: "10px" }}>Header</InputLabel>
                </Grid>
                <CustomTextField name="header" label="Header" defaultValue={headerValue} ref={contentHeaderInputRef} />
            </Grid>

            <Grid>
                <Grid>
                    <InputLabel sx={{ paddingBottom: "10px", paddingTop: "10px" }}>Content</InputLabel>
                </Grid>
                <CustomTextField
                    name="body"
                    label="Content"
                    sx={{ paddingBottom: "10px" }}
                    fullWidth
                    multiline
                    rows={5}
                    defaultValue={contentValue}
                    ref={contentBodyInputRef}
                />
            </Grid>
            <Grid container spacing={2}>
                <Grid item>
                    <Button
                        variant="contained"
                        fullWidth
                        color="primary"
                        onClick={() => handleContentSubmit(selectedCard, content)}
                        style={{ padding: "8px" }}
                    >
                        SUBMIT
                    </Button>
                </Grid>
                <Grid item>
                    <Button
                        variant="contained"
                        fullWidth
                        color="error"
                        style={{ padding: "8px" }}
                        onClick={() => handleCloseDrawer(selectedCard)}
                    >
                        CANCEL
                    </Button>
                </Grid>
            </Grid>
        </SubCard>
    );
};

Content.propTypes = {
    handleContentSubmit: PropTypes.func,
    content: PropTypes.object,
    ref: PropTypes.object,
    selectedCard: PropTypes.object,
    handleCloseDrawer: PropTypes.func,
    contentHeaderInputRef: PropTypes.object,
    contentBodyInputRef: PropTypes.object,
    headerValues: PropTypes.object,
    contentValues: PropTypes.object
};
export default Content;
