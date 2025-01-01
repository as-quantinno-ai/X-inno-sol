import { createSlice } from "@reduxjs/toolkit";
import { dispatch } from "../index";
import { resetStateAction } from "store/actions";

const initialState = {
    lakehouseDataDomain: "",
    dataDiscoveryDataDomain: "",
    dataDiscoverySelectedLayer: "GOLD",
    metadaataManagerDestinationLayer: "GOLD",
    metadaataManagerLoadFrom: "",
    dataCurationDataDomain: "",
    dataQuality: ""
};

const slice = createSlice({
    name: "selectedvalue",
    initialState,
    reducers: {
        getlakehouseDataDomain(state, action) {
            state.lakehouseDataDomain = action.payload;
        },
        getdataDiscoveryDataDomain(state, action) {
            state.dataDiscoveryDataDomain = action.payload;
        },
        getdataDiscoverySelectedLayer(state, action) {
            state.dataDiscoverySelectedLayer = action.payload;
        },
        getmetadaataManagerDestinationLayer(state, action) {
            state.metadaataManagerDestinationLayer = action.payload;
        },
        getmetadaataManagerLoadFrom(state, action) {
            state.metadaataManagerLoadFrom = action.payload;
        },
        getdataCurationDataDomain(state, action) {
            state.dataCurationDataDomain = action.payload;
        },
        getdataQuality(state, action) {
            state.dataQuality = action.payload;
        },
        resetState: () => initialState
    },
    extraReducers: (builder) => {
        builder.addCase(resetStateAction, () => initialState);
    }
});

export function getLakehouseDataDomain(value) {
    return async () => {
        try {
            // console.log("value", value);
            dispatch(slice.actions.getlakehouseDataDomain(value));
        } catch (error) {
            console.log("==> API FETCH FAILED: ", error);
        }
    };
}
export function getDataDiscoveryDataDomain(value) {
    return async () => {
        try {
            dispatch(slice.actions.getdataDiscoveryDataDomain(value));
        } catch (error) {
            console.log("==> API FETCH FAILED: ", error);
        }
    };
}
export function getDataDiscoverySelectedLayer(value) {
    return async () => {
        try {
            dispatch(slice.actions.getdataDiscoverySelectedLayer(value));
        } catch (error) {
            console.log("==> API FETCH FAILED: ", error);
        }
    };
}
export function getMetadaataManagerDestinationLayer(value) {
    return async () => {
        try {
            dispatch(slice.actions.getmetadaataManagerDestinationLayer(value));
        } catch (error) {
            console.log("==> API FETCH FAILED: ", error);
        }
    };
}
export function getMetadaataManagerLoadFrom(value) {
    return async () => {
        try {
            dispatch(slice.actions.getmetadaataManagerLoadFrom(value));
        } catch (error) {
            console.log("==> API FETCH FAILED: ", error);
        }
    };
}

export function getDataCurationDataDomain(value) {
    return async () => {
        try {
            dispatch(slice.actions.getdataCurationDataDomain(value));
        } catch (error) {
            console.log("==> API FETCH FAILED: ", error);
        }
    };
}

export function getDataQuality(value) {
    return async () => {
        try {
            dispatch(slice.actions.getdataQuality(value));
        } catch (error) {
            console.log("==> API FETCH FAILED: ", error);
        }
    };
}

export const {
    getlakehouseDataDomain,
    getdataDiscoveryDataDomain,
    getdataDiscoverySelectedLayer,
    getmetadaataManagerDestinationLayer,
    getmetadaataManagerLoadFrom,
    getdataCurationDataDomain,
    getdataQuality,
    resetState
} = slice.actions;

export default slice.reducer;
