import { createSlice } from "@reduxjs/toolkit";
import {
    mlModelRunsByStatusAndStepCD,
    loadFileDataUrl,
    getMlModelsByProdClDsId,
    getPublishedMlModels
} from "views/api-configuration/default";
import { dispatch } from "store";
import api from "views/api-configuration/api";
import { resetStateAction } from "store/actions";

const initialState = {
    selectedDataSources: [],
    mlModelDataList: [],
    DashboardData: null,
    viewmlmodelfiledata: null,
    viewmlmodelvisualdata: null,
    modelrunview: false,
    publishedMlModel: null
};

const slice = createSlice({
    name: "mlModelRaw",
    initialState,
    reducers: {
        // Reducer to control main dashboard header data
        getSelectedDataSourceSuccess(state, action) {
            state.selectedDataSources = action.payload;
            console.log("selectedDataSources", state.selectedDataSources);
        },
        getMLModelDataSuccess(state, action) {
            state.mlModelDataList = action.payload;
            console.log("mlModelDataList", state.mlModelDataList);
        },
        DashboardDataSuccess(state, action) {
            state.DashboardData = action.payload;
            console.log("DashboardData", state.DashboardData);
        },
        modelRunViewFileDataSuccess(state, action) {
            state.viewmlmodelfiledata = action.payload;
        },
        modelRunViewVisualDataSuccess(state, action) {
            state.viewmlmodelvisualdata = action.payload;
        },
        modelRunViewSuccess(state) {
            state.modelrunview = !state.modelrunview;
        },
        // Rename this to publishedMlModelSuccess ( ml - model obj get from publishMlModelRun )
        publishedMlModelSuccess(state, action) {
            state.publishedMlModel = action.payload;
        },
        // resetState: (state) => initialState
        resetState: () => initialState
    },
    extraReducers: (builder) => {
        builder.addCase(resetStateAction, () => initialState);
    }
});

// Async calls from server
export const SelectedDataSources = (value) => (dispatch) => {
    dispatch(slice.actions.getSelectedDataSourceSuccess(value));
};

export function SetMlModelList(dsid) {
    return async () => {
        try {
            const response = await api.get(`${getMlModelsByProdClDsId}/${dsid}`);
            dispatch(slice.actions.getMLModelDataSuccess(response.data.result));
        } catch (error) {
            console.error("Failed to fetch ML model list:", error);
        }
    };
}

export function setMlModelRunPredictionsData(modelId) {
    return async () => {
        try {
            const response = await api.get(`${mlModelRunsByStatusAndStepCD}${modelId}/RUN/FINISHED`);
            dispatch(slice.actions.modelRunViewVisualDataSuccess(response.data.result));

            const fileResponse = await api.get(`${loadFileDataUrl}/${response.data.result.predictionTableLocation}`);
            dispatch(slice.actions.modelRunViewFileDataSuccess(fileResponse.data.result));
        } catch (error) {
            console.error("Failed to fetch ML model run prediction data:", error);
        }
    };
}

export function setMlModelRunView() {
    dispatch(slice.actions.modelRunViewSuccess());
}

export const setDashboardData = (value) => (dispatch) => {
    dispatch(slice.actions.DashboardDataSuccess(value));
};

// Function for updating the modelId of Published Ml Model...
export function setPublishedMlModelId(value) {
    dispatch(slice.actions.publishedMlModelSuccess(value));
}

// Function for publishing a Ml Model (updating the state of publishedMlModel)...
export function publishMlModelRun(mlModelDataList) {
    return async () => {
        try {
            // eslint-disable-next-line no-unused-vars
            const response = await api
                .get(`${getPublishedMlModels(mlModelDataList.productclientdatasetsid, mlModelDataList.tableId, mlModelDataList.modelId)}`)
                .then((response) => {
                    dispatch(slice.actions.publishedMlModelSuccess(response.data.result.modelId));
                })
                .catch((error) => {
                    console.log(error);
                });
        } catch (error) {
            console.log(error);
        }
    };
}

export const { resetState: resetmlModelRawState } = slice.actions;

export default slice.reducer;
