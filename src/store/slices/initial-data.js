import { createSlice } from "@reduxjs/toolkit";
import { dispatch } from "../index";
import { getInitialData } from "views/api-configuration/default";
import { setUserPerms } from "store/slices/authorization";
import { getAllCatalogs } from "store/slices/AppDashboardRawSha";
import { getQuicklinks, getUserHistory, getUserProfile } from "store/slices/user-login";
import { setForms, setScreens } from "store/slices/app-globe";
import { setResUserRoles, setAssignedResRoles } from "store/slices/assignresrole";
import { getRoleAddPermission } from "store/slices/roleaddpermission";
import { getAppUserRoles, getAssignedAppRoles } from "store/slices/assignapprole";
import { getAllUserTenant } from "./tenantuser";
import { getAllAppUser } from "./appuser";
import { getAppRole } from "./approle";
import { getResRole } from "./resrole";
import api from "views/api-configuration/api";
import { resetStateAction } from "store/actions";

const initialState = {
    baseData: {},
    baseApiLoading: false,
    error: null
};

const slice = createSlice({
    name: "initialdata",
    initialState,
    reducers: {
        setBaseApiStart(state) {
            state.baseApiLoading = true;
        },
        setBaseApi(state, action) {
            state.baseApiLoading = false;
            state.baseData = action.payload;
        },
        setBaseApiFailure(state, action) {
            state.baseApiLoading = false;
            state.error = action.payload;
        },
        // resetState: (state) => initialState
        resetState: () => initialState
    },
    extraReducers: (builder) => {
        builder.addCase(resetStateAction, () => initialState);
    }
});

export const selectBaseData = (state) => state.initialdata.baseData;

export const baseApi = () => async () => {
    try {
        dispatch(slice.actions.setBaseApiStart());
        const response = await api.get(`${getInitialData}`);

        if (response.data.result) {
            const resp = response.data.result;
            dispatch(slice.actions.setBaseApi(resp));
            dispatch(getUserHistory(resp.selfuser));
            dispatch(getUserProfile(resp.activityLogs));
            dispatch(getQuicklinks(resp.quickLinks));
            dispatch(getAllCatalogs(resp.catalogs));
            dispatch(setScreens(resp.screens));
            dispatch(setForms(resp.formstructures));

            const hasMatchingRole = resp.datasetRoles?.[0]?.roleType === "USER@TR" || resp.datasetRoles?.[0]?.roleType === "TENANT_ADMIN";
            const hasUserTrRole = resp.roles?.some((role) => role.type === "USER@TR");
            const hasUserAPPRole = resp.roles?.some((role) => role.type === "USER@APP");
            const resourcePermissions = resp.resourcePemrmissions?.map((item) => item.permissionResourceName);

            if (hasMatchingRole) {
                dispatch(setUserPerms(resourcePermissions));
            }
            dispatch(getRoleAddPermission(resp.resourcePemrmissions));
            if (hasUserTrRole) {
                dispatch(setAssignedResRoles(resp.roles));
                dispatch(setResUserRoles(resp.roles));
                dispatch(getResRole(resp.roles));
            }
            if (hasUserAPPRole) {
                dispatch(getAssignedAppRoles(resp.roles));
                dispatch(getAppUserRoles(resp.roles));
                dispatch(getAppRole(resp.roles));
            }
            dispatch(getAllUserTenant(resp.userTr));
            dispatch(getAllAppUser(resp.userApp));
        }
    } catch (error) {
        console.error("Error:", error);
        dispatch(slice.actions.setBaseApiFailure(error));
    }
};

export default slice.reducer;
export const { resetState: resetinitialdatastate } = slice.actions;
