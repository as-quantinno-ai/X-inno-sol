import { createSlice } from "@reduxjs/toolkit";
import { dispatch } from "../index";
import { resetStateAction } from "store/actions";

const initialState = {
    approle: null
};

const slice = createSlice({
    name: "applicationrole",
    initialState,
    reducers: {
        getAppRole(state, action) {
            state.approle = action.payload;
        },
        // resetState: (state) => initialState
        resetState: () => initialState
    },
    extraReducers: (builder) => {
        builder.addCase(resetStateAction, () => initialState);
    }
});

export function getAppRole(appRole) {
    return async () => {
        try {
            dispatch(slice.actions.getAppRole(appRole));
        } catch (error) {
            console.log("==> API FETCH FAILED: ", error);
        }
    };
}
export const { resetState: resetAppRoleaState } = slice.actions;

export default slice.reducer;
