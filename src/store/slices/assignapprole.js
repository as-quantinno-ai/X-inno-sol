import { createSlice } from "@reduxjs/toolkit";
import { dispatch } from "../index";
import { resetStateAction } from "store/actions";

const initialState = {
    assignapprole: [],
    appUsers: []
};
const slice = createSlice({
    name: "userrole",
    initialState,
    reducers: {
        getAssignedAppRolesReducer(state, action) {
            state.assignapprole = action.payload;
        },
        setAppUserRolesReducer(state, action) {
            state.appUsers = action.payload;
        },
        // resetState: (state) => initialState
        resetState: () => initialState
    },
    extraReducers: (builder) => {
        builder.addCase(resetStateAction, () => initialState);
    }
});

export function getAppUserRoles(productClientDatasetId) {
    return async () => {
        try {
            dispatch(slice.actions.setAppUserRolesReducer(productClientDatasetId));
        } catch (error) {
            console.log("==> API USER ROLES FETCH FAILED: ", error);
        }
    };
}

export function getAssignedAppRoles(productClientDatasetId) {
    return async () => {
        try {
            dispatch(slice.actions.getAssignedAppRolesReducer(productClientDatasetId));
        } catch (error) {
            console.log("==> API USER ROLES FETCH FAILED: ", error);
        }
    };
}
export const { resetState: resetuserroleState } = slice.actions;

export default slice.reducer;
