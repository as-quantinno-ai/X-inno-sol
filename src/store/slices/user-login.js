import { getUser, getUserRoleDatasets, GetAccessToken, getUserDetails } from "views/api-configuration/default";
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { dispatch } from "../index";
import { setUserRole } from "./authorization";
import api from "views/api-configuration/api";
import { resetStateAction } from "store/actions";

const initialState = {
    login: false,
    userInstance: null,
    userRoleDataSets: null,
    selectedDataset: null,
    userHistory: null,
    userProfile: null,
    quickLinks: null,
    selectedDatasetProceedClicked: false
};

const slice = createSlice({
    name: "userLogin",
    initialState,
    reducers: {
        // Testing Reducer
        hasRequest(state) {
            state.f1 += 1;
        },

        // Reducer to control Logged In User Instance data
        getloginSuccess(state, action) {
            state.login = true;
            state.userInstance = action.payload;
        },

        // Reducer to control Logged Out User Instance data
        getlogoutSuccess(state) {
            state.login = false;
            state.userRoleDataSets = null;
        },
        getuserInformation(state, action) {
            state.userProfile = action.payload;
        },
        getuserHistory(state, action) {
            state.userHistory = action.payload;
        },
        getuserquicklinks(state, action) {
            state.quickLinks = action.payload;
        },
        // Reducer to control user-role-dataset-id for job table manipulation
        getUserRoleDataSetsSuccess(state, action) {
            state.userRoleDataSets = action.payload;
        },

        getSelectedDatasetSuccess(state, action) {
            if (state.userRoleDataSets !== null)
                state.selectedDataset = state.userRoleDataSets.find((obj) => obj.userroledatasetid === Number(action.payload));
        },

        setSelectedDataset(state, action) {
            state.selectedDataset = action.payload;
        },
        setSelectedDatasetProceed(state, action) {
            state.selectedDatasetProceedClicked = action.payload;
        },
        resetState: () => initialState
    },
    extraReducers: (builder) => {
        builder.addCase(resetStateAction, () => initialState);
    }
});

// Async calls from server
export function getlogin(uname, pwd) {
    return async () => {
        try {
            const response = await axios.get(`${getUser}${pwd}&username=${uname}`, { headers: GetAccessToken() });
            if (response.data.result !== "FAIL") {
                dispatch(slice.actions.getloginSuccess(response.data.result));
                const userroledsres = await axios.get(`${getUserRoleDatasets}${uname}`, { headers: GetAccessToken() });
                dispatch(slice.actions.getUserRoleDataSetsSuccess(userroledsres.data.result));
            }
        } catch (error) {
            console.log(error);
            // dispatch(slice.actions.hasError(error));
        }
    };
}

export function getlogout() {
    return async () => {
        try {
            dispatch(slice.actions.getlogoutSuccess(false));
        } catch (error) {
            console.log(error);
            // dispatch(slice.actions.hasError(error));
        }
    };
}

export function getUserHistory(data) {
    return async () => {
        try {
            dispatch(slice.actions.getuserHistory(data));
        } catch (error) {
            console.log(error);
            // dispatch(slice.actions.hasError(error));
        }
    };
}

export function getUserProfile(data) {
    return async () => {
        try {
            dispatch(slice.actions.getuserInformation(data));
        } catch (error) {
            console.log(error);
            // dispatch(slice.actions.hasError(error));
        }
    };
}

export function getQuicklinks(data) {
    return async () => {
        try {
            dispatch(slice.actions.getuserquicklinks(data));
        } catch (error) {
            console.log(error);
            // dispatch(slice.actions.hasError(error));
        }
    };
}

export function setSelectedDataset(productClientDatasetId) {
    return async () => {
        try {
            dispatch(slice.actions.setSelectedDataset(productClientDatasetId));
            localStorage.setItem("selectDataSet", JSON.stringify(dispatch(slice.actions.setSelectedDataset(productClientDatasetId))));
        } catch (error) {
            console.log(error);
            // dispatch(slice.actions.hasError(error));
        }
    };
}

export function setSelectedDatasetProceedClicked(information) {
    return async () => {
        try {
            dispatch(slice.actions.setSelectedDatasetProceed(information));
        } catch (error) {
            console.log(error);
            // dispatch(slice.actions.hasError(error));
        }
    };
}

export function getUserRoleDataSets() {
    return async () => {
        try {
            // const response = await axios.get(`${getUserDetails}`, { headers: GetAccessToken() });
            const response = await api.get(`${getUserDetails}`);
            if (response.data.result !== "FAIL") {
                dispatch(setUserRole(response.data.result ? response.data.result[0].userRoleDatasets.keycloakrole : "NO_ROLE_ASSIGNED"));
                dispatch(slice.actions.getUserRoleDataSetsSuccess(response.data.result));

                localStorage.setItem("getUserRole", JSON.stringify(response.data.result));
            }
        } catch (error) {
            console.log(error);
        }
    };
}

// export function getSelectedUserRoleDataSets(datasetid) {
//     dispatch(slice.actions.getSelectedDatasetSuccess(datasetid));
// }

// export function getUserInstance() {
//     return async () => {
//         try {
//             const response = await axios.get(loadMainDashboardData);
//             response.data.result !== 'FAIL'
//                 ? dispatch(slice.actions.getUserInstanceSuccess(response.data.result))
//                 : console.log('error appears in get-user-instance');
//         } catch (error) {
//             console.log(error);
//             // dispatch(slice.actions.hasError(error));
//         }
//     };
// }
export default slice.reducer;

export const { resetState: resetuserLoginState, getSelectedDatasetSuccess } = slice.actions;
