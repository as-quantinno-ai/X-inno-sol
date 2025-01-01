// third-party
import { combineReducers } from "redux";

// project imports
import snackbarReducer from "./slices/snackbar";
import menuReducer from "./slices/menu";
import dashboardReducer from "./slices/app-dashboard";
import featuredDataDiscoveryReducer from "./slices/feature-data-discovery";
import userLoginReducer from "./slices/user-login";
import chatReducer from "./slices/chat";
import dataCollectionReducer from "./slices/AppDashboardRawSha";
import mlModelRawReducer from "./slices/MlModelsRawSha";
import jobsReducer from "./slices/app-jobs";
import formReducer from "./slices/custom-form";
import globeReducer from "./slices/app-globe";
import authorizationReducer from "./slices/authorization";
import triggerReducer from "./slices/trigger";
import tenantuserReducer from "./slices/tenantuser";
import appuserReducer from "./slices/appuser";
import resroleReducer from "./slices/resrole";
import roleaddpermissionReducer from "./slices/roleaddpermission";
import approleReducer from "./slices/approle";
import approleaddpermissionReducer from "./slices/approleaddpermission";
import userroleReducer from "./slices/assignapprole";
import userresroleReducer from "./slices/assignresrole";
import initialDataReducer from "./slices/initial-data";
import datasourceconfigurationReducer from "./slices/datasource-configuration";
import kanbanReducer from "./slices/kanban";
import selectedvalueReducer from "./slices/tables-user-selected-val";
import authReducer from "./slices/authSlice";
import { resetStateAction } from "./actions";
import qualityRecducer from "./slices/quality-controller";
// ==============================|| COMBINE REDUCER ||============================== //

const reducer = combineReducers({
    snackbar: snackbarReducer,
    menu: menuReducer,
    dashboard: dashboardReducer,
    featuredDataDiscovery: featuredDataDiscoveryReducer,
    userLogin: userLoginReducer,
    chat: chatReducer,
    kanban: kanbanReducer,
    dataCollection: dataCollectionReducer,
    selectedvalue: selectedvalueReducer,
    mlModelRaw: mlModelRawReducer,
    jobs: jobsReducer,
    form: formReducer,
    globe: globeReducer,
    datasourceconfiguration: datasourceconfigurationReducer,
    authorization: authorizationReducer,
    trigger: triggerReducer,
    tenantuser: tenantuserReducer,
    appuser: appuserReducer,
    resrole: resroleReducer,
    approle: approleReducer,
    roleaddpermission: roleaddpermissionReducer,
    approleaddpermission: approleaddpermissionReducer,
    userrole: userroleReducer,
    userresrole: userresroleReducer,
    initialdata: initialDataReducer,
    auth: authReducer,
    qualitycontroller: qualityRecducer
});

const rootReducer = (state, action) => {
    if (action.type === resetStateAction.type) {
        state = undefined;
    }
    return reducer(state, action);
};

export default rootReducer;
