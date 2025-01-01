import React, { useState } from "react";
import MainCard from "./cards/MainCard";
import { gridSpacing } from "store/constant";
import PropTypes from "prop-types";
import { Grid, Typography, Button, Select, FormControl, InputLabel, MenuItem, Autocomplete, TextField } from "@mui/material";

import { useDispatch, useSelector } from "store";
import { openSnackbar } from "store/slices/snackbar";

// API Config
import { GetJWT, metadataList, createConfigFilter, createQueryFilter } from "views/api-configuration/default";

import { useFetch } from "react-async";
import api from "views/api-configuration/api";

const FiltersForm = ({ datasetid, tableid, componentDataId }) => {
    const dispatch = useDispatch();

    const { datasetFiltersConfig } = useSelector((state) => state.globe);
    // const { selectedDataset } = useSelector((state) => state.userLogin);
    // const { appUsers } = useSelector((state) => state.userrole);
    const { assignapprole } = useSelector((state) => state.userrole);

    // const [formState, setFormState] = useState(null);

    // const [filterType, setFilterType] = useState("Config");

    const [configFilterFormData, setConfigFilterFormData] = useState({
        componentdataid: componentDataId,
        base_productclientdatasetsid: datasetid,
        base_tableid: null,
        base_referenceid: null,
        custom_filter_json: null,
        filter_level: null,
        filter_type: null,
        productclientdatasetsid: datasetid,
        referenceid: null,
        tableid
    });

    const [queryFilterFormData, setQueryFilterFormData] = useState({
        componentdataid: componentDataId,
        query: "",
        role_type: "",
        tableid,
        productclientdatasetsid: datasetid
    });

    const { rawDataSources } = useSelector((state) => state.dataCollection);

    const [catalogsMetadataList, setCatalogsMetadataList] = useState(null);

    const onCatalogSelection = (configFilterFormData) => {
        api.get(`${metadataList}/${configFilterFormData.productclientdatasetsid}/${configFilterFormData.tableid}`, {
            headers: { accept: "application/json", Authorization: `Bearer ${GetJWT()}` }
        })
            .then((res) => setCatalogsMetadataList(res.data.result))
            .catch();
    };

    const [baseCatalogsMetadataList, setBaseCatalogsMetadataList] = useState(null);

    const onBaseCatalogSelection = (datasetid, tableid) => {
        api.get(`${metadataList}/${datasetid}/${tableid}`, {
            headers: { accept: "application/json", Authorization: `Bearer ${GetJWT()}` }
        })
            .then((res) => setBaseCatalogsMetadataList(res.data.result))
            .catch();
    };

    const changeConfigFilterFieldValue = (name, value) => {
        const data = { ...configFilterFormData };
        if (name === "base_catalog") {
            value = value.split(",");
            data.base_productclientdatasetsid = Number(value[0]);
            data.base_tableid = Number(value[1]);
            onBaseCatalogSelection(value[0], value[1]);
        } else if (name === "filter_level") {
            if (value === "COL") onCatalogSelection(configFilterFormData);
            data[name] = value;
        } else if (name === "filter_type") {
            if (value === "BASE_TAB" || value === "USR" || value === "EXC_COLS") onCatalogSelection(configFilterFormData);
            else setCatalogsMetadataList(null);
            data[name] = value;
        } else if (name === "exclude_columns") {
            data.custom_filter_json = JSON.stringify({ exclude_columns: value.split(",") });
        } else if (name === "user") {
            data.custom_filter_json = JSON.stringify({ ...JSON.parse(data.custom_filter_json), usr: value });
        } else if (name === "user_role") {
            data.custom_filter_json = JSON.stringify({ ...JSON.parse(data.custom_filter_json), usr_role: value });
        } else {
            data[name] = value;
        }
        setConfigFilterFormData(data);
    };

    const submitConfigFilterForm = (e) => {
        e.preventDefault();
        api.post(createConfigFilter, configFilterFormData, {
            headers: {
                Authorization: `Bearer ${GetJWT()}`
            }
        })
            .then(() => {
                dispatch(
                    openSnackbar({
                        open: true,
                        message: "Config Filter Created Successfully",
                        variant: "alert",
                        alert: {
                            color: "success"
                        },
                        close: false
                    })
                );
            })
            .catch((err) => {
                console.log("submitConfigFilterForm :", err);
                dispatch(
                    openSnackbar({
                        open: true,
                        message: "Error Creating Config Filter",
                        variant: "alert",
                        alert: {
                            color: "error"
                        },
                        close: false
                    })
                );
            });
    };

    const changeQueryFilterFieldValue = (name, value) => {
        const data = { ...queryFilterFormData };
        data[name] = value;
        setQueryFilterFormData(data);
    };

    const submitQueryFilterForm = (e) => {
        e.preventDefault();
        api.post(createQueryFilter, queryFilterFormData, {
            headers: {
                Authorization: `Bearer ${GetJWT()}`
            }
        })
            .then(() => {
                dispatch(
                    openSnackbar({
                        open: true,
                        message: "Query Filter Created Successfully",
                        variant: "alert",
                        alert: {
                            color: "success"
                        },
                        close: false
                    })
                );
            })
            .catch((err) => {
                console.log("submitQueryFilterForm :", err);
                dispatch(
                    openSnackbar({
                        open: true,
                        message: "Error Creating Query Filter",
                        variant: "alert",
                        alert: {
                            color: "error"
                        },
                        close: false
                    })
                );
            });
    };

    const { data, error } = useFetch(`${metadataList}/${datasetid}/${tableid}`, {
        headers: { accept: "application/json", Authorization: `Bearer ${GetJWT()}` }
    });
    if (error) return error.message;
    if (data)
        return (
            <MainCard
                content={false}
                title={
                    <Grid container justifyContent="space-between" spacing={gridSpacing}>
                        <Grid item>
                            <Typography variant="h3" component="div" align="center">
                                Apply Filters
                            </Typography>
                        </Grid>
                    </Grid>
                }
                style={{ width: "100%", height: "fit-content", padding: "10px" }}
            >
                {datasetFiltersConfig && (
                    <>
                        {datasetFiltersConfig?.type === "CONFIG_FILTER" ? (
                            <form style={{ marginTop: 20 }}>
                                <Grid container justifyContent="space-between" spacing={2}>
                                    <Grid item sx={12} sm={12} md={12} lg={12}>
                                        <FormControl sx={{ m: 1, minWidth: 120, width: "100%" }}>
                                            <InputLabel id="format-label">Filter Level</InputLabel>
                                            <Select
                                                labelId="format-label"
                                                id="filter_level"
                                                name="filter_level"
                                                label="Filter Level"
                                                onChange={(e) => {
                                                    changeConfigFilterFieldValue(e.target.name, e.target.value);
                                                }}
                                                variant="outlined"
                                                fullWidth
                                            >
                                                <MenuItem>-------------</MenuItem>
                                                <MenuItem value="REC">RECORD</MenuItem>
                                                <MenuItem value="COL">COLUMN</MenuItem>
                                                <MenuItem value="PRED">PREDICTION</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    {configFilterFormData.filter_level === "REC" ? (
                                        <Grid item sx={12} sm={12} md={12} lg={12}>
                                            <FormControl sx={{ m: 1, minWidth: 120, width: "100%" }}>
                                                <InputLabel id="format-label">Filter Type</InputLabel>
                                                <Select
                                                    labelId="format-label"
                                                    id="filter_type"
                                                    name="filter_type"
                                                    label="Filter Level"
                                                    onChange={(e) => {
                                                        changeConfigFilterFieldValue(e.target.name, e.target.value);
                                                    }}
                                                    variant="outlined"
                                                    fullWidth
                                                >
                                                    <MenuItem>-------------</MenuItem>
                                                    <MenuItem value="USR">USER</MenuItem>
                                                    <MenuItem value="RLE">ROLE</MenuItem>
                                                    <MenuItem value="BASE_TAB">BASE TABLE</MenuItem>
                                                    <MenuItem value="EXP">EXPRESSION</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                    ) : (
                                        <></>
                                    )}
                                    {configFilterFormData.filter_type === "BASE_TAB" || configFilterFormData.filter_type === "USR" ? (
                                        <>
                                            <Grid item sx={12} sm={12} md={12} lg={12}>
                                                <FormControl sx={{ m: 1, minWidth: 120, width: "100%" }}>
                                                    <InputLabel id="format-label">Select Attribute</InputLabel>
                                                    <Select
                                                        labelId="format-label"
                                                        id="referenceid"
                                                        name="referenceid"
                                                        label="Select Base Catalog"
                                                        onChange={(e) => {
                                                            changeConfigFilterFieldValue(e.target.name, e.target.value);
                                                        }}
                                                        variant="outlined"
                                                        fullWidth
                                                    >
                                                        <MenuItem>-------------</MenuItem>
                                                        {catalogsMetadataList?.map((metadata, iterationNo) => (
                                                            <MenuItem key={iterationNo} value={metadata.attributeId}>
                                                                {metadata.attributeName}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                        </>
                                    ) : (
                                        <></>
                                    )}
                                    {configFilterFormData.filter_type === "BASE_TAB" && configFilterFormData.referenceid ? (
                                        <>
                                            <Grid item sx={12} sm={12} md={12} lg={12}>
                                                <FormControl sx={{ m: 1, minWidth: 120, width: "100%" }}>
                                                    <InputLabel id="format-label">Select Base Catalog</InputLabel>
                                                    <Select
                                                        labelId="format-label"
                                                        id="base_catalog"
                                                        name="base_catalog"
                                                        label="Select Base Catalog"
                                                        onChange={(e) => {
                                                            changeConfigFilterFieldValue(e.target.name, e.target.value);
                                                        }}
                                                        variant="outlined"
                                                        fullWidth
                                                    >
                                                        <MenuItem>-------------</MenuItem>
                                                        {rawDataSources?.map((catalog, iterationNo) => (
                                                            <MenuItem
                                                                key={iterationNo}
                                                                value={[catalog.productclientdatasetsid, catalog.tableid].join()}
                                                            >
                                                                {catalog.tablename}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                        </>
                                    ) : (
                                        <></>
                                    )}
                                    {configFilterFormData.filter_type === "BASE_TAB" && configFilterFormData.base_tableid ? (
                                        <Grid item sx={12} sm={12} md={12} lg={12}>
                                            <FormControl sx={{ m: 1, minWidth: 120, width: "100%" }}>
                                                <InputLabel id="format-label">Select Base Attribute</InputLabel>
                                                <Select
                                                    labelId="format-label"
                                                    id="base_referenceid"
                                                    name="base_referenceid"
                                                    label="Base Attribute Id"
                                                    onChange={(e) => {
                                                        changeConfigFilterFieldValue(e.target.name, Number(e.target.value));
                                                    }}
                                                    variant="outlined"
                                                    fullWidth
                                                >
                                                    {baseCatalogsMetadataList?.map((metadata, iterationNo) => (
                                                        <MenuItem key={iterationNo} value={metadata.attributeId}>
                                                            {metadata.attributeName}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                    ) : (
                                        <></>
                                    )}
                                    {configFilterFormData.filter_type === "USR" && catalogsMetadataList ? (
                                        <>
                                            <Grid item sx={12} sm={12} md={12} lg={12}>
                                                <FormControl sx={{ m: 1, minWidth: 120, width: "100%" }}>
                                                    <TextField
                                                        fullWidth
                                                        id="user"
                                                        name="user"
                                                        label="Select User"
                                                        onChange={(e) => {
                                                            changeConfigFilterFieldValue(e.target.name, e.target.value);
                                                        }}
                                                        variant="outlined"
                                                    />
                                                </FormControl>
                                            </Grid>
                                            <Grid item sx={12} sm={12} md={12} lg={12}>
                                                <FormControl sx={{ m: 1, minWidth: 120, width: "100%" }}>
                                                    <Select
                                                        labelId="format-label"
                                                        id="user_role"
                                                        name="user_role"
                                                        label="Select User Role"
                                                        onChange={(e) => {
                                                            changeConfigFilterFieldValue(e.target.name, e.target.value);
                                                        }}
                                                        variant="outlined"
                                                        fullWidth
                                                    >
                                                        {assignapprole?.map((role, indx) => (
                                                            <MenuItem key={indx} value={role.roleName}>
                                                                {role.roleName}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                                {/* <Autocomplete
                                                multiple
                                                onChange={(event, value) =>
                                                    changeConfigFilterFieldValue(
                                                        'exclude_columns',
                                                        value.map((val) => val?.attributeName).toString()
                                                        // .replace(/,/g, '_')
                                                    )
                                                }
                                                options={catalogsMetadataList}
                                                getOptionLabel={(option) => option.attributeName}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        name="exclude_columns"
                                                        label="Exclude Columns"
                                                        fullWidth
                                                        variant="outlined"
                                                        // onChange={changeFieldValue}
                                                    />
                                                )}
                                            /> */}
                                            </Grid>
                                        </>
                                    ) : (
                                        <></>
                                    )}
                                    {configFilterFormData.filter_level === "COL" ? (
                                        <Grid item sx={12} sm={12} md={12} lg={12}>
                                            <FormControl sx={{ m: 1, minWidth: 120, width: "100%" }}>
                                                <InputLabel id="format-label">Filter Type</InputLabel>
                                                <Select
                                                    labelId="format-label"
                                                    id="filter_type"
                                                    name="filter_type"
                                                    label="Filter Level"
                                                    onChange={(e) => {
                                                        changeConfigFilterFieldValue(e.target.name, e.target.value);
                                                    }}
                                                    variant="outlined"
                                                    fullWidth
                                                >
                                                    <MenuItem>-------------</MenuItem>
                                                    <MenuItem value="EXC_COLS">EXCLUDE COLUMNS</MenuItem>
                                                    {/* <MenuItem value="HIDE_COLS">HIDE COLUMNS</MenuItem> */}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                    ) : (
                                        <></>
                                    )}
                                    {configFilterFormData.filter_level === "COL" &&
                                    configFilterFormData.filter_type === "EXC_COLS" &&
                                    catalogsMetadataList ? (
                                        /*eslint-disable */
                                        <Grid item sx={12} sm={12} md={12} lg={12}>
                                            <Autocomplete
                                                multiple
                                                onChange={(event, value) =>
                                                    changeConfigFilterFieldValue(
                                                        "exclude_columns",
                                                        value.map((val) => val?.attributeName).toString()
                                                        // .replace(/,/g, '_')
                                                    )
                                                }
                                                options={catalogsMetadataList}
                                                getOptionLabel={(option) => option.attributeName}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        name="exclude_columns"
                                                        label="Exclude Columns"
                                                        fullWidth
                                                        variant="outlined"
                                                        // onChange={changeFieldValue}
                                                    />
                                                )}
                                            />
                                        </Grid>
                                    ) : (
                                        <></>
                                    )}
                                    <Grid item xs={12} sm={12}>
                                        <FormControl sx={{ m: 1, minWidth: 120, width: "100%" }}>
                                            <Button
                                                type="submit"
                                                onClick={submitConfigFilterForm}
                                                variant="contained"
                                                // endIcon={<SendIcon />}
                                            >
                                                SUBMIT
                                            </Button>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </form>
                        ) : (
                            /*eslint-enable*/
                            <form>
                                <Grid container justifyContent="space-between" spacing={2}>
                                    {/* <Grid item sx={12} sm={12} md={12} lg={12}>
                                        <FormControl sx={{ m: 1, minWidth: 120, width: '100%' }}>
                                            <InputLabel id="format-label">Define Your View</InputLabel>
                                            <textarea
                                                rows={10}
                                                name="view"
                                                onChange={(e) => changeQueryFilterFieldValue(e.target.name, e.target.value)}
                                            />
                                        </FormControl>
                                    </Grid> */}
                                    <Grid item sx={12} sm={12} md={12} lg={12}>
                                        <FormControl sx={{ m: 1, minWidth: 120, width: "100%" }}>
                                            <InputLabel id="format-label">Write Pyspark Query</InputLabel>
                                            <textarea
                                                rows={10}
                                                name="query"
                                                onChange={(e) => changeQueryFilterFieldValue(e.target.name, e.target.value)}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item sx={12} sm={12} md={12} lg={12}>
                                        <FormControl sx={{ m: 1, minWidth: 120, width: "100%" }}>
                                            <InputLabel id="format-label">Select Query Specific Role</InputLabel>
                                            <FormControl sx={{ m: 1, minWidth: 120, width: "100%" }}>
                                                <Select
                                                    labelId="format-label"
                                                    id="role_type"
                                                    name="role_type"
                                                    label="Select Query Specific Role"
                                                    onChange={(e) => {
                                                        changeQueryFilterFieldValue(e.target.name, e.target.value);
                                                    }}
                                                    variant="outlined"
                                                    fullWidth
                                                >
                                                    <MenuItem value="ALL_TYPES_DA_AN">Not Specified</MenuItem>
                                                    {assignapprole?.map((role, indx1) => (
                                                        <MenuItem key={indx1} value={role.roleName}>
                                                            {role.roleName}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={12}>
                                        <FormControl sx={{ m: 1, width: "100%" }}>
                                            <Button
                                                type="submit"
                                                onClick={submitQueryFilterForm}
                                                variant="contained"
                                                // endIcon={<SendIcon />}
                                            >
                                                SUBMIT
                                            </Button>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </form>
                        )}
                    </>
                )}
            </MainCard>
        );
    return null;
};

FiltersForm.propTypes = {
    datasetid: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    tableid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    componentDataId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default FiltersForm;
