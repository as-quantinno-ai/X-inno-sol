/* eslint-disable no-unused-vars */
import {
    loadMainDashboardData,
    dashboardVisualList,
    applicationModeStatus,
    cumulativeData,
    getApplicationModeConfiguration
} from "views/api-configuration/default";
import { createSlice } from "@reduxjs/toolkit";
import { dispatch } from "../index";
import api from "views/api-configuration/api";
import { resetStateAction } from "store/actions";

const initialState = {
    fullTableView: false,
    counter: 0,
    mlRunId: null,
    total_no_of_rows_processed: 0,
    accuracy: 0,
    f1: 0,
    precision: 0,
    recall: 0,
    predictionFileData: null,
    mainChartData: "",
    mainChartLabels: [],
    rawVisualList: [],
    featureVisualList: [],
    applicationMode: "",
    cummulativeData: {
        countnegative: null,
        countpositive: null,
        counttotal: null
    }
};

const slice = createSlice({
    name: "dashboard",
    initialState,
    reducers: {
        // Testing Reducer
        // hasRequest(state, action) {
        //     state.f1 += 1;
        // },
        hasRequest(state) {
            state.f1 += 1;
        },

        // Reducer to control main dashboard header data
        getDashboardHeaderSuccess(state, action) {
            state.f1 = action.payload.mlModelRun.modelRunDetailsObj.f1;
            state.accuracy = action.payload.mlModelRun.modelRunDetailsObj.accuracy;
            state.precision = action.payload.mlModelRun.modelRunDetailsObj.weightedPrecision;
        },

        // Reducer to control open and close main dashboard's table full view
        getDashboardTableSuccess(state, action) {
            state.predictionFileData = action.payload.filedata;
        },

        // Reducer to control main dashboard visual
        getDashboardVisualSuccess(state, action) {
            state.mlRunId = action.payload.mlModelRun.mlmodelrunsid;
        },

        // Reducer to control main dashboard header data
        getDashboardHeaderFail(state) {
            state.f1 = null;
            state.accuracy = null;
            state.precision = null;
        },

        // Reducer to control open and close main dashboard's table full view
        getDashboardTableFail(state) {
            state.predictionFileData = null;
        },

        // Reducer to control main dashboard visual
    
        getDashboardVisualFail(state) {
            state.mlRunId = null;
        },

        // Reducer to control main dashboard raw data visual
        getDashboardRawDataVisualSuccess(state, action) {
            let rawVisuals = [];
            action.payload.map((item) => {
                if (item.funcId === 4) {
                    // state.featureVisualList.push(item);
                    rawVisuals = [...rawVisuals, item];
                }
                return "";
            });
            state.rawVisualList = rawVisuals;
        },

        // Reducer to control main dashboard featured data visual
        getDashboardFeaturedDataVisualSuccess(state, action) {
            let featureVisuals = [];
            action.payload.map((item) => {
                if (item.funcId === 6) {
                    // state.featureVisualList.push(item);
                    featureVisuals = [...featureVisuals, item];
                }
                return "";
            });
            state.featureVisualList = featureVisuals;
        },

        // Reducer to control open and close main dashboard's table full view
        tableView(state) {
            state.fullTableView = !state.fullTableView;
        },

        // Reducer to control application mode / Configure ( STOPED / SUBMITTED )
        applicationMode(state, action) {
            state.applicationMode = action.payload;
        },

        // Reducer to control CUMULATIVE DATA
        cumulativeData(state, action) {
            state.cummulativeData = action.payload;
        },
        // resetState: (state) => initialState
        resetState: () => initialState

        // // FILTER MAILS
        // filterMailsSuccess(state, action) {
        //     state.mails = action.payload;
        // }
    },
    extraReducers: (builder) => {
        builder.addCase(resetStateAction, () => initialState);
    }
});

// Async calls from server
export function getDashboardHeader(dsid) {
    return async () => {
        try {
            const response = await api.get(`${loadMainDashboardData}${dsid}`);
            dispatch(slice.actions.getDashboardHeaderSuccess(response.data.result));
        } catch (error) {
            dispatch(slice.actions.getDashboardHeaderFail(null));
            console.error(error);
        }
    };
}

export function getDashboardTable(dsid) {
    return async () => {
        try {
            const response = await api.get(`${loadMainDashboardData}${dsid}`);
            dispatch(slice.actions.getDashboardTableSuccess(response.data.result));
        } catch (error) {
            dispatch(slice.actions.getDashboardTableFail(null));
            // dispatch(slice.actions.hasError(error));
        }
    };
}

export function getDashboardVisual(dsid) {
    return async () => {
        try {
            const response = await api.get(`${loadMainDashboardData}${dsid}`);
            dispatch(slice.actions.getDashboardVisualSuccess(response.data.result));
        } catch (error) {
            dispatch(slice.actions.getDashboardVisualFail(null));
            // dispatch(slice.actions.hasError(error));
        }
    };
}

export function getDashboardRawVisualList(dsid) {
    return async () => {
        try {
            const response = await api.get(`${dashboardVisualList}${dsid}`);
            dispatch(slice.actions.getDashboardRawDataVisualSuccess(response.data.result));
        } catch (error) {
            // dispatch(slice.actions.hasError(error));
        }
    };
}

export function getDashboardFeatureVisualList(dsid) {
    return async () => {
        try {
            const response = await api.get(`${dashboardVisualList}${dsid}`);
            dispatch(slice.actions.getDashboardFeaturedDataVisualSuccess(response.data.result));
        } catch (error) {
            console.error(error);
            // dispatch(slice.actions.hasError(error));
        }
    };
}

export function configureApplicationMode(modeFlag, userroledatasetid) {
    return async () => {
        try {
            if (modeFlag !== "INITIATE") {
                await api.get(getApplicationModeConfiguration(modeFlag, userroledatasetid));
            }
            const getModeStatusCodeResponse = await api.get(`${applicationModeStatus}`);
            dispatch(slice.actions.applicationMode(getModeStatusCodeResponse.data.result));
        } catch (error) {
            console.error(error);
            // dispatch(slice.actions.hasError(error));
        }
    };
}

export function getCumulativeData() {
    return async () => {
        try {
            const getCumulativeDataResponse = await api.get(`${cumulativeData}`);
            dispatch(slice.actions.cumulativeData(getCumulativeDataResponse.data.result));
        } catch (error) {
            // dispatch(slice.actions.hasError(error));
        }
    };
}

export default slice.reducer;

export const { hasRequest, tableView, resetState: resetAppDashboardState } = slice.actions;
