import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "views/api-configuration/api";
// import { getInitialData, refreshTokenUrl } from "views/api-configuration/default";
import { getInitialData } from "views/api-configuration/default";
import { resetStateAction } from "store/actions";

export const fetchUserData = createAsyncThunk("auth/fetchUserData", async () => {
    const response = await api.get(`${getInitialData}`);
    console.log(response);
});

const initialState = {
    // isAuthenticate: false,
    loading: true
};
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state) => {
            state.loading = true;
        },
        logout: (state) => {
            state.loading = false;
        },
        // resetState: (state) => initialState
        resetState: () => initialState
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserData.pending, (state, action) => {
                // state.isAuthenticate = true;
                state.loading = true;
                console.log("pending");
                state.userData = action.payload;
            })
            .addCase(fetchUserData.fulfilled, (state, action) => {
                // state.isAuthenticate = true;
                state.loading = true;
                console.log("full");
                state.userData = action.payload;
            })
            .addCase(fetchUserData.rejected, (state, action) => {
                // state.isAuthenticate = false;
                state.loading = false;
                console.log("fail");
                state.error = action.error.message;
            })
            .addCase(resetStateAction, () => initialState);
    }
});

export const { login, logout } = authSlice.actions;
// export const selectIsAuthenticated = (state) => state.auth.isAuthenticate;
export const selectLoading = (state) => state.auth.loading;
export default authSlice.reducer;
export const { resetState: resetauthState } = authSlice.actions;
