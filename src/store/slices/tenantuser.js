import { createSlice } from "@reduxjs/toolkit";
import { dispatch } from "../index";
// import { resetStateAction } from "store/actions";

const initialState = {
    tenantuser: null
};

const slice = createSlice({
    name: "tenantuser",
    initialState,
    reducers: {
        getAllUserTenantSuccess(state, action) {
            state.tenantuser = action.payload;
        },
        resetState: () => initialState
    }
});

export function getAllUserTenant(prodclientid) {
    return async () => {
        try {
            dispatch(slice.actions.getAllUserTenantSuccess(prodclientid));
        } catch (error) {
            console.log("==> API FETCH FAILED: ", error);
        }
    };
}
export const { resetState: resettenantuserState } = slice.actions;

export default slice.reducer;
