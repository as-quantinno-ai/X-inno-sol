import { createAction } from "@reduxjs/toolkit";
// action - account reducer
export const LOGIN = "LOGIN";
export const LOGOUT = "LOGOUT";
export const REGISTER = "REGISTER";
export const FIREBASE_STATE_CHANGED = "FIREBASE_STATE_CHANGED";
export const RESET_STATE = "resetState";
export const logoutAction = "LOGOUT";
export const resetStateAction = createAction("RESET_ALL_SLICES");

// export const resetStateAction = () => ({
//     type: RESET_STATE
// });
