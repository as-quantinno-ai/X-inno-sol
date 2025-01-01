// import { GetAccessToken, getTenantApplicationPermissions } from "views/api-configuration/default";
import { getTenantApplicationPermissions } from "views/api-configuration/default";
import { createSlice } from "@reduxjs/toolkit";
import { dispatch } from "../index";
import api from "views/api-configuration/api";
import { resetStateAction } from "store/actions";

const initialState = {
    approleAddpermissions: null
};

const slice = createSlice({
    name: "approleaddpermission",
    initialState,
    reducers: {
        getAppRoleAddPermission(state, action) {
            state.approleAddpermissions = action.payload;
        },
        // resetState: (state) => initialState
        resetState: () => initialState
    },
    extraReducers: (builder) => {
        builder.addCase(resetStateAction, () => initialState);
    }
});

export function getAppRoleAddPermission(productClientDatasetId) {
    return async () => {
        try {
            const response = await api.get(getTenantApplicationPermissions(productClientDatasetId));
            console.log("ws-response: ", response);
            dispatch(slice.actions.getAppRoleAddPermission(response.data.result));
        } catch (error) {
            console.log("==> API FETCH FAILED: ", error);
        }
    };
}
export const { resetState: resetapproleaddpermissionState } = slice.actions;

export default slice.reducer;
