import { createSlice } from "@reduxjs/toolkit";
import { dispatch } from "../index";
import { resetStateAction } from "store/actions";

const initialState = {
    assignresrole: [],
    resUsers: []
};
const slice = createSlice({
    name: "userresrole",
    initialState,
    reducers: {
        setAssignedResRolesReducer(state, action) {
            state.assignresrole = action.payload;
        },
        setResUserRolesReducer(state, action) {
            state.resUsers = action.payload;
        },
        // resetState: (state) => initialState
        resetState: () => initialState
    },
    extraReducers: (builder) => {
        builder.addCase(resetStateAction, () => initialState);
    }
});

export function setAssignedResRoles(productClientDatasetId) {
    return async () => {
        try {
            dispatch(slice.actions.setAssignedResRolesReducer(productClientDatasetId));
        } catch (error) {
            console.log("==> API USER ROLES FETCH FAILED: ", error);
        }
    };
}
export function setResUserRoles(productClientDatasetId) {
    return async () => {
        try {
            dispatch(slice.actions.setResUserRolesReducer(productClientDatasetId));
        } catch (error) {
            console.log("==> API USER ROLES FETCH FAILED: ", error);
        }
    };
}
export const { resetState: resetuserroleState } = slice.actions;

export default slice.reducer;
