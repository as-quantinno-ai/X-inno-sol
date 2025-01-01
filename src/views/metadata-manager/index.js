// material-ui
import { Grid, FormControl, InputLabel, MenuItem, Select, Button } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
// third-party
import React, { useState, useEffect } from "react";
import SendIcon from "@mui/icons-material/Send";

// project imports
import api from "views/api-configuration/api";
import {
    createStandardizeMetadata,
    getCatalogDataPipelineLayersAndDataSourcesOrPipeline,
    getMetadataDataSourceOrPipeline
} from "views/api-configuration/default";
import AttributesFields from "./AttributeSelector";
// import { dataSource, getStage } from "constants/generic";
import { dataSource } from "constants/generic";
import { openSnackbar } from "store/slices/snackbar";
import { useSelector, useDispatch } from "store";
import { getMetadaataManagerDestinationLayer, getMetadaataManagerLoadFrom } from "store/slices/tables-user-selected-val";

function checkPermission(array) {
    const hasMetadataCreate = array?.resourcePemrmissions?.some((obj) => obj.permissionResourceName === "METADATA_CREATE");
    return !hasMetadataCreate;
}

// ==============================|| KANBAN - BOARD ||============================== //

const StandardMetaData = () => {
    const { rawDataSources } = useSelector((state) => state.dataCollection);
    const { metadaataManagerDestinationLayer, metadaataManagerLoadFrom } = useSelector((state) => state.selectedvalue);

    const [tableId, setTableId] = useState();
    const [data, setData] = useState();
    const dispatch = useDispatch();

    const [datasourcePipelineOptions, setDatasourcePipelineOptions] = useState([]);
    const [additionalUIElements, setAdditionalUIElements] = useState([]);
    // eslint-disable-next-line no-unused-vars
    const [uniqueIdCounter, setUniqueIdCounter] = useState(0);
    const [datasourcePipelineData, setDatasourcePipelineData] = useState("");
    const { baseData } = useSelector((state) => state.initialdata);

    const fetchData = async () => {
        try {
            const response = await api.get(
                `${getCatalogDataPipelineLayersAndDataSourcesOrPipeline(rawDataSources[0]?.productclientdatasetsid)}`
            );

            const data = response.data.result.catalogsDatasources;
            const options = [];

            data.forEach((catalog) => {
                catalog.datasources.forEach((datasource) => {
                    options.push({
                        value: `${datasource.productclientdatasetsid}-${datasource.tableid}-D-${datasource.datasourceid}`,
                        label: `${catalog.catalog.tablename} - ${datasource.sourcetype} - ${datasource.format}`,
                        type: "datasource"
                    });
                });
                catalog.datapipelinelayers.forEach((layer) => {
                    options.push({
                        value: `${layer.productclientdatasetsid}-${layer.tableid}-P-${layer.datapipelinelayerid}`,
                        label: `${catalog.catalog.tablename} - ${layer.stage}`,
                        type: "pipeline"
                    });
                });
            });

            setDatasourcePipelineOptions(options);
            dispatch(getMetadaataManagerLoadFrom(options[0].value));
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const DataLayerChangeHandler = (event) => {
        const value = event.target.value;
        dispatch(getMetadaataManagerDestinationLayer(value));
    };
    const handleDatasourcePipelineChange = async (event) => {
        dispatch(getMetadaataManagerLoadFrom(event.target.value));
    };

    useEffect(() => {
        if (metadaataManagerLoadFrom) {
            setData([]);
            setDatasourcePipelineData([]);
            const fetchMetadata = async () => {
                const [productclientdatasetsid, tableid, type, id] = metadaataManagerLoadFrom.split("-");
                setTableId(tableid);

                try {
                    const response = await api.get(`${getMetadataDataSourceOrPipeline(productclientdatasetsid, tableid, id, type)}`);
                    /*eslint-disable */
                    const filteredData = response.data.result.map((item) => {
                        const {
                            dsMetadataId,
                            datapipelinelayerid,
                            optionalField,
                            metadataid,
                            uniqueIdentifier,
                            sortingParams,
                            referenceTableId,
                            referenceParams,
                            referenceAttributeId,
                            datasourceId,
                            version,
                            createdatetime,
                            updatedatetime,
                            referenceProductClientDatasetsId,
                            ...rest
                        } = item;

                        return rest;
                    });
                    setData(filteredData);
                    setDatasourcePipelineData(filteredData);
                } catch (error) {
                    console.error("Error fetching metadata:", error);
                }
            };

            fetchMetadata();
        }
    }, [metadaataManagerLoadFrom, metadaataManagerDestinationLayer]);
    /*eslint-enable */
    // const handleDeleteRow = (attributeId, rowIndex) => {
    const handleDeleteRow = (attributeId) => {
        const filtered = data.filter((item) => item.attributeId !== attributeId);
        setData(filtered);

        const filteredDatasourcePipelineData = datasourcePipelineData.filter((item) => item.attributeId !== attributeId);
        const filteredAdditionalData = additionalUIElements.filter((item) => item.attributeId !== attributeId);
        setAdditionalUIElements(filteredAdditionalData);
        setDatasourcePipelineData(filteredDatasourcePipelineData);
    };

    const handleAttributeUpdate = (updatedData, attributeList) => {
        const updatedAttributeList = [...attributeList];
        const modifiedIndex = updatedAttributeList.findIndex((attr) => attr.attributeId === updatedData.attributeId);

        if (modifiedIndex !== -1) {
            updatedAttributeList[modifiedIndex] = updatedData;
        } else {
            updatedAttributeList.push(updatedData);
        }

        setDatasourcePipelineData(updatedAttributeList);
    };

    const handleAddButtonClick = () => {
        setUniqueIdCounter((prevCounter) => {
            const newCounter = prevCounter + 1;
            const fieldLength = data.length;
            const count = fieldLength + newCounter;
            const newAttribute = {
                attributeCategory: "QUALITATIVE",
                attributeId: count,
                attributeLength: 100,
                attributeName: "",
                attributeOrder: count,
                attributeType: "string",
                productclientdatasetsid: rawDataSources[0]?.productclientdatasetsid,
                tableId
            };

            setAdditionalUIElements((prevData) => [...prevData, newAttribute]);

            return newCounter;
        });
    };

    // const handleSubmit = async (updatedData) => {
    const handleSubmit = async () => {
        try {
            const response = await api.put(
                createStandardizeMetadata(rawDataSources[0]?.productclientdatasetsid, tableId, metadaataManagerDestinationLayer),
                datasourcePipelineData
            );
            if (response.data) {
                dispatch(
                    openSnackbar({
                        open: true,
                        message: "Metadata Manager Updated Successfully",
                        variant: "alert",
                        alert: {
                            color: "success"
                        },
                        close: false
                    })
                );
            }
            if (response.status === 204) {
                dispatch(
                    openSnackbar({
                        open: true,
                        message: "No New Record To Update",
                        variant: "alert",
                        alert: {
                            color: "warning"
                        },
                        close: false
                    })
                );
            } else {
                dispatch(
                    openSnackbar({
                        open: true,
                        message: "Error Updating Metadata Manager ",
                        variant: "alert",
                        alert: {
                            color: "error"
                        },
                        close: false
                    })
                );
            }
        } catch (error) {
            console.error("Error sending data:", error);
        }
    };
    return (
        <>
            <Grid container spacing={2}>
                {dataSource && (
                    <Grid item xs={12} sm={6} md={6} lg={6}>
                        <FormControl
                            sx={{ m: 1, minWidth: 120 }}
                            style={{
                                display: "block",
                                width: "100%",
                                marginTop: "0px",
                                marginBottom: "8px",
                                paddingLeft: "0px",
                                marginLeft: "0px"
                            }}
                        >
                            <InputLabel id="data-layer-select">Destination Layer</InputLabel>
                            <Select
                                labelId="data-layer-select"
                                id="data-source"
                                name="selected-layer-source"
                                label="Select Data Layer"
                                fullWidth
                                value={metadaataManagerDestinationLayer}
                                onChange={DataLayerChangeHandler}
                            >
                                {dataSource.map((menuItem) => (
                                    <MenuItem key={menuItem.label} value={menuItem.value}>
                                        {menuItem.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                )}
                {datasourcePipelineOptions && (
                    <Grid item xs={12} sm={6} md={6} lg={6}>
                        <FormControl sx={{ m: 1, minWidth: 640 }}>
                            <InputLabel id="datasource-or-pipeline-label">Load From</InputLabel>
                            <Select
                                labelId="datasource-or-pipeline-label"
                                id="datasource-or-pipeline-dropdown"
                                name="datasource-or-pipeline-label"
                                label="Select Data Source Pipeline Layer"
                                value={metadaataManagerLoadFrom}
                                onChange={handleDatasourcePipelineChange}
                            >
                                <MenuItem value="">---------</MenuItem>
                                {datasourcePipelineOptions?.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                )}
            </Grid>
            {data &&
                data.map((item) => (
                    <React.Fragment key={item.attributeId}>
                        <AttributesFields
                            item={{
                                attributeCategory: item.attributeCategory,
                                attributeId: item.attributeId,
                                attributeLength: item.attributeLength,
                                attributeName: item.attributeName,
                                attributeOrder: item.attributeOrder,
                                attributeType: item.attributeType,
                                productclientdatasetsid: item?.productclientdatasetsid,
                                tableId: item.tableId
                            }}
                            onUpdate={handleAttributeUpdate}
                            attributeList={datasourcePipelineData}
                            handleDelete={handleDeleteRow}
                        />
                    </React.Fragment>
                ))}

            {additionalUIElements.map((item) => (
                <AttributesFields
                    key={item.attributeId}
                    item={item}
                    onUpdate={handleAttributeUpdate}
                    attributeList={datasourcePipelineData}
                    handleDelete={handleDeleteRow}
                />
            ))}

            {datasourcePipelineData && (
                <Grid container justifyContent="flex-end">
                    <Grid item sm={1} lg={1} xs={1}>
                        <Button
                            variant="contained"
                            style={{ m: 2, width: 100, mt: 2 }}
                            startIcon={<AddCircleIcon />}
                            onClick={handleAddButtonClick}
                        >
                            Add
                        </Button>
                    </Grid>
                    <Grid item sm={1} lg={1} xs={1}>
                        <Button
                            variant="contained"
                            disabled={checkPermission(baseData)}
                            style={{ width: 100, mt: 2 }}
                            endIcon={<SendIcon />}
                            onClick={handleSubmit}
                        >
                            Submit
                        </Button>
                    </Grid>
                    <Grid item sm={0.9} lg={0.9} xs={0.9} />
                </Grid>
            )}
        </>
    );
};

export default StandardMetaData;
