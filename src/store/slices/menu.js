import { createSlice } from "@reduxjs/toolkit";
import { resetStateAction } from "store/actions";

// initial state
const initialState = {
    selectedItem: ["dashboard"],
    drawerOpen: false
};

// ==============================|| SLICE - MENU ||============================== //

const menu = createSlice({
    name: "menu",
    initialState,
    reducers: {
        activeItem(state, action) {
            state.selectedItem = action.payload;
        },

        openDrawer(state, action) {
            state.drawerOpen = action.payload;
        },
        // resetState: (state) => initialState
        resetState: () => initialState
    },
    extraReducers: (builder) => {
        builder.addCase(resetStateAction, () => initialState);
    }
});

export default menu.reducer;
export const { resetState: resetmenuState } = menu.actions;

export const { activeItem, openDrawer } = menu.actions;
