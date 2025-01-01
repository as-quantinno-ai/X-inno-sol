import { createSlice } from "@reduxjs/toolkit";
import { dispatch } from "../index";
import { resetStateAction } from "store/actions";

const initialState = {
    roleAddpermissions: null
};

const slice = createSlice({
    name: "roleaddpermission",
    initialState,
    reducers: {
        getRoleAddPermission(state, action) {
            state.roleAddpermissions = action.payload;
        },
        // resetState: (state) => initialState
        resetState: () => initialState
    },
    extraReducers: (builder) => {
        builder.addCase(resetStateAction, () => initialState);
    }
});

export function getRoleAddPermission(productClientDatasetId) {
    return async () => {
        try {
            dispatch(slice.actions.getRoleAddPermission(productClientDatasetId));
        } catch (error) {
            console.log("==> API FETCH FAILED: ", error);
        }
    };
}
export const { resetState: resetroleaddpermissionState } = slice.actions;

export default slice.reducer;
