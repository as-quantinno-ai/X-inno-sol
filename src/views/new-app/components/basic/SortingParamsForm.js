import React, { useState } from "react";
import MainCard from "./cards/MainCard";
import { gridSpacing } from "store/constant";

import {
    Grid,
    Typography,
    // Button,
    Select,
    ListItemText,
    ListItemButton,
    FormControl,
    InputLabel,
    MenuItem,
    FormControlLabel,
    Radio,
    RadioGroup
} from "@mui/material";

import { useDispatch } from "store";
import { openSnackbar } from "store/slices/snackbar";
import { useTheme } from "@mui/material/styles";
import PropTypes from "prop-types";
// API Config
import { GetJWT, metadataList, metadataSortingParams } from "views/api-configuration/default";

import { useFetch } from "react-async";
import FormFooterButtons from "../FormButtons";
import api from "views/api-configuration/api";

const SortingParamsForm = ({ datasetid, tableid, tablename, handleCloseDrawer }) => {
    const dispatch = useDispatch();
    const theme = useTheme();

    const [formState, setFormState] = useState(null);

    const [formData, setFormData] = useState({
        type: "",
        technique: "",
        order: "",
        status: true
    });

    const changeFieldValue = (name, value) => {
        const data = { ...formData };
        data[name] = value;
        setFormData(data);
    };

    const onUpdatingSortingParam = (e) => {
        e.preventDefault();
        const requestData = {
            type: formData.type,
            technique: formData.technique,
            order: formData.order,
            status: formData.status
        };
        api.put(metadataSortingParams(formState[1], formState[2], formState[3]), requestData, {
            headers: {
                Authorization: `Bearer ${GetJWT()}`
            }
        })
            .then(() => {
                dispatch(
                    openSnackbar({
                        open: true,
                        message: "Sorting Params Updated Successfully",
                        variant: "alert",
                        alert: {
                            color: "success"
                        },
                        close: false
                    })
                );
            })
            .catch((err) => {
                console.log("ERROR in SORTING PARAMS FORM :", err);
                dispatch(
                    openSnackbar({
                        open: true,
                        message: "Error Updating Sorting Params",
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
                            <Typography variant="h3" component="div" align="center" sx={{ color: theme.palette.primary.dark }}>
                                Set Sorting Criteria ({tablename.replace(/_/g, " ")})
                            </Typography>
                        </Grid>
                    </Grid>
                }
                style={{ width: "100%", height: "fit-content" }}
            >
                <RadioGroup
                    aria-labelledby="metadata-lables"
                    name="metadata"
                    onChange={(e) => {
                        setFormState(null);
                        setFormData(null);
                        setFormState(e.target.value.split(","));
                    }}
                    style={{ width: "100%" }}
                >
                    <Grid container spacing={0}>
                        {data.result?.map((item, key) => (
                            <>
                                <Grid item lg={12} md={12}>
                                    <ListItemButton component="a" href="#simple-list">
                                        {/* {item.referenceproductclientdatasetsid && item.referencetableId && item.referenceattributeId ? (
                                            <StarRateIcon />
                                        ) : (
                                            <></>
                                        )} */}
                                        <ListItemText
                                            primary={
                                                <>
                                                    <>
                                                        {item.attributeCategory === "RELATION" ? (
                                                            <div
                                                                style={{
                                                                    color: "red",
                                                                    fontWeight: 800,
                                                                    display: "inline",
                                                                    fontSize: "20px"
                                                                }}
                                                            >
                                                                *
                                                            </div>
                                                        ) : (
                                                            <></>
                                                        )}
                                                    </>
                                                    {item.attributeName}
                                                </>
                                            }
                                            secondary={item.attributeType}
                                        />
                                        <FormControlLabel
                                            value={[key, item.productclientdatasetsid, item.tableId, item.attributeId].join()}
                                            control={<Radio />}
                                            label=""
                                        />
                                    </ListItemButton>
                                </Grid>
                                {formState && formState[0] === key.toString() ? (
                                    <>
                                        <MainCard
                                            content={false}
                                            style={{ width: "100%", height: "fit-content", margin: "10px", padding: "20px" }}
                                        >
                                            <form>
                                                <Grid container spacing={1}>
                                                    <Grid item lg={12} md={12} style={{ padding: "7px 0px" }}>
                                                        <FormControl sx={{ m: 1, minWidth: 120, width: "100%" }}>
                                                            <InputLabel id="select-type">Select Type</InputLabel>
                                                            <Select
                                                                labelId="type"
                                                                id="type"
                                                                name="type"
                                                                label="Select Type"
                                                                fullWidth
                                                                variant="outlined"
                                                                onChange={(e) => changeFieldValue(e.target.name, e.target.value)}
                                                            >
                                                                <MenuItem value="num">Numbers</MenuItem>
                                                                <MenuItem value="str">Strings</MenuItem>
                                                            </Select>
                                                        </FormControl>
                                                    </Grid>
                                                    <Grid item lg={12} md={12} style={{ padding: "7px 0px" }}>
                                                        <FormControl sx={{ m: 1, minWidth: 120, width: "100%" }}>
                                                            <InputLabel id="select-technique">Select Technique</InputLabel>
                                                            <Select
                                                                labelId="technique"
                                                                id="technique"
                                                                name="technique"
                                                                label="Select Technique"
                                                                fullWidth
                                                                variant="outlined"
                                                                onChange={(e) => changeFieldValue(e.target.name, e.target.value)}
                                                            >
                                                                <MenuItem value="1char">1 Character</MenuItem>
                                                                <MenuItem value="2char">2 Characters</MenuItem>
                                                                <MenuItem value="3char">3 Characters</MenuItem>
                                                                <MenuItem value="all">All Characters</MenuItem>
                                                            </Select>
                                                        </FormControl>
                                                    </Grid>
                                                    <Grid item lg={12} md={12} style={{ padding: "7px 0px" }}>
                                                        <FormControl sx={{ m: 1, minWidth: 120, width: "100%" }}>
                                                            <InputLabel id="select-order">Order</InputLabel>
                                                            <Select
                                                                labelId="order"
                                                                id="order"
                                                                name="order"
                                                                label="Select Order"
                                                                fullWidth
                                                                variant="outlined"
                                                                onChange={(e) => changeFieldValue(e.target.name, e.target.value)}
                                                            >
                                                                <MenuItem value="ASC">Ascending</MenuItem>
                                                                <MenuItem value="DSC">Descending</MenuItem>
                                                            </Select>
                                                        </FormControl>
                                                    </Grid>
                                                </Grid>
                                                <Grid item lg={12} md={12} style={{ padding: "7px 0px" }}>
                                                    <Grid item sm={6} xs={12}>
                                                        <FormFooterButtons onCancel={handleCloseDrawer} onSubmit={onUpdatingSortingParam} />
                                                    </Grid>
                                                </Grid>
                                            </form>
                                        </MainCard>
                                    </>
                                ) : (
                                    <></>
                                )}
                            </>
                        ))}
                    </Grid>
                </RadioGroup>
            </MainCard>
        );
    return null;
};

SortingParamsForm.propTypes = {
    datasetid: PropTypes.oneOfType([PropTypes.number, PropTypes.number]),
    tableid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    tablename: PropTypes.string,
    handleCloseDrawer: PropTypes.func
};
export default SortingParamsForm;
