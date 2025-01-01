import { loadMainDashboardData } from "views/api-configuration/default";
import { createSlice } from "@reduxjs/toolkit";
import { dispatch } from "../index";
import api from "views/api-configuration/api";
import { resetStateAction } from "store/actions";

const initialState = {
    dataSourceTableId: null,
    dataSourceDataSetId: null
};

const slice = createSlice({
    name: "featuredDataDiscovery",
    initialState,
    reducers: {
        // Testing Reducer
        // hasRequest(state, action) {
        //     state.f1 += 1;
        // },
        hasRequest(state) {
            state.f1 += 1;
        },

        // Reducer to control Dataset and Table Id's of Featured Data Attrbute
        getFeatureDataSourceChangeSuccess(state, action) {
            state.dataSourceTableId = action.payload.dsid;
            state.dataSourceDataSetId = action.payload.taid;
        },
        // resetState: (state) => initialState
        resetState: () => initialState
    },
    extraReducers: (builder) => {
        builder.addCase(resetStateAction, () => initialState);
    }
});

// Async calls from server
export function getFeatureDataSourceChange() {
    return async () => {
        try {
            const response = await api.get(loadMainDashboardData);
            dispatch(slice.actions.getFeatureDataSourceChangeSuccess(response.data.result));
        } catch (error) {
            console.error(error);
        }
    };
}

export default slice.reducer;

export const { hasRequest, getFeatureDataSourceChangeSuccess } = slice.actions;
