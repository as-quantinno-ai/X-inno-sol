import { createSlice } from "@reduxjs/toolkit";
import { dispatch } from "../index";
import { resetStateAction } from "store/actions";

const initialState = {
    appuser: null
};

const slice = createSlice({
    name: "applicationuser",
    initialState,
    reducers: {
        getAllAppUserSuccess(state, action) {
            state.appuser = action.payload;
        },
        // resetState: (state) => initialState
        resetState: () => initialState
    },
    extraReducers: (builder) => {
        builder.addCase(resetStateAction, () => initialState);
    }
});

export function getAllAppUser(userApp) {
    return async () => {
        try {
            dispatch(slice.actions.getAllAppUserSuccess(userApp));
        } catch (error) {
            console.log("==> API FETCH FAILED: ", error);
        }
    };
}
export const { resetState: resetapplicationuserState } = slice.actions;

export default slice.reducer;
