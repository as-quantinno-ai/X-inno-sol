import { createSlice } from "@reduxjs/toolkit";
import { dispatch } from "../index";
import {
    getCreateConnector,
    getDataSourceSchemaFields,
    getDataSourcesByCatalogsId,
    getDBMSConfig,
    getS3Config
} from "views/api-configuration/default";
import api from "views/api-configuration/api";
import { resetStateAction } from "store/actions";

const initialState = {
    configData: null,
    getconfigData: null,
    connectorInfo: null,
    schemaFields: null,
    dbmsConfig: null,
    s3Config: null
};

const slice = createSlice({
    name: "datasource-configuration",
    initialState,
    reducers: {
        // Testing Reducer

        setConfigData(state, action) {
            state.configData = action.payload;
        },
        getConfigData(state, action) {
            state.getconfigData = action.payload;
        },
        connectorInfo(state, action) {
            state.connectorInfo = action.payload;
        },
        getSchemaFields(state, action) {
            state.schemaFields = action.payload;
        },
        getDbmsConfiguration(state, action) {
            state.dbmsConfig = action.payload;
        },
        getS3Configuration(state, action) {
            state.s3Config = action.payload;
        },
        // resetState: (state) => initialState
        resetState: () => initialState
    },
    extraReducers: (builder) => {
        builder.addCase(resetStateAction, () => initialState);
    }
});

export function getConnector(datasourceId) {
    return async () => {
        try {
            const response = await api.get(getCreateConnector(datasourceId));
            dispatch(slice.actions.connectorInfo(response.data));
        } catch (error) {
            console.log("getCumulativeDataResponse", error);
            // dispatch(slice.actions.hasError.error));
        }
    };
}

export function setConfigurations(data) {
    return async () => {
        try {
            dispatch(slice.actions.setConfigData(data));
        } catch (error) {
            console.log("getCumulativeDataResponse", error);
            // dispatch(slice.actions.hasError(error));
        }
    };
}
export function getConfigurations(tableid) {
    return async () => {
        try {
            const response = await api.get(`${getDataSourcesByCatalogsId(tableid)}`);

            dispatch(slice.actions.getConfigData(response.data.result));
        } catch (error) {
            console.log(error);
        }
    };
}
export function getDbmsConfig(dataSourceId) {
    return async () => {
        try {
            const response = await api.get(getDBMSConfig(dataSourceId));
            dispatch(slice.actions.getDbmsConfiguration(response.data.result));
        } catch (error) {
            console.log("getConfigurations", error);
            // dispatch(slice.actions.hasError(error));
        }
    };
}
export function gets3config(dataSourceId) {
    return async () => {
        try {
            const response = await api.get(getS3Config(dataSourceId));
            dispatch(slice.actions.getS3Configuration(response.data.result));
        } catch (error) {
            console.log("getConfigurations", error);
            // dispatch(slice.actions.hasError(error));
        }
    };
}
export function getSchema(dataSourceId) {
    return async () => {
        try {
            const response = await api.get(getDataSourceSchemaFields(dataSourceId));
            dispatch(slice.actions.getSchemaFields(response.data.result));
        } catch (error) {
            console.log("getConfigurations", error);
            // dispatch(slice.actions.hasError(error));
        }
    };
}

export default slice.reducer;

export const { setConfigData, setAllConfigData, getSchemaFields, getDbmsConfiguration, getS3Configuration } = slice.actions;
