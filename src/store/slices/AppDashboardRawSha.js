import {
    loadMainDashboardData,
    metadataList,
    individualCat,
    getcolumnDataDisByStage,
    getAllMetaDatabystage
} from "views/api-configuration/default";
import { createSlice } from "@reduxjs/toolkit";
import { dispatch } from "../index";
import api from "views/api-configuration/api";
import { resetStateAction } from "store/actions";

const initialState = {
    rawDataSources: [],
    metaData: [],
    rawDataPredictionList: [],
    selectedRawData: null,
    selectedRawDataSource: null,
    rawMetadataList: [],
    selectedFeaturedDataSource: null,
    featuredMetaDataList: [],
    comparativeanalysisattribute: [],
    selectedCharts: [],
    columnDatadisList: []
};

const slice = createSlice({
    name: "dataCollection",
    initialState,
    reducers: {
        // Reducer to control main dashboard header data
        getAllCatalogsSuccess(state, action) {
            state.rawDataSources = action.payload;
        },

        // Reducer to control open and close main dashboard's table full view
        getDashboardTableSuccess(state, action) {
            state.rawDataPredictionList = action.payload.filedata;
        },

        getSelectedRawDataSourceSuccess(state, action) {
            state.selectedRawDataSource = action.payload;
        },

        getRawMetaDataListSuccess(state, action) {
            state.rawMetadataList = action.payload;
        },

        getFeaturedMetaDataListSuccess(state, action) {
            state.featuredMetaDataList = action.payload;
        },

        getSelectedFeaturedDataSourceSuccess(state, action) {
            state.selectedFeaturedDataSource = action.payload;
        },
        getComparativeAnalysisAttributes(state, action) {
            state.comparativeanalysisattribute = action.payload;
        },
        getSelectedChartsSuccess(state, action) {
            state.selectedCharts = action.payload;
        },
        getcolumnDataDisListSuccess(state, action) {
            state.columnDatadisList = action.payload;
        },
        // resetState: (state) => initialState
        resetState: () => initialState
    },
    extraReducers: (builder) => {
        builder.addCase(resetStateAction, () => initialState);
    }
});

// Async calls from server
export function getAllCatalogs(dsid) {
    return async () => {
        try {
            dispatch(slice.actions.getAllCatalogsSuccess(dsid));
        } catch (error) {
            console.error(error);
            // dispatch(slice.actions.hasError(error));
        }
    };
}

export function getDashboardTableData(dsid) {
    return async () => {
        try {
            const response = await api.get(`${loadMainDashboardData}${dsid}`);
            dispatch(slice.actions.getDashboardTableSuccess(response.data.result));
        } catch (error) {
            console.log(error);
            // dispatch(slice.actions.hasError(error));
        }
    };
}

export function rawDataSourceSelection(dsid, tid) {
    return async () => {
        try {
            const response = await api.get(`${metadataList}/${dsid}/${tid}`);
            dispatch(slice.actions.getRawMetaDataListSuccess(response.data.result));
        } catch (error) {
            console.log(error);
            // dispatch(slice.actions.hasError(error));
        }
        try {
            const response = await api.get(`${individualCat}/${dsid}/${tid}`);
            dispatch(slice.actions.getSelectedRawDataSourceSuccess(response.data.result));
        } catch (error) {
            console.log(error);
            // dispatch(slice.actions.hasError(error));
        }
    };
}

export function featuredDataSourceSelection(dsid, tid, stage) {
    return async () => {
        try {
            const response = await api.get(`${getAllMetaDatabystage(dsid, tid, stage)}`);
            dispatch(slice.actions.getFeaturedMetaDataListSuccess(response.data.result));
        } catch (error) {
            console.log(error);
            // dispatch(slice.actions.hasError(error));
        }
        try {
            const response = await api.get(`${individualCat}/${dsid}/${tid}`);
            dispatch(slice.actions.getSelectedFeaturedDataSourceSuccess(response.data.result));
        } catch (error) {
            console.error(error);
        }
        try {
            const response = await api.get(`${getcolumnDataDisByStage(dsid, tid, stage)}`);
            const filteredQuantitativeData = response.data.result.filter((item) => item.attributecategory === "QUANTITATIVE");

            dispatch(slice.actions.getcolumnDataDisListSuccess(response.data.result));
            dispatch(
                slice.actions.getSelectedChartsSuccess(
                    filteredQuantitativeData.map((item) => ({
                        dsid: item.productclientdatasetsid,
                        taid: item.tableId,
                        attid: item.attributeid,
                        attName: item.attributename,
                        ct: "Bar Chart",
                        active: false
                    }))
                )
            );
        } catch (error) {
            console.log(error);
            // dispatch(slice.actions.hasError(error));
        }
    };
}
export function columnsDataDisList(dsid, tid, stage) {
    return async () => {
        try {
            const response = await api.get(`${getcolumnDataDisByStage(dsid, tid, stage)}`);
            dispatch(slice.actions.getcolumnDataDisListSuccess(response.data.result));
        } catch (error) {
            console.log(error);
            // dispatch(slice.actions.hasError(error));
        }
    };
}
export const updatecolumnsDataDisList = (list) => (dispatch) => {
    dispatch(slice.actions.getcolumnDataDisListSuccess(list));
};

export const updateSelectedCharts = (charts) => (dispatch) => {
    dispatch(slice.actions.getSelectedChartsSuccess(charts));
};

export const { resetState: resetApDashBoardRawShaState } = slice.actions;

export default slice.reducer;
