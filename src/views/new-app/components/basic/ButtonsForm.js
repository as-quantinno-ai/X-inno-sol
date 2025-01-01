import React, { useState } from "react";
import MainCard from "./cards/MainCard";
import { gridSpacing } from "store/constant";

import { Grid, TextField, Typography, Select, MenuItem, InputLabel, FormControl } from "@mui/material";

import { useDispatch } from "store";
import { openSnackbar } from "store/slices/snackbar";
import { useTheme } from "@mui/material/styles";
// API Config
import { GetJWT, createButton } from "views/api-configuration/default";
import PropTypes from "prop-types";
import FormButtons from "../FormButtons";
import IconListDropdown from "views/page-builder/IconListDropdown";
import api from "views/api-configuration/api";

const ButtonsForm = ({ datasetid, tableid, tablename, componentdataid = null, handleCloseDrawer }) => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const [selectedIcon, setSelectedIcon] = useState(null);
    const [formData, setFormData] = useState({
        buttonName: "string",
        buttonStyle: "string",
        buttonType: "string",
        productClientDatasetsId: datasetid,
        componentDataId: componentdataid,
        tableId: tableid
    });

    const changeFieldValue = (e) => {
        const data = { ...formData };

        if (e.target.name === "style") {
            data.buttonStyle = JSON.stringify({ icon: e.target.value });
            setSelectedIcon(e.target.value);
        } else {
            data[e.target.name] = e.target.value;
        }
        setFormData(data);
    };

    const submitForm = (e) => {
        e.preventDefault();
        api.post(createButton, formData, {
            headers: {
                Authorization: `Bearer ${GetJWT()}`
            }
        })
            // eslint-disable-next-line no-unused-vars
            .then((res) => {
                dispatch(
                    openSnackbar({
                        open: true,
                        message: "Button Added Successfully",
                        variant: "alert",
                        alert: {
                            color: "success"
                        },
                        close: false
                    })
                );
            })
            .catch((err) => {
                console.error("error in buttonForm", err);
                dispatch(
                    openSnackbar({
                        open: true,
                        message: "Error Creating Button Record",
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
                                Add Button ({tablename.replace(/_/g, " ")})
                            </Typography>
                        </Grid>
                    </Grid>
                }
                style={{ width: "100%", height: "fit-content" }}
            >
                <form onSubmit={submitForm}>
                    <Grid container spacing={2} p={2}>
                        <Grid item xs={12} sm={12}>
                            <FormControl sx={{ m: 1, minWidth: 120, width: "100%" }}>
                                {/* formId for DATA-FORM, file-absolute-location for LOCALFS */}
                                <TextField
                                    fullWidth
                                    id="buttonName"
                                    name="buttonName"
                                    label="Button Name"
                                    onChange={changeFieldValue}
                                    variant="outlined"
                                />
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={12}>
                            <IconListDropdown handleIconChange={changeFieldValue} selectedIcon={selectedIcon} size="small" type="Button" />
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <FormControl sx={{ m: 1, minWidth: 120, width: "100%" }}>
                                {/* formId for DATA-FORM, file-absolute-location for LOCALFS */}
                                <TextField
                                    fullWidth
                                    id="buttonStyle"
                                    name="buttonStyle"
                                    label="Button Style ( JSON )"
                                    onChange={changeFieldValue}
                                    variant="outlined"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <FormControl sx={{ m: 1, minWidth: 120, width: "100%" }} size="small">
                                <InputLabel id="format-label">Button Type</InputLabel>
                                <Select
                                    labelId="format-label"
                                    id="buttonType"
                                    name="buttonType"
                                    label="Button Type"
                                    onChange={changeFieldValue}
                                    variant="outlined"
                                    fullWidth
                                >
                                    <MenuItem>-------------</MenuItem>
                                    <MenuItem value="RECORD">RECORD</MenuItem>
                                    <MenuItem value="TABLE">TABLE</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} lg={12}>
                            <FormButtons onCancel={handleCloseDrawer} />
                        </Grid>
                    </Grid>
                </form>
            </MainCard>
        </Grid>
    );
};

ButtonsForm.propTypes = {
    datasetid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    tableid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    tablename: PropTypes.string,
    componentdataid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    handleCloseDrawer: PropTypes.func
};

export default ButtonsForm;
