import PropTypes from "prop-types";
import React from "react";
import { createContext, useEffect, useReducer } from "react";

// third-party
import firebase from "firebase/compat/app";
import "firebase/compat/auth";

// action - state management
import { LOGIN, LOGOUT } from "store/actions";
import accountReducer from "store/accountReducer";

// project imports
import { FIREBASE_API } from "config";

// firebase initialize
if (!firebase.apps.length) {
    firebase.initializeApp(FIREBASE_API);
}

// const
const initialState = {
    isLoggedIn: false,
    isInitialized: false,
    user: null
};

// ==============================|| FIREBASE CONTEXT & PROVIDER ||============================== //

export const FirebaseContext = createContext(null);

export const FirebaseProvider = ({ children }) => {
    const [state, dispatch] = useReducer(accountReducer, initialState);

    useEffect(
        () =>
            firebase.auth().onAuthStateChanged((user) => {
                if (user) {
                    dispatch({
                        type: LOGIN,
                        payload: {
                            isLoggedIn: true,
                            user: {
                                id: user.uid,
                                email: user.email,
                                name: user.displayName || "John Doe"
                            }
                        }
                    });
                } else {
                    dispatch({
                        type: LOGOUT
                    });
                }
            }),

        [dispatch]
    );

    return (
        <FirebaseContext.Provider
            value={{
                ...state,

                login: () => {}
            }}
        >
            {children}
        </FirebaseContext.Provider>
    );
};

FirebaseProvider.propTypes = {
    children: PropTypes.node
};

export default FirebaseContext;
