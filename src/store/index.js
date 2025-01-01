// third-party
import { configureStore } from "@reduxjs/toolkit";
import { useDispatch as useAppDispatch, useSelector as useAppSelector } from "react-redux";

import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

// project imports
import rootReducer from "./reducer";

// ==============================|| REDUX - MAIN STORE ||============================== //

const persistConfig = {
    key: "root",
    timeout: 100,
    // whitelist: [
    //     'datasourceconfiguration',
    //     'datasource-configuration',
    //     'getconfigData',
    //     'login',
    //     'userInstance',
    //     'userLogin',
    //     'rawDataSources',
    //     'user-login',
    //     'userRoleDataSets',
    //     'selectedDataset',
    //     'AppDashboardRawSha',
    //     'dataCollection'
    // ],
    // safelist: [
    //     'datasourceconfiguration',
    //     'datasource-configuration',
    //     'getconfigData',
    //     'login',
    //     'userInstance',
    //     'userLogin',
    //     'AppDashboardRawSha',
    //     'dataCollection',
    //     'rawDataSources',
    //     'user-login',
    //     'userRoleDataSets',
    //     'selectedDataset'
    // ],
    storage
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false, immutableCheck: false })
});

const persister = persistStore(store);

const { dispatch } = store;

const useDispatch = () => useAppDispatch();
const useSelector = useAppSelector;

export { store, persister, dispatch, useSelector, useDispatch };
