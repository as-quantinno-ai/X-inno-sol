// import PropTypes from 'prop-types';
// import { useCallback, useEffect, useState } from 'react';
// import { Navigate, useNavigate } from 'react-router-dom';

// // project imports
// import useAuth from 'hooks/useAuth';
// // import { selectIsAuthenticated } from 'store/slices/authorization';
// import { useSelector } from 'react-redux';
// import { baseApi } from 'store/slices/initial-data';
// import { dispatch } from 'store';
// import { selectIsAuthenticated } from 'store/slices/authorization';
// import api from 'views/api-configuration/api';
// import { GetJWT, getInitialData, getUserDetails, updateDatasetSelection } from 'views/api-configuration/default';
// import { getUserRoleDataSets, setSelectedDataset } from 'store/slices/user-login';
// import { fetchUserData, selectLoading } from 'store/slices/authSlice';
// import { getDatasetFilterConfig } from 'store/slices/app-globe';
// import axios from 'axios';
// import RefreshComponent from 'views/new-app/pages/RefreshComponent';
// import useRefresh from 'hooks/useRefresh';

// // ==============================|| AUTH GUARD ||============================== //

// /**
//  * Authentication guard for routes
//  * @param {PropTypes.node} children children element/node
//  */
// const AuthGuard = ({ children }) => {
//     const [temp, setTemp] = useState(true);

//     // const { isLoggedIn } = useAuth();
//     // const navigate = useNavigate();
//     const isAuthenticate = useSelector(selectIsAuthenticated);
//     console.log(isAuthenticate);
//     const loading = useSelector(selectLoading);
//     console.log(loading);
//     // const { selectedDataset } = useSelector((state) => state.userLogin);
//     // const { userRoleDataSets } = useSelector((state) => state.userLogin);
//     const userRoleDataSets = JSON.parse(localStorage.getItem('getUserRole'));
//     const selectData = JSON.parse(localStorage.getItem('selectDataSet'));
//     // console.log('selectData', selectData.payload);
//     // const selectedDataset = selectData.payload;
//     // console.log('calling from auth >>>>', selectedDataset);
//     // console.log('find the userRoleDataSets>>', userRoleDataSets);

//     // const refreshMy = async () => {
//     //     const my = JSON.parse(localStorage.getItem('getUserRole'));
//     //     console.log('my', my);
//     //     axios.put(
//     //         `${updateDatasetSelection}${my[0].userRoleDatasets.productclientdatasetsid}`,
//     //         {},
//     //         {
//     //             headers: {
//     //                 Authorization: `Bearer ${GetJWT()}`
//     //             }
//     //         }
//     //     );
//     // };

//     const loadApi = async () => {
//         const response = await api.get(`${getInitialData}`);
//         // console.log('auth==>', response.data.status);
//         // if (response.data.status === 200) {
//         //     console.log('true');
//         //     setTemp(true);
//         // } else {
//         //     console.log('false');
//         //     setTemp(false);
//         // }
//     };

//     //     useEffect(() => {
//     //         if (!isLoggedIn) {
//     //             navigate('login', { replace: true });
//     //         }
//     //     }, [isLoggedIn, navigate]);
//     //     return children;
//     // };

//     // useRefresh();
//     // dispatch(getUserRoleDataSets());
//     console.log('find the outside>>', userRoleDataSets);

//     useEffect(() => {
//         // Dispatch the async action when the component mounts
//         // const { userRoleDataSets } = useSelector((state) => state.userLogin);
//         console.log('find the>>', userRoleDataSets);

//         loadApi();
//         // refreshMy();
//         dispatch(baseApi());
//         dispatch(fetchUserData());
//         dispatch(getUserRoleDataSets());
//         // console.log('calling from auth effect >>>>', selectedDataset);
//         // dispatch(setSelectedDataset(userRoleDataSets[0].userRoleDatasets));
//         // dispatch(getDatasetFilterConfig(userRoleDataSets[0].userRoleDatasets.productclientdatasetsid));
//     }, []);

//     // return isAuthenticate || loading ? children : <Navigate to="/" />;
//     return children;
// };

// AuthGuard.propTypes = {
//     children: PropTypes.node
// };

// export default AuthGuard;

import PropTypes from "prop-types";
// import React, { useEffect } from "react";
// import { Navigate, useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";
import React from "react";
// project imports
// import useAuth from "hooks/useAuth";
// import api from "views/api-configuration/api";
// import { getInitialData } from "views/api-configuration/default";
import { dispatch } from "store";
// import { baseApi } from "store/slices/initial-data";
// import { getUserRoleDataSets } from "store/slices/user-login";
// import { getUserRoleDataSets } from "store/slices/user-login";
import { selectIsAuthenticated } from "store/slices/authorization";
// import { fetchUserData, logout, selectLoading } from "store/slices/authSlice";
import { logout, selectLoading } from "store/slices/authSlice";
import { useSelector } from "react-redux";

// ==============================|| AUTH GUARD ||============================== //

/**
 * Authentication guard for routes
 * @param {PropTypes.node} children children element/node
 */

const AuthGuard = ({ children }) => {
    const isAuthenticate = useSelector(selectIsAuthenticated);
    const loading = useSelector(selectLoading);

    if (!isAuthenticate) {
        dispatch(logout());
        return <Navigate to="/login" />;
    }
    if (isAuthenticate && window.location.pathname === "/login") {
        return <Navigate to="/" />;
    }

    return isAuthenticate || loading ? children : <Navigate to="/login" />;
};

AuthGuard.propTypes = {
    children: PropTypes.node
};

export default AuthGuard;
