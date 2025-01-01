// third-party
import { createSlice } from "@reduxjs/toolkit";

// project imports
import axios from "utils/axios";
import { dispatch } from "../index";
import { resetStateAction } from "store/actions";

// ----------------------------------------------------------------------

const initialState = {
    error: null,
    chats: [],
    user: {},
    users: []
};

const slice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        // HAS ERROR
        hasError(state, action) {
            state.error = action.payload;
        },

        // GET USER
        getUserSuccess(state, action) {
            state.user = action.payload;
        },

        // GET USER CHATS
        getUserChatsSuccess(state, action) {
            state.chats = action.payload;
        },

        // GET USERS
        getUsersSuccess(state, action) {
            state.users = action.payload;
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

export function getUser(id) {
    console.log(id, "id");
    return async () => {
        try {
            const response = await axios.post("/api/chat/users/id", { id });
            // const response = await api.post('/api/chat/users/id', { id });
            dispatch(slice.actions.getUserSuccess(response.data));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

export function getUserChats(user) {
    return async () => {
        try {
            const response = await axios.post("/api/chat/filter", { user });
            // const response = api.post('/api/chat/filter', { user });
            dispatch(slice.actions.getUserChatsSuccess(response.data));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

export function insertChat(chat) {
    return async () => {
        try {
            await axios.post("/api/chat/insert", chat);
            // await api.post('/api/chat/insert', chat);
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

export function getUsers() {
    return async () => {
        try {
            const response = await axios.get("/api/chat/users");
            // const response = await api.get('/api/chat/users');
            dispatch(slice.actions.getUsersSuccess(response.data.users));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}
export const { resetState: resetchatState } = slice.actions;
