import PropTypes from "prop-types";

// material-ui
import { IconButton, Grid, Typography } from "@mui/material";
import MuiTooltip from "@mui/material/Tooltip";
// import { useTheme } from "@mui/material/styles";
import { gridSpacing } from "store/constant";
// project imports
import MainCard from "./cards/MainCard";
import { useDispatch, useSelector } from "store";
import React, { useState } from "react";
import MUIDataTable from "mui-datatables";
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import PlayArrow from "@mui/icons-material/PlayArrow";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import QuizIcon from "@mui/icons-material/Quiz";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import PublishIcon from "@mui/icons-material/Publish";
import { mlModelRunsPost, getMlModelCummulativeDataByModelId, GetAccessToken } from "views/api-configuration/default";
import { setDashboardData, setMlModelRunPredictionsData, SetMlModelList, publishMlModelRun } from "store/slices/MlModelsRawSha";
import { getPublishMlModel } from "store/slices/app-globe";
import { openSnackbar } from "store/slices/snackbar";
import MachineLearningModelsForm from "./MachineLearningModelsForm";
import FormArea from "../FormArea";
import TotalRevenueCard from "./TotalRevenueCard";
import TotalIncomeDarkCard from "./TotalIncomeDarkCard";
import PublishToDashboardForm from "./PublishToDashboardForm";
import FeaturedDataTable from "./FeaturedDataTable";
import api from "views/api-configuration/api";
// table data

// const options = {
//     filterType: "checkbox"
// };

const ExpandableRowTable = ({ title, data, columns, publishedMlModel }) => {
    const [expandedRow, setExpandedRow] = useState(null);
    const [mlModel, setMlModel] = useState(null);
    const [modelRunDetailsObj, setModelRunDetailsObj] = useState([]);
    const [metaData, setMetaData] = useState([]);

    const MyCard = ({ data }) => (
        <>
            {publishedMlModel && (
                <Grid container justifyContent="flex-end" style={{ position: "relative", margin: "5px" }}>
                    {mlModel.modelId === publishedMlModel.mlmodel.modelId ? (
                        <Grid item>
                            <FormArea
                                form={
                                    <PublishToDashboardForm
                                        functionname="MODEL DETAILS"
                                        referenceid={mlModel.modelId}
                                        tableid={mlModel.modelId}
                                        componentDisplayType="MODEL DETAILS"
                                    />
                                }
                                btnTitle="Publish"
                            />
                        </Grid>
                    ) : (
                        <></>
                    )}
                </Grid>
            )}
            <Grid container spacing={2} style={{ margin: "0px", width: "100%" }}>
                {Object.entries(data)
                    .slice(0, 4)
                    .map(([key, value], index) => (
                        <Grid key={index} sx={3} sm={3} md={3} lg={3}>
                            <TotalIncomeDarkCard title={value} value={key.toUpperCase()} />
                        </Grid>
                    ))}
            </Grid>
        </>
    );

    const DataTable = ({ data }) => (
        <div style={{ padding: "5px" }}>
            <TotalRevenueCard title="Attributes" data={data} />
        </div>
    );

    const options = {
        expandableRowsHeader: false,
        responsive: "standard",
        expandableRows: true,
        customToolbar: () => (
            <>
                <FormArea form={<MachineLearningModelsForm />} btnTitle="Add Ml Model" />
            </>
        ),
        renderExpandableRow: (rowData, rowMeta) => {
            let component = <></>;
            if (rowMeta.rowIndex === expandedRow) {
                component = (
                    <>
                        {mlModel && (
                            <tr key={expandedRow} style={{ maxHeight: "200px" }}>
                                <td colSpan={12} style={{ padding: "20px" }}>
                                    <MainCard>
                                        <Grid container spacing={gridSpacing} style={{ margin: "0px" }}>
                                            <Grid xs={12} sm={12} md={12} lg={12}>
                                                <MyCard data={modelRunDetailsObj} />
                                            </Grid>
                                            <Grid xs={12} sm={12} md={10} lg={10} style={{ width: "calc(100vw - 500px)", marginTop: 5 }}>
                                                <FeaturedDataTable type="mlmodel" mlmodelRefId={mlModel.modelId} />
                                            </Grid>
                                            <Grid xs={2}>
                                                <DataTable data={metaData} />
                                            </Grid>
                                        </Grid>
                                    </MainCard>
                                </td>
                            </tr>
                        )}
                    </>
                );
            }
            return component;
        },
        onRowExpansionChange: (currentRowsExpanded) => {
            const rowIndex = currentRowsExpanded[0];
            if (rowIndex !== undefined && rowIndex !== expandedRow) {
                setExpandedRow(rowIndex.index);
                setMlModel(null);

                api.get(`${getMlModelCummulativeDataByModelId(data[rowIndex.index].model_id)}`, { headers: GetAccessToken() })
                    .then((res) => {
                        setMetaData(res.data.result[0].metaData);
                        setMlModel(res.data.result[0].mlModel);
                        setModelRunDetailsObj(res.data.result[0].mlModelRun.filter((item) => item.stepCd === "RUN")[0].modelRunDetailsObj);
                    })
                    .catch();
            } else {
                setExpandedRow(null);
                setMlModel(null);
            }
        }
    };

    return <MUIDataTable title={title} data={data} columns={columns} options={options} />;
};

ExpandableRowTable.propTypes = {
    title: PropTypes.oneOf([PropTypes.string, PropTypes.object]),
    data: PropTypes.array,
    columns: PropTypes.array,
    publishedMlModel: PropTypes.object
};

const MachineLearningExpansionTable = () => {
    // const theme = useTheme();

    const dispatch = useDispatch();
    // const { selectedFeaturedDataSource } = useSelector((state) => state.dataCollection);
    const { selectedDataset } = useSelector((state) => state.userLogin);
    const { publishedMlModel } = useSelector((state) => state.globe);
    // const { mlModelDataList, getMLModelDataSuccess, viewmlmodelfiledata, viewmlmodelvisualdata, mlModelRun } = useSelector(
    const { mlModelDataList } = useSelector((state) => state.mlModelRaw);

    const [columns, setColumns] = useState([]);
    const [rows, setRows] = useState([]);

    // const [mlModelRun2, setMlModelRun] = React.useState(null);
    const [modelRunView, setModelRunView] = React.useState(false);
    // eslint-disable-next-line no-unused-vars
    const [selectedModelRunView, setSelectedModelRunView] = React.useState(false);

    const onModelRunView = (model) => {
        setModelRunView(!modelRunView);
        if (model) {
            setSelectedModelRunView(model);
            dispatch(setMlModelRunPredictionsData(model.modelId));
        }
    };

    function checkStatus(status) {
        let st = true;
        if (status === "FINISHED") {
            st = false;
        }
        return st;
    }

    const checkStepCd = (cd) => {
        let message = "";
        if (cd === "RUN") {
            message = "ML Model Submitted for Processing";
        } else if (cd === "TST") {
            message = "Ml Model Submitted for Testing";
        } else {
            message = "Ml Model Submitted for Validation";
        }

        return message;
    };

    const createMlModelRun = (mlModelDataList, stepCd) => {
        api.post(
            `${mlModelRunsPost}${selectedDataset.productclientdatasetsid}`,
            {
                datetime: "",
                modelId: mlModelDataList.modelId,
                predictionTableId: 0,
                predictionTableLocation: "",
                runDetails: "{}",
                statusCd: "SUBMITTED",
                stepCd
            },
            { headers: GetAccessToken() }
        )
            .then((response) => {
                dispatch(
                    openSnackbar({
                        open: true,
                        message: checkStepCd(stepCd),
                        variant: "alert",
                        alert: {
                            color: "success"
                        },
                        close: false
                    })
                );

                return response;
            })
            .catch((error) => {
                dispatch(
                    openSnackbar({
                        open: true,
                        message: checkStepCd(stepCd),
                        variant: "alert",
                        alert: {
                            color: "error"
                        },
                        close: false
                    })
                );

                return error;
            });
    };

    const getPredictionFileData = (mlModelDataList) => {
        dispatch(publishMlModelRun(mlModelDataList));
        dispatch(getPublishMlModel(selectedDataset.productclientdatasetsid));
    };
    React.useEffect(() => {
        if (mlModelDataList[0]) {
            setColumns([
                {
                    label: "Model Name",
                    name: "model_name",
                    options: {
                        filter: true,
                        sort: true
                    }
                },
                {
                    label: "Model Version",
                    name: "model_ver",
                    options: {
                        filter: true,
                        sort: true
                    }
                },
                {
                    label: "Model Status",
                    name: "model_sta",
                    options: {
                        filter: true,
                        sort: true
                    }
                },
                {
                    label: "Model Type",
                    name: "model_type",
                    options: {
                        filter: true,
                        sort: true
                    }
                },
                {
                    label: "Actions",
                    name: "actions",
                    options: {
                        filter: true,
                        sort: true
                    }
                }
            ]);
            setRows(
                mlModelDataList.map((item) => ({
                    model_name: item.modelType.modelType,
                    model_ver: item.mlModel.modelVersion,
                    model_sta: item.mlModel.statuscd,
                    model_type: item.modelType.category,
                    model_id: item.mlModel.modelId,
                    actions: (
                        <>
                            <div>
                                {item.mlModel.trainModel ? (
                                    <IconButton
                                        size="large"
                                        onClick={() => createMlModelRun(item.mlModel, "TST")}
                                        disabled={checkStatus(item.mlModel.statuscd)}
                                        style={{
                                            opacity: checkStatus(item.mlModel.statuscd) ? 0.4 : 1
                                        }}
                                    >
                                        <MuiTooltip title="Test Model" aria-label="test-model">
                                            <QuizIcon fontSize="small" />
                                        </MuiTooltip>
                                    </IconButton>
                                ) : (
                                    <></>
                                )}
                                {item.mlModel.trainModel ? (
                                    <IconButton
                                        size="large"
                                        onClick={() => createMlModelRun(item.mlModel, "VAL")}
                                        disabled={checkStatus(item.mlModel.statuscd)}
                                        style={{
                                            opacity: checkStatus(item.mlModel.statuscd) ? 0.4 : 1
                                        }}
                                    >
                                        <MuiTooltip title="Validate Model" aria-label="validate-model">
                                            <CheckCircleOutlineIcon fontSize="small" />
                                        </MuiTooltip>
                                    </IconButton>
                                ) : (
                                    <></>
                                )}
                                {item.mlModel.statuscd === "FINISHED" ? (
                                    <IconButton
                                        size="large"
                                        onClick={() => createMlModelRun(item.mlModel, "RUN")}
                                        disabled={checkStatus(item.mlModel.statuscd)}
                                        style={{
                                            opacity: checkStatus(item.mlModel.statuscd) ? 0.4 : 1
                                        }}
                                    >
                                        <MuiTooltip title="Run Model" aria-label="run-model">
                                            <PlayArrow fontSize="small" />
                                        </MuiTooltip>
                                    </IconButton>
                                ) : (
                                    <></>
                                )}
                                <IconButton
                                    size="large"
                                    onClick={() => dispatch(setDashboardData("abc"))}
                                    disabled={checkStatus(item.mlModel.statuscd)}
                                    style={{
                                        opacity: checkStatus(item.mlModel.statuscd) ? 0.4 : 1
                                    }}
                                >
                                    <MuiTooltip title="Delete Model" aria-label="del-model">
                                        <DeleteTwoToneIcon fontSize="small" />
                                    </MuiTooltip>
                                </IconButton>
                                <IconButton
                                    size="large"
                                    onClick={() => onModelRunView(item.mlModel)}
                                    disabled={checkStatus(item.mlModel.statuscd)}
                                    style={{
                                        opacity: checkStatus(item.mlModel.statuscd) ? 0.4 : 1
                                    }}
                                >
                                    <MuiTooltip title="View Model" aria-label="view-model">
                                        <RemoveRedEyeOutlinedIcon fontSize="small" />
                                    </MuiTooltip>
                                </IconButton>
                                <IconButton
                                    size="large"
                                    onClick={() => {
                                        getPredictionFileData(item.mlModel, "ML-RUNNER");
                                    }}
                                    disabled={checkStatus(item.mlModel.statuscd)}
                                    style={{
                                        opacity: checkStatus(item.mlModel.statuscd) ? 0.4 : 1
                                    }}
                                >
                                    <MuiTooltip title="Publish Model" aria-label="pub-model">
                                        <PublishIcon fontSize="small" />
                                    </MuiTooltip>
                                </IconButton>
                            </div>
                        </>
                    )
                }))
            );
        }
    }, [mlModelDataList]);
    React.useEffect(() => {
        dispatch(SetMlModelList(selectedDataset.productclientdatasetsid));
    }, []);

    return (
        <>
            <div>
                {mlModelDataList && mlModelDataList.length > 0 ? (
                    <>
                        <ExpandableRowTable
                            //      key={latestRecordKey}
                            title={
                                <Typography sx={{ fontSize: "1.125rem", fontWeight: 500, mr: 1, mt: 1.75, mb: 0.75 }}>
                                    Machine Learning Models
                                </Typography>
                            }
                            data={rows}
                            columns={columns}
                            publishedMlModel={publishedMlModel}
                        />
                    </>
                ) : (
                    <FormArea
                        form={
                            <MachineLearningModelsForm
                            //  reloadTable={reloadTable}
                            />
                        }
                        btnTitle="Add Ml Model"
                        // reloadTable={reloadTable}
                    />
                )}
            </div>
        </>
    );
};

export default MachineLearningExpansionTable;
