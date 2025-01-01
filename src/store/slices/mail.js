// third-party
import { createSlice } from "@reduxjs/toolkit";

// project imports
import { dispatch } from "../index";
import api from "views/api-configuration/api";
import { resetStateAction } from "store/actions";

// ----------------------------------------------------------------------

const initialState = {
    error: null,
    mails: [],
    unreadCount: undefined
};

const slice = createSlice({
    name: "mail",
    initialState,
    reducers: {
        // HAS ERROR
        hasError(state, action) {
            state.error = action.payload;
        },

        // GET MAILS
        getMailsSuccess(state, action) {
            state.mails = action.payload.mails;
            state.unreadCount = action.payload.unreadCount;
        },

        // FILTER MAILS
        filterMailsSuccess(state, action) {
            state.mails = action.payload;
        },
        // resetState: (state) => initialState
        resetState: () => initialState
    },
    extraReducers: (builder) => {
        builder.addCase(resetStateAction, () => initialState);
    }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getMails() {
    return async () => {
        try {
            // const response = await axios.get('/api/mails/list');
            const response = await api.get("/api/mails/list");
            dispatch(slice.actions.getMailsSuccess(response.data));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

export function filterMails(filter) {
    return async () => {
        try {
            // const response = await axios.post('/api/mails/filter', { filter });
            const response = await api.post("/api/mails/filter", { filter });
            dispatch(slice.actions.filterMailsSuccess(response.data));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

export function setImportant(id) {
    return async () => {
        try {
            // await axios.post('/api/mails/setImportant', { id });
            await api.post("/api/mails/setImportant", { id });
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

export function setStarred(id) {
    return async () => {
        try {
            // await axios.post('/api/mails/setStarred', { id });
            await api.post("/api/mails/setStarred", { id });
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

export function setRead(id) {
    return async () => {
        try {
            // await axios.post('/api/mails/setRead', { id });
            await api.post("/api/mails/setRead", { id });
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}
export const { resetState: resetmailState } = slice.actions;
