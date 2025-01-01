import { createSlice } from "@reduxjs/toolkit";
import { dispatch } from "../index";
import { resetStateAction } from "store/actions";

const initialState = {
    penetration_role: "", // 'SUPER_ADMIN', 'TENANT_ADMIN', 'USER@TR', 'USER@APP'
    service_role: "",
    isAuthenticate: false,
    user_perms: [
        // 'CATALOGS_VIEW',
        // 'MACHINELEARNING_VIEW',
        // 'FEATUREDS_VIEW',
        // 'RAWDS_VIEW',
        // 'CHAT_VIEW',
        // 'DASHBOARD_CREATE',
        // 'DASHBOARD_VIEW',
        // 'FORM_CREATE',
        // 'FORM_VIEW',
        // 'ADV_VIZ_VIEW'
    ]
};

const slice = createSlice({
    name: "authorization",
    initialState,
    reducers: {
        setUserRole(state, action) {
            state.penetration_role = action.payload;
            state.isAuthenticate = true;
        },
        setUserSerRole(state, action) {
            state.service_role = action.payload;
            state.isAuthenticate = true;
        },
        setUserPerms(state, action) {
            state.user_perms = action.payload;
            state.isAuthenticate = true;
        },
        // resetState: (state) => initialState
        resetState: () => initialState
    },
    extraReducers: (builder) => {
        builder.addCase(resetStateAction, () => initialState);
    }
});

export function setUserRole(ROLE) {
    return async () => {
        try {
            dispatch(slice.actions.setUserRole(ROLE));
        } catch (error) {
            console.log(error);
        }
    };
}

export function setUserSerRole() {
    return async () => {
        try {
            dispatch(slice.actions.setUserPerms(""));
        } catch (error) {
            console.log(error);
        }
    };
}

export function setUserPerms(perms) {
    return async () => {
        try {
            dispatch(slice.actions.setUserPerms(perms));
        } catch (error) {
            console.log(error);
        }
    };
}

export const selectIsAuthenticated = (state) => state.authorization.isAuthenticate;
export const { resetState: resetauthorizationState } = slice.actions;
export default slice.reducer;

// export const { scroll } = slice.actions;
