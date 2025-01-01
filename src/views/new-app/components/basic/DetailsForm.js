import React, { useState } from "react";
import MainCard from "./cards/MainCard";
import { gridSpacing } from "store/constant";
import PropTypes from "prop-types";
import { Grid, TextField, Typography, Button, Select, MenuItem, InputLabel, FormControl } from "@mui/material";

// project imports
// import { DataSourceProvider, useDataSource } from "contexts/DataSourcesContext";
import { useDataSource } from "contexts/DataSourcesContext";
import { useDispatch, useSelector } from "store";
import { openSnackbar } from "store/slices/snackbar";
import { useTheme } from "@mui/material/styles";

// API Config
// import { catalogList, postCatalog, uploadFile, GetAccessToken } from "views/api-configuration/default";
import { postCatalog, GetAccessToken } from "views/api-configuration/default";
// import { getAllCatalogs } from "store/slices/AppDashboardRawSha";

import SendIcon from "@mui/icons-material/Send";
// import { baseApi, selectBaseData } from "store/slices/initial-data";
import { baseApi } from "store/slices/initial-data";
import FormFooterButtons from "../FormButtons";
import api from "views/api-configuration/api";

const tableType = ["RAW", "FEATURE"];

// const DetailsForm = ({ handleCloseDrawer, selectedRecord, id, dashDatasetId, dashTableId, recId }) => {
const DetailsForm = ({ handleCloseDrawer }) => {
    const dispatch = useDispatch();
    const theme = useTheme();
    // const successSX = { color: "success.dark" };
    // const errorSX = { color: "error.main" };

    const [dataSources, setDataSources] = useDataSource([]);
    // eslint-disable-next-line no-unused-vars
    const changeDataSources = (dataSource) => {
        setDataSources([...dataSources, dataSource]);
    };

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
        <Grid container spacing={gridSpacing} sx={{ p: 2 }}>
            <Grid item xs={12}>
                {" "}
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
                                    label="Catalog Name"
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

                        <Grid item xs={12} sm={6}>
                            <FormFooterButtons onSubmit={submitForm} onCancel={handleCloseDrawer} />
                            <FormControl sx={{ m: 1, minWidth: 120, width: "100%" }}>
                                <Button type="submit" onClick={submitForm} variant="contained" endIcon={<SendIcon />}>
                                    SUBMIT
                                </Button>
                            </FormControl>
                        </Grid>
                    </Grid>
                </MainCard>
            </Grid>
        </Grid>
    );
};

DetailsForm.propTypes = {
    handleCloseDrawer: PropTypes.func,
    selectedRecord: PropTypes.object,
    id: PropTypes.string,
    dashDatasetId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    dashTableId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    recId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};
export default DetailsForm;
