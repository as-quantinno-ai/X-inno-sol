import { createSlice } from "@reduxjs/toolkit";
import { dispatch } from "../index";
import {
    getCatalogButton,
    getPublishedMlModelAndMlModelRun,
    getDatasetFilterConfigUrl,
    getGenAiFLowProductIdUrl
} from "views/api-configuration/default";
import api from "views/api-configuration/api";
import { resetStateAction } from "store/actions";

const initialState = {
    scroll: 0,
    screens: null,
    forms: null,
    chatbots: null,
    actionButtons: null,
    publishedMlModel: null,
    datasetFiltersConfig: null
};

const slice = createSlice({
    name: "globe",
    initialState,
    reducers: {
        // Testing Reducer
        scroll(state, action) {
            state.scroll = action.payload;
        },

        setScreens(state, action) {
            state.screens = action.payload;
        },

        setForms(state, action) {
            state.forms = action.payload;
        },

        setChatbots(state, action) {
            state.chatbots = action.payload;
        },
        setActionBtns(state, action) {
            state.actionButtons = action.payload;
        },

        setPublishedMlModel(state, action) {
            state.publishedMlModel = action.payload;
        },

        getDatasetFilterConfig(state, action) {
            state.datasetFiltersConfig = action.payload;
        },
        // resetState: (state) => initialState
        resetState: () => initialState
    },
    extraReducers: (builder) => {
        builder.addCase(resetStateAction, () => initialState);
    }
});

export function moveScroll(scrollTop) {
    return async () => {
        try {
            dispatch(slice.actions.scroll(scrollTop));
            // eslint-disable-next-line no-unused-vars
        } catch (error) {
            // dispatch(slice.actions.hasError(error));
        }
    };
}

export function setScreens(productclientdatasetsid) {
    return async () => {
        try {
            // const response = await axios.get(`${getCustomScreenNames}/${productclientdatasetsid}`, { headers: GetAccessToken() });
            dispatch(slice.actions.setScreens(productclientdatasetsid));
        } catch (error) {
            console.log("getCumulativeDataResponse", error);
            // dispatch(slice.actions.hasError(error));
        }
    };
}

export function setForms(productclientdatasetsid) {
    return async () => {
        try {
            //   const response = await axios.get(`${getCustomFormsByprodclidsid(productclientdatasetsid)}`, { headers: GetAccessToken() });
            dispatch(slice.actions.setForms(productclientdatasetsid));
        } catch (error) {
            console.log("getCumulativeDataResponse", error);
            // dispatch(slice.actions.hasError(error));
        }
    };
}

export function setChatbots(productclientdatasetsid) {
    return async () => {
        try {
            const response = await api.get(`${getGenAiFLowProductIdUrl(productclientdatasetsid)}`);

            dispatch(slice.actions.setChatbots(response.data.result));
        } catch (error) {
            if (error.response && error.response.status === 403) {
                dispatch(slice.actions.setChatbots(null));
            }
        }
    };
}

export function setButtons(productclientdatasetsid) {
    return async () => {
        try {
            const response = await api.get(`${getCatalogButton(productclientdatasetsid)}`);

            dispatch(slice.actions.setActionBtns(response.data.result));
        } catch (error) {
            console.log("getCumulativeDataResponse", error);
        }
    };
}

export function getPublishMlModel(productclientdatasetsid) {
    return async () => {
        try {
            const response = await api.get(`${getPublishedMlModelAndMlModelRun}${productclientdatasetsid}`);

            dispatch(slice.actions.setPublishedMlModel(response.data.result));
        } catch (error) {
            console.log("getCumulativeDataResponse", error);
        }
    };
}

export function getDatasetFilterConfig(productclientdatasetsid) {
    return async () => {
        try {
            const response = await api.get(`${getDatasetFilterConfigUrl}${productclientdatasetsid}`);

            dispatch(slice.actions.getDatasetFilterConfig(response.data.result));
        } catch (error) {
            console.log("getCumulativeDataResponse", error);
        }
    };
}

export default slice.reducer;

// export const { scroll } = slice.actions;
export const { resetState: resetAppGlobeState } = slice.actions;
