import { createSlice } from "@reduxjs/toolkit";
import { dispatch } from "../index";
import api from "views/api-configuration/api";
// import { resetStateAction } from "store/actions";

const initialState = {
    recordDetails: null
};

const slice = createSlice({
    name: "trigger",
    initialState,
    reducers: {
        // Testing Reducer
        setRecordDetails(state, action) {
            state.recordDetails = action.payload;
        },
        resetState: () => initialState
    }
});

export function setRecordDetails(apiUrl, productclientdatasetsid, tableid, recid) {
    return async () => {
        try {
            const response = await api.get(`${apiUrl}/${productclientdatasetsid}/${tableid}/${recid}`);
            dispatch(slice.actions.setRecordDetails(response.data.result));
        } catch (error) {
            console.log("customApiCallErrors", error);
        }
    };
}
export const { resetState: resettriggerState } = slice.actions;

export default slice.reducer;

// export const { scroll } = slice.actions;
