import React, { useState, useEffect } from "react";
import MainCard from "./cards/MainCard";
import { gridSpacing } from "store/constant";
import PropTypes from "prop-types";
import {
    Grid,
    Typography,
    Select,
    ListItemText,
    ListItemButton,
    FormControl,
    InputLabel,
    MenuItem,
    FormControlLabel,
    Radio,
    RadioGroup,
    Autocomplete,
    TextField
} from "@mui/material";

import { useDispatch, useSelector } from "store";
import { openSnackbar } from "store/slices/snackbar";
import { useTheme } from "@mui/material/styles";

// API Config
import { GetJWT, metadataList, metadataRelationApi, getAllMetaDatabystage } from "views/api-configuration/default";

import { useFetch } from "react-async";
import FormFooterButtons from "../FormButtons";
import api from "views/api-configuration/api";

const RefrentialMetaDataForm = ({ datasetid, tableid, tablename, handleCloseDrawer }) => {
    const dispatch = useDispatch();
    const theme = useTheme();

    const [formState, setFormState] = useState(null);

    const { rawDataSources } = useSelector((state) => state.dataCollection);

    const [catalogsMetadataList, setCatalogsMetadataList] = useState();

    const [itemData, setItemData] = useState(null);

    // Example function that uses setItemData
    const updateItemData = (newData) => {
        setItemData(newData);
    };

    const { data, error } = useFetch(getAllMetaDatabystage(datasetid, tableid, "BRONZE"), {
        headers: { accept: "application/json", Authorization: `Bearer ${GetJWT()}` }
    });
    const onCatalogSelection = (item, e) => {
        if (!e && item.referenceProductClientDatasetsId !== null) {
            api.get(`${metadataList}/${item.referenceProductClientDatasetsId}/${item.referenceTableId}`, {
                headers: { accept: "application/json", Authorization: `Bearer ${GetJWT()}` }
            })
                .then((res) => setCatalogsMetadataList(res.data.result))
                .catch((err) => console.error(err, "failure"));
        }
        api.get(`${metadataList}/${e.target.value.split(",")[0]}/${e.target.value.split(",")[1]}`, {
            headers: { accept: "application/json", Authorization: `Bearer ${GetJWT()}` }
        })
            .then((res) => setCatalogsMetadataList(res.data.result))
            .catch((err) => console.error(err, "failure"));
    };
    const [formData, setFormData] = useState({
        attributeCategory: "",
        referenceAttributeId: 0,
        referenceProductClientDatasetsId: 0,
        referenceTableId: 0,
        referenceParams: ""
    });

    useEffect(() => {
        if (itemData && itemData?.referenceProductClientDatasetsId !== null && itemData?.referenceTableId !== null) {
            const defaultValue = [itemData.referenceProductClientDatasetsId, itemData.referenceTableId].join();
            if (defaultValue !== null) {
                api.get(`${metadataList}/${defaultValue.split(",")[0]}/${defaultValue.split(",")[1]}`, {
                    headers: { accept: "application/json", Authorization: `Bearer ${GetJWT()}` }
                })
                    .then((res) => setCatalogsMetadataList(res.data.result))
                    .catch((err) => console.error(err, "failure"));
            }
        }
    }, [itemData]);

    const changeFieldValue = (name, value) => {
        const data = { ...formData };
        try {
            if (name === "referenceParams") {
                data.referenceParams = value;
                setFormData(data);
            } else {
                data.attributeCategory = value.split(",")[0];
                data.referenceProductClientDatasetsId = value.split(",")[1];
                data.referenceTableId = value.split(",")[2];
                data.referenceAttributeId = value.split(",")[3];
                setFormData(data);
            }
        } catch {
            data.attributeCategory = "QUALITATIVE";
            data.referenceProductClientDatasetsId = null;
            data.referenceTableId = null;
            data.referenceAttributeId = null;
            setFormData(data);
        }
    };

    const updateRelationMetaData = (e) => {
        e.preventDefault();
        api.put(metadataRelationApi(formState[1], formState[2], formState[3]), formData, {
            headers: {
                Authorization: `Bearer ${GetJWT()}`
            }
        })
            .then(() => {
                dispatch(
                    openSnackbar({
                        open: true,
                        message: "Metadata Relation Updated Successfully",
                        variant: "alert",
                        alert: {
                            color: "success"
                        },
                        close: false
                    })
                );
            })
            .catch((err) => {
                console.log("refrential meta data form comp:Metadata Relation Updated Failed :", err);
                dispatch(
                    openSnackbar({
                        open: true,
                        message: "Error Updating Metadata Relation Record",
                        variant: "alert",
                        alert: {
                            color: "error"
                        },
                        close: false
                    })
                );
            });
    };

    if (error) return error.message;
    if (data)
        return (
            <MainCard
                content={false}
                title={
                    <Grid container justifyContent="space-between" spacing={gridSpacing}>
                        <Grid item>
                            <Typography variant="h3" component="div" align="center" sx={{ color: theme.palette.primary.dark }}>
                                Define Relations ({tablename.replace(/_/g, " ")})
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
                        {data.result &&
                            data.result?.map((item, key) => (
                                <>
                                    <Grid item lg={12} md={12}>
                                        <ListItemButton component="a" href="#simple-list" onClick={() => updateItemData(item)}>
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
                                                label="Other"
                                            />
                                        </ListItemButton>
                                    </Grid>
                                    {formState && formState[0] === key.toString() ? (
                                        <>
                                            <MainCard
                                                content={false}
                                                style={{ width: "100%", height: "fit-content", margin: "10px", padding: "20px" }}
                                            >
                                                <Grid container spacing={1}>
                                                    <Grid item lg={12} md={12} style={{ padding: "7px 0px" }}>
                                                        <FormControl sx={{ m: 1, minWidth: 120, width: "100%" }}>
                                                            <InputLabel id="t-catalog">Select Data Domain</InputLabel>
                                                            <Select
                                                                labelId="catalog"
                                                                id="catalog"
                                                                name="catalog"
                                                                label="Select Data Domain"
                                                                // value={[
                                                                //     formData?.referenceProductClientDatasetsId,
                                                                //     formData?.referenceTableId
                                                                // ].join()}
                                                                // defaultValue={[
                                                                //     formData?.referenceProductClientDatasetsId,
                                                                //     formData?.referenceTableId
                                                                // ].join()}
                                                                /*eslint-disable*/
                                                                defaultValue={
                                                                    item?.referenceProductClientDatasetsId !== null
                                                                        ? [
                                                                              [
                                                                                  item.referenceProductClientDatasetsId,
                                                                                  item.referenceTableId
                                                                              ].join()
                                                                          ]
                                                                        : ""
                                                                }
                                                                fullWidth
                                                                variant="outlined"
                                                                onChange={(e) => onCatalogSelection(item, e)}
                                                            >
                                                                {rawDataSources?.map((catalog, iterationNo) => (
                                                                    <MenuItem
                                                                        value={[catalog.productclientdatasetsid, catalog.tableid].join()}
                                                                    >
                                                                        {catalog.tablename}
                                                                    </MenuItem>
                                                                ))}
                                                            </Select>
                                                        </FormControl>
                                                    </Grid>
                                                    <Grid item lg={12} md={12} style={{ padding: "0px 0px" }}>
                                                        {catalogsMetadataList ? (
                                                            <form onSubmit={updateRelationMetaData}>
                                                                <FormControl sx={{ m: 1, minWidth: 120, width: "100%" }}>
                                                                    <InputLabel id="t-catalog">Select Attribute</InputLabel>
                                                                    <Select
                                                                        labelId="attribute"
                                                                        id="attribute"
                                                                        name="attribute"
                                                                        label="Select Attribute"
                                                                        fullWidth
                                                                        variant="outlined"
                                                                        defaultValue={
                                                                            item.referenceProductClientDatasetsId !== null
                                                                                ? [
                                                                                      [
                                                                                          "RELATION",
                                                                                          item.referenceProductClientDatasetsId,
                                                                                          item.referenceTableId,
                                                                                          item.referenceAttributeId
                                                                                      ].join()
                                                                                  ]
                                                                                : ""
                                                                        }
                                                                        // onChange={changeFieldValue}
                                                                        onChange={(event) =>
                                                                            changeFieldValue(
                                                                                "attribute",
                                                                                event.target.value
                                                                                // .replace(/,/g, '_')
                                                                            )
                                                                        }
                                                                    >
                                                                        <MenuItem value={[null, null, null, null]}>--------</MenuItem>
                                                                        {catalogsMetadataList?.map((metadata, iterationNo) => (
                                                                            <MenuItem
                                                                                value={[
                                                                                    "RELATION",
                                                                                    metadata.productclientdatasetsid,
                                                                                    metadata.tableId,
                                                                                    metadata.attributeId
                                                                                ].join()}
                                                                            >
                                                                                {metadata.attributeName}
                                                                            </MenuItem>
                                                                        ))}
                                                                    </Select>
                                                                </FormControl>
                                                                <Grid item xs={12} lg={12} style={{ padding: "7px 0px" }}>
                                                                    <Autocomplete
                                                                        multiple
                                                                        disableCloseOnSelect
                                                                        onChange={(event, value) =>
                                                                            changeFieldValue(
                                                                                "referenceParams",
                                                                                value.map((val) => val?.attributeId).toString()
                                                                                // .replace(/,/g, '_')
                                                                            )
                                                                        }
                                                                        options={catalogsMetadataList || []}
                                                                        defaultValue={
                                                                            itemData?.referenceParams !== null
                                                                                ? (catalogsMetadataList || []).filter((option) =>
                                                                                      itemData?.referenceParams?.includes(
                                                                                          option?.attributeId
                                                                                      )
                                                                                  )
                                                                                : []
                                                                        }
                                                                        getOptionLabel={(option) => option.attributeName || ""}
                                                                        renderInput={(params) => (
                                                                            <TextField
                                                                                {...params}
                                                                                name="referenceParams"
                                                                                label="Select Display Attributes"
                                                                                fullWidth
                                                                                variant="outlined"
                                                                                // onChange={changeFieldValue}
                                                                            />
                                                                        )}
                                                                    />
                                                                    {/* <FormHelperText>Please enter your Profile URL</FormHelperText> */}
                                                                </Grid>
                                                                <Grid item xs={12} sm={6} style={{ padding: "7px 0px" }}>
                                                                    <FormFooterButtons
                                                                        onSubmit={updateRelationMetaData}
                                                                        onCancel={handleCloseDrawer}
                                                                    />
                                                                </Grid>
                                                            </form>
                                                        ) : (
                                                            <></>
                                                        )}
                                                    </Grid>
                                                </Grid>
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
/*eslint-enable*/
RefrentialMetaDataForm.propTypes = {
    datasetid: PropTypes.oneOfType([PropTypes.number, PropTypes.number]),
    tableid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    tablename: PropTypes.string,
    handleCloseDrawer: PropTypes.func
};
export default RefrentialMetaDataForm;
