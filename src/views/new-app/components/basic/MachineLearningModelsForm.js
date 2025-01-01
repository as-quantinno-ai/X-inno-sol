import React, { useState } from "react";
// import { useTheme } from "@mui/material/styles";
import { useDispatch, useSelector } from "store";
// material-ui
import { Autocomplete, Grid, Checkbox, TextField } from "@mui/material";
import PropTypes from "prop-types";
import InputLabel from "ui-component/extended/Form/InputLabel";
import SubCard from "ui-component/cards/SubCard";
import { SelectedDataSources, SetMlModelList } from "store/slices/MlModelsRawSha";

import { openSnackbar } from "store/slices/snackbar";

import { mlModelTypesList, postMlModel, metadataList, mlModelMetadataList, GetAccessToken } from "views/api-configuration/default";
import FormFooterButtons from "../FormButtons";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import api from "views/api-configuration/api";
// ==============================|| Layouts ||============================== //
// const trainTestRation = [
//     { label: "10 / 90", id: 1 },
//     { label: "20 / 80", id: 2 },
//     { label: "40 / 60", id: 3 },
//     { label: "50 / 50", id: 4 }
// ];

const trainOrNot = [
    { label: "Yes", val: true },
    { label: "No", val: false }
];

function MachineLearningModelsForm({
    handleCloseDrawer
    // , reloads, reloadTable
}) {
    // const [trainModel, setTrianModel] = React.useState(false);
    // const [validateModel, setValidateModel] = React.useState(false);
    // const [saveModel, setSaveModel] = React.useState(false);
    // const theme = useTheme();

    // const { primary } = theme.palette.text;
    const [progress, setProgress] = React.useState(0);
    // eslint-disable-next-line no-unused-vars
    const [buffer, setBuffer] = React.useState(10);
    // eslint-disable-next-line no-unused-vars
    const [loading, setLoading] = React.useState(false);
    const dispatch = useDispatch();
    // const { dataSourceTableId, dataSourceDataSetId } = useSelector((state) => state.featuredDataDiscovery);
    const { rawDataSources } = useSelector((state) => state.dataCollection);
    const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
    const checkedIcon = <CheckBoxIcon fontSize="small" />;

    const { selectedDataSources } = useSelector((state) => state.mlModelRaw);

    // const onTrainModelChange = () => {
    //     setTrianModel(true);
    // };

    // const onValidateModelChange = () => {
    //     setValidateModel(true);
    // };

    // const onSaveModelChange = () => {
    //     setSaveModel(true);
    // };

    const progressRef = React.useRef(() => {});
    React.useEffect(() => {
        progressRef.current = () => {
            if (progress > 100) {
                setProgress(0);
                setBuffer(10);
            } else {
                const diff = Math.random() * 10;
                const diff2 = Math.random() * 10;
                setProgress(progress + diff);
                setBuffer(progress + diff + diff2);
            }
        };
    });

    // const [SelectedDataSource, setSelectedDataSource] = useState([]);

    const [metadata, setMetadata] = useState([]);

    React.useEffect(() => {
        api.get(`${metadataList}${selectedDataSources?.productclientdatasetsid}/${selectedDataSources?.tableid}`, {
            headers: GetAccessToken()
        })
            .then((response) => {
                setMetadata(response.data.result);
                return response.data.result;
            })
            .catch();
    }, [selectedDataSources]);

    const [mlModelTypes, setMlModelTypes] = useState([]);

    React.useEffect(() => {
        api.get(mlModelTypesList, { headers: GetAccessToken() })
            .then((response) => {
                setMlModelTypes(response.data.result);
                return response.data.result;
            })
            .catch((response) => response);
    }, []);

    // ML Model Creation
    const [formData, setFormData] = useState({
        productclientdatasetsid: selectedDataSources?.productclientdatasetsid,
        datetime: "2022-10-22T07:16:38.778Z",
        featureAttributeIds: "",
        mlparams: "string",
        modelId: 0,
        modelLocation: "string",
        modelTypeId: 0,
        modelVersion: 0,
        seedValue: 0,
        statuscd: "SUBMITTED",
        tableId: selectedDataSources?.tableid,
        trainModel: true,
        trainTestRatio: "string"
    });

    React.useEffect(() => {
        const data = { ...formData };
        data.productclientdatasetsid = selectedDataSources?.productclientdatasetsid;
        data.tableId = selectedDataSources?.tableid;
        setFormData(data);
    }, [selectedDataSources]);

    const changeFieldValue = (name, value) => {
        const data = { ...formData };
        data[name] = value;
        setFormData(data);
    };
    // const top100Films = [
    //     { label: "The Dark Knight", id: 1 },
    //     { label: "Control with Control", id: 2 },
    //     { label: "Combo with Solo", id: 3 },
    //     { label: "The Dark", id: 4 },
    //     { label: "Fight Club", id: 5 },
    //     { label: "demo@company.com", id: 6 },
    //     { label: "Pulp Fiction", id: 7 }
    // ];

    const submitForm = (e) => {
        e.preventDefault();
        setLoading(true);
        api.post(postMlModel, formData, { headers: GetAccessToken() })
            .then(() => {
                dispatch(
                    openSnackbar({
                        open: true,
                        message: "New ML Model Request Submitted Successfully",
                        variant: "alert",
                        alert: {
                            color: "success"
                        },
                        close: false
                    })
                );
                api.get(`${mlModelMetadataList}${selectedDataSources.productclientdatasetsid}/${selectedDataSources.tableid}`, {
                    headers: GetAccessToken()
                }) // Have to upadate this to make it dependent on selected feateured datasource
                    .then((response) => {
                        handleCloseDrawer();
                        SetMlModelList(response.data.result);
                        setLoading(false);
                    })
                    .catch((response) => {
                        setLoading(false);
                        alert("ml update falis");
                        return response;
                    });
                // if (typeof reloadTable === 'function') {
                //     reloadTable();
                // }
            })
            .catch((response) => {
                handleCloseDrawer();
                // if (typeof reloadTable === 'function') {
                //     reloadTable();
                // }
                dispatch(
                    openSnackbar({
                        open: true,
                        message: "New ML Model Request Failed",
                        variant: "alert",
                        alert: {
                            color: "error"
                        },
                        close: false
                    })
                );
                setLoading(false);
                return response;
            });
    };
    return (
        <form onSubmit={submitForm} encType="multipart/form-data" style={{ marginTop: "30px" }}>
            <SubCard title="Add New Ml Model">
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} lg={6}>
                        <InputLabel>Select Data Domain</InputLabel>
                        <Autocomplete
                            options={rawDataSources}
                            onChange={(event, value) => {
                                dispatch(SelectedDataSources(value));
                            }}
                            getOptionLabel={(option) => option.tablename}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </Grid>
                    <Grid item xs={12} lg={6}>
                        <InputLabel>Select Ml Model</InputLabel>

                        <Autocomplete
                            disablePortal
                            options={mlModelTypes}
                            getOptionLabel={(option) => option?.modelType}
                            onChange={(event, value) => changeFieldValue("modelTypeId", value?.modelTypeId)}
                            renderInput={(params) => <TextField {...params} />}
                        />
                        {/* <FormHelperText>Please enter your Email</FormHelperText> */}
                    </Grid>
                    <Grid item xs={12} lg={6}>
                        <InputLabel>Model Version</InputLabel>
                        <TextField
                            style={{ width: "100%" }}
                            onChange={(event) => {
                                changeFieldValue("modelVersion", Number(event.target.value));
                            }}
                        />
                        {/* <FormHelperText>Please enter Password</FormHelperText> */}
                    </Grid>
                    <Grid item xs={12} lg={6}>
                        <InputLabel>Train / Test Ratio</InputLabel>
                        <Autocomplete
                            disablePortal
                            options={trainOrNot}
                            // defaultValue={trainOrNot[1]}
                            onChange={(event, value) => {
                                changeFieldValue("trainTestRatio", value.val);
                            }}
                            renderInput={(params) => <TextField {...params} />}
                        />
                        {/* <FormHelperText>Please enter your Profile URL</FormHelperText> */}
                    </Grid>
                    <Grid item xs={12} lg={6}>
                        <InputLabel>Seed Value</InputLabel>
                        <TextField
                            style={{ width: "100%" }}
                            onChange={(event) => {
                                changeFieldValue("seedValue", Number(event.target.value));
                            }}
                        />
                        {/* <FormHelperText>Please enter your Profile URL</FormHelperText> */}
                    </Grid>
                    <Grid item xs={12} lg={12}>
                        <InputLabel>Add Featured Attributes</InputLabel>
                        <Autocomplete
                            multiple
                            onChange={(event, value) =>
                                changeFieldValue(
                                    "featureAttributeIds",
                                    value.map((val) => val?.attributeId).toString()
                                    // .replace(/,/g, '_')
                                )
                            }
                            options={metadata}
                            getOptionLabel={(option) => option.attributeName}
                            disableCloseOnSelect
                            renderOption={(props, option, { selected }) => (
                                <li {...props}>
                                    <Checkbox icon={icon} checkedIcon={checkedIcon} style={{ marginRight: 8 }} checked={selected} />
                                    {option.attributeName}
                                </li>
                            )}
                            renderInput={(params) => <TextField {...params} />}
                        />
                        {/* <FormHelperText>Please enter your Profile URL</FormHelperText> */}
                    </Grid>
                    <Grid item sm={6} xs={6}>
                        <FormFooterButtons onSubmit={submitForm} onCancel={handleCloseDrawer} />
                    </Grid>
                </Grid>
            </SubCard>
        </form>
    );
}

MachineLearningModelsForm.propTypes = {
    handleCloseDrawer: PropTypes.func
};
export default MachineLearningModelsForm;
