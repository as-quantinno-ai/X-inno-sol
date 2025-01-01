import PropTypes from "prop-types";

// material-ui
import { IconButton, Grid } from "@mui/material";
import MuiTooltip from "@mui/material/Tooltip";
// import { useTheme } from "@mui/material/styles";

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
import { mlModelRunsPost, mainDashboardData, predictionSumList, GetAccessToken } from "views/api-configuration/default";
import { setDashboardData, setMlModelRunPredictionsData, SetMlModelList } from "store/slices/MlModelsRawSha";
import { openSnackbar } from "store/slices/snackbar";
import MachineLearningModelDetails from "../MachineLearningModelDetails";
import MachineLearningModelsForm from "./MachineLearningModelsForm";
import FormArea from "../FormArea";
import api from "views/api-configuration/api";

// table data

const options = {
    filterType: "checkbox"
};

const MachineLearningModelsTable = () => {
    // const theme = useTheme();

    const dispatch = useDispatch();
    const { selectedFeaturedDataSource } = useSelector((state) => state.dataCollection);
    const { mlModelDataList, viewmlmodelfiledata, viewmlmodelvisualdata } = useSelector((state) => state.mlModelRaw);
    // eslint-disable-next-line no-unused-vars
    const [predictionFileData, setPredictionFileData] = React.useState(null);

    const [columns, setColumns] = useState([]);
    const [rows, setRows] = useState([]);

    // eslint-disable-next-line no-unused-vars
    const [mlModelRun, setMlModelRun] = React.useState(null);
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
            mlModelRunsPost,
            {
                datetime: "",
                modelId: mlModelDataList.modelId,
                predictionTableId: 0,
                predictionTableLocation: "",
                runDetails: "",
                statusCd: "SUBMITTED",
                stepCd
            },
            {
                headers: GetAccessToken()
            }
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
        api.get(`${mainDashboardData}/${mlModelDataList.productclientdatasetsid}/${mlModelDataList.tableId}/${mlModelDataList.modelId}`, {
            headers: GetAccessToken()
        })
            .then((response) => {
                dispatch(
                    openSnackbar({
                        open: true,
                        message: "Prediction File Data Loaded Successfully",
                        variant: "alert",
                        alert: {
                            color: "success"
                        },
                        close: false
                    })
                );
                const result = response.data.result;
                setMlModelRun(result.mlModelRun);
                api.get(`${predictionSumList}/${result.mlModelRun.mlmodelrunsid}`, {
                    headers: GetAccessToken()
                })
                    .then((res) => {
                        // const runDetails = response.data.result.modelRunDetailsObj;
                        // const chartDataLabels = Object.keys(res.data.result.datasets).reverse();
                        const chartDataLabels = ["Total Patients Processed", "Predicted Heart Stroke"];
                        const chartDataSeries = Object.values(res.data.result.datasets).reverse().slice(0, 2);
                        const dashboardDataObj = {
                            mlRunId: result.mlModelRun.mlmodelrunsid,
                            total_no_of_rows_processed: 0,
                            accuracy: result.mlModelRun.modelRunDetailsObj.accuracy,
                            f1: result.mlModelRun.modelRunDetailsObj.f1,
                            precision: result.mlModelRun.modelRunDetailsObj.weightedPrecision,
                            recall: null,
                            predictionFileData: result.filedata,
                            mainChartData: chartDataLabels.map((item, ind) => ({
                                name: item,
                                type: ind === 0 ? "area" : "line",
                                data: chartDataSeries[ind],
                                style: {
                                    color: "red"
                                }
                            })),
                            mainChartLabels: res.data.result.labels
                        };

                        dispatch(
                            openSnackbar({
                                open: true,
                                message: "Prediction Summary Data Loaded",
                                variant: "alert",
                                alert: {
                                    color: "success"
                                },
                                close: false
                            })
                        );
                        dispatch(setDashboardData(dashboardDataObj));
                        setPredictionFileData(result.filedata);
                    })
                    .catch((res) => {
                        dispatch(
                            openSnackbar({
                                open: true,
                                message: "Prediction Summary Data Load Failed",
                                variant: "alert",
                                alert: {
                                    color: "error"
                                },
                                close: false
                            })
                        );
                        return res;
                    });
            })
            .catch((err) => {
                console.log("ERROR: MachineLearningModelTable " + err);
                dispatch(
                    openSnackbar({
                        open: true,
                        message: "Ml Model Publish Failed",
                        variant: "alert",
                        alert: {
                            color: "error"
                        },
                        close: false
                    })
                );
            });
    };
    React.useEffect(() => {
        if (selectedFeaturedDataSource !== null && selectedFeaturedDataSource !== undefined) {
            SetMlModelList(selectedFeaturedDataSource.datasetId, selectedFeaturedDataSource.tableId);
        }
        // SetMlModelList(selectedFeaturedDataSource.datasetId, selectedFeaturedDataSource.tableId);
    }, [
        selectedFeaturedDataSource
        // .datasetId, selectedFeaturedDataSource.tableId
    ]);
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
                    model_name: "Dummy Model",
                    model_ver: item.mlModel.modelVersion,
                    model_sta: item.mlModel.statuscd,
                    model_type: item.modelType.category,
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
                                    onClick={() => getPredictionFileData(item.mlModel, "ML-RUNNER")}
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

    return (
        <>
            <div>
                <MainCard
                    title={
                        <>
                            <Grid container spacing={2} alignItems="center">
                                <Grid item xs={9}>
                                    ML Models
                                </Grid>
                                <Grid item xs={3} style={{ textAlign: "right" }}>
                                    <FormArea form={<MachineLearningModelsForm />} />
                                </Grid>
                            </Grid>
                        </>
                    }
                >
                    {mlModelDataList && mlModelDataList.length > 0 ? (
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12}>
                                <MUIDataTable data={rows} columns={columns} options={options} />
                            </Grid>
                        </Grid>
                    ) : (
                        <></>
                    )}
                </MainCard>
                {viewmlmodelfiledata ? (
                    <MachineLearningModelDetails mlmodeldata={viewmlmodelfiledata} mlmodevisualdata={viewmlmodelvisualdata} />
                ) : (
                    <></>
                )}
            </div>
        </>
    );
};

MachineLearningModelsTable.propTypes = {
    title: PropTypes.string
};

export default MachineLearningModelsTable;
