import React, { useState } from "react";
import MainCard from "./cards/MainCard";
import { gridSpacing } from "store/constant";

import { Grid, TextField, Typography, Select, MenuItem, InputLabel, FormControl } from "@mui/material";

// project imports
import { useDispatch, useSelector } from "store";
import { openSnackbar } from "store/slices/snackbar";
import { useTheme } from "@mui/material/styles";

// API Config
import { postCatalog, GetAccessToken } from "views/api-configuration/default";

import { baseApi } from "store/slices/initial-data";
import FormFooterButtons from "../FormButtons";
import api from "views/api-configuration/api";
import PropTypes from "prop-types";
const tableType = ["RAW", "FEATURE"];

const DataCollectionForm = (props) => {
    const { handleCloseDrawer } = props;
    const dispatch = useDispatch();
    const theme = useTheme();
    const { selectedDataset } = useSelector((state) => state.userLogin);

    const [formData, setFormData] = useState({
        catalogsid: 0,
        productclientdatasetsid: selectedDataset.productclientdatasetsid,
        partialloadedlocation: "",
        tableloadstatus: "INITIATED",
        tablename: "",
        tabletype: "",
        updatedatetime: "",
        createdatetime: ""
    });

    // eslint-disable-next-line no-unused-vars
    const [localFIle, setLocalFile] = useState();

    const changeFieldValue = (e) => {
        if (e.target.name === "tableLcation") {
            const formData = new FormData();
            formData.append("file", e.target.files[0]);
            setLocalFile(formData);
        }
        const data = { ...formData };
        data[e.target.name] = e.target.value;
        setFormData(data);
    };

    const submitForm = (e) => {
        e.preventDefault();
        api.post(postCatalog, formData, { headers: GetAccessToken() })
            .then(() => {
                dispatch(
                    openSnackbar({
                        open: true,
                        message: "Catalog Created Successfully",
                        variant: "alert",
                        alert: {
                            color: "success"
                        },
                        close: false
                    })
                );
                dispatch(baseApi());
            })
            .catch((response) => {
                dispatch(
                    openSnackbar({
                        open: true,
                        message: "Error Creating Catalog Record",
                        variant: "alert",
                        alert: {
                            color: "error"
                        },
                        close: false
                    })
                );
                return response;
            });
    };

    return (
        <Grid container spacing={0} alignItems="right" style={{ minHeight: "100vh" }}>
            <MainCard
                content={false}
                title={
                    <Grid container justifyContent="space-between" spacing={gridSpacing}>
                        <Grid item>
                            <Typography variant="h3" component="div" align="center" sx={{ color: theme.palette.primary.dark }}>
                                Add Your Catalog
                            </Typography>
                        </Grid>
                    </Grid>
                }
                style={{ width: "100%", height: "fit-content" }}
            >
                <Grid container spacing={2} p={2}>
                    <Grid item xs={12} lg={6}>
                        <FormControl sx={{ m: 1, minWidth: 120, width: "100%" }}>
                            <TextField
                                fullWidth
                                id="cv"
                                name="tablename"
                                label="Domain Name"
                                onChange={changeFieldValue}
                                variant="outlined"
                            />
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        {" "}
                        <FormControl sx={{ m: 1, minWidth: 120, width: "100%" }}>
                            <InputLabel id="t-t">Table Type</InputLabel>
                            <Select
                                labelId="t-t"
                                id="tableType"
                                name="tabletype"
                                label="Table Type"
                                onChange={changeFieldValue}
                                fullWidth
                                variant="outlined"
                            >
                                {tableType.map((item, indx) => (
                                    <MenuItem key={indx} value={item}>
                                        {item}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} lg={6}>
                        {" "}
                        <FormControl sx={{ m: 1, minWidth: 120, width: "100%" }}>
                            <TextField
                                labelId="label"
                                id="label"
                                name="label"
                                label="Domain Label"
                                onChange={changeFieldValue}
                                fullWidth
                                variant="outlined"
                            />
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <FormFooterButtons onSubmit={submitForm} onCancel={handleCloseDrawer} />
                    </Grid>
                </Grid>
            </MainCard>
        </Grid>
    );
};

DataCollectionForm.propTypes = {
    handleCloseDrawer: PropTypes.func
};

export default DataCollectionForm;
