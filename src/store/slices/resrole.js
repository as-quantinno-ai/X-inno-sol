import { createSlice } from "@reduxjs/toolkit";
import { dispatch } from "../index";
import { resetStateAction } from "store/actions";

const initialState = {
    resrole: null
};

const slice = createSlice({
    name: "resourcerole",
    initialState,
    reducers: {
        getResRole(state, action) {
            state.resrole = action.payload;
        },
        // resetState: (state) => initialState
        resetState: () => initialState
    },
    extraReducers: (builder) => {
        builder.addCase(resetStateAction, () => initialState);
    }
});

export function getResRole(resRole) {
    return async () => {
        try {
            dispatch(slice.actions.getResRole(resRole));
        } catch (error) {
            console.log("==> API FETCH FAILED: ", error);
        }
    };
}
export const { resetState: resetresourceroleState } = slice.actions;

export default slice.reducer;
