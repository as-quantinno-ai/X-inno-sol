import React, { useState } from "react";
import MainCard from "./cards/MainCard";
import { gridSpacing } from "store/constant";

import { Grid, TextField, Typography, Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import PropTypes from "prop-types";
import { useDispatch } from "store";
import { openSnackbar } from "store/slices/snackbar";
import { useTheme } from "@mui/material/styles";

// API Config
import { GetJWT, createEvent } from "views/api-configuration/default";

// import SendIcon from "@mui/icons-material/Send";
import api from "views/api-configuration/api";
import { useSelector } from "react-redux";
import FormFooterButtons from "../FormButtons";

const EventForm = ({ buttonId, handleToggle }) => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const { forms } = useSelector((state) => state.globe);

    const [formData, setFormData] = useState({
        buttonId,
        eventApi: "",
        eventType: "",
        referenceId: 0
    });

    const changeFieldValue = (e) => {
        const data = { ...formData };
        data[e.target.name] = e.target.value;
        setFormData(data);
    };

    const submitForm = (e) => {
        e.preventDefault();
        api.post(createEvent, formData, {
            headers: {
                Authorization: `Bearer ${GetJWT()}`
            }
        })
            .then(() => {
                dispatch(
                    openSnackbar({
                        open: true,
                        message: "Event Added Successfully",
                        variant: "alert",
                        alert: {
                            color: "success"
                        },
                        close: false
                    })
                );
            })
            .catch((err) => {
                console.log("EventForm", err);
                dispatch(
                    openSnackbar({
                        open: true,
                        message: "Error Creating Event Record",
                        variant: "alert",
                        alert: {
                            color: "error"
                        },
                        close: false
                    })
                );
            });
    };

    return (
        <Grid container spacing={0} alignItems="right">
            <MainCard
                content={false}
                title={
                    <Grid container justifyContent="space-between" spacing={gridSpacing}>
                        <Grid item>
                            <Typography variant="h3" component="div" align="center" sx={{ color: theme.palette.primary.dark }}>
                                Add Event
                            </Typography>
                        </Grid>
                    </Grid>
                }
                style={{ width: "100%", height: "fit-content" }}
            >
                <Grid container spacing={2} p={2}>
                    <Grid item xs={12} sm={6}>
                        {" "}
                        <FormControl sx={{ m: 1, minWidth: 120, width: "100%" }}>
                            {/* formId for DATA-FORM, file-absolute-location for LOCALFS */}
                            <TextField
                                fullWidth
                                id="eventApi"
                                name="eventApi"
                                label="Event API"
                                onChange={changeFieldValue}
                                variant="outlined"
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} lg={6}>
                        <FormControl sx={{ m: 1, minWidth: 120, width: "100%" }}>
                            <InputLabel id="format-label">Event Type</InputLabel>
                            <Select
                                labelId="format-label"
                                id="eventType"
                                name="eventType"
                                label="Event Type"
                                onChange={changeFieldValue}
                                variant="outlined"
                                fullWidth
                            >
                                <MenuItem>-------------</MenuItem>
                                <MenuItem value="SHOW DETAILS">SHOW DETAILS</MenuItem>
                                <MenuItem value="REDIRECT TO DASHBOARD">REDIRECT TO DASHBOARD</MenuItem>
                                <MenuItem value="EMAIL">EMAIL</MenuItem>
                                <MenuItem value="EDIT">EDIT</MenuItem>
                                <MenuItem value="ADD">ADD</MenuItem>
                                <MenuItem value="DELETE">DELETE</MenuItem>
                                <MenuItem value="NOTIFICATION">NOTIFICATION</MenuItem>
                                <MenuItem value="EXECUTE API - SHOW DETAILS">EXECUTE API - SHOW DETAILS</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        {formData.eventType === "EDIT" || formData.eventType === "ADD" || formData.eventType === "DELETE" ? (
                            <FormControl fullWidth sx={{ marginTop: 3 }}>
                                <InputLabel>Select Form</InputLabel>
                                <Select id="referenceId" name="referenceId" label="Reference Id" onChange={changeFieldValue}>
                                    {forms.map((item, index) => (
                                        <MenuItem key={index} value={item.formid}>
                                            {item.formtitle}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        ) : (
                            <FormControl sx={{ m: 1, minWidth: 120, width: "100%" }}>
                                <TextField
                                    fullWidth
                                    id="referenceId"
                                    name="referenceId"
                                    label="Reference Id"
                                    type="number"
                                    onChange={changeFieldValue}
                                    variant="outlined"
                                />
                            </FormControl>
                        )}
                    </Grid>

                    <Grid item xs={12} sm={12}>
                        <FormFooterButtons onSubmit={submitForm} onCancel={handleToggle} />
                    </Grid>
                </Grid>
            </MainCard>
        </Grid>
    );
};

EventForm.propTypes = {
    buttonId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    handleToggle: PropTypes.func
};
export default EventForm;
