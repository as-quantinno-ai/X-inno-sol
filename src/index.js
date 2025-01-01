import ReactDOM from "react-dom/client";

// third party
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import React from "react";

import "_mockApis";
// project imports
import App from "App";
import { BASE_PATH } from "config";
import { store } from "store";
import * as serviceWorker from "serviceWorker";
import reportWebVitals from "reportWebVitals";
import { ConfigProvider } from "contexts/ConfigContext";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";

// style + assets
import "assets/scss/style.scss";

// ==============================|| REACT DOM RENDER  ||============================== //
const root = ReactDOM.createRoot(document.getElementById("root"));
const persistor = persistStore(store);

root.render(
    <React.StrictMode>
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <ConfigProvider>
                    <BrowserRouter basename={BASE_PATH}>
                        <App />
                    </BrowserRouter>
                </ConfigProvider>
            </PersistGate>
        </Provider>
    </React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
