import { lazy } from "react";
import React from "react";
// project imports
// import AuthGuard from "utils/route-guard/AuthGuard";

// import GuestGuard from 'utils/route-guard/GuestGuard';
import MinimalLayout from "layout/MinimalLayout";
import NavMotion from "layout/NavMotion";
import Loadable from "ui-component/Loadable";
// import Login from 'views/new-app/auth-pages/authentication/authentication3/Login';

// login routing
const Login3 = Loadable(lazy(() => import("views/new-app/auth-pages/authentication/authentication3/Login3")));
const DatasetSelection = Loadable(lazy(() => import("views/new-app/pages/DatasetSelection")));
// const AuthForgotPassword = Loadable(lazy(() => import('views/pages/authentication/ForgotPassword3')));

// ==============================|| AUTH ROUTING ||============================== //

const LoginRoutes = {
    path: "/login",
    element: (
        <NavMotion>
            <MinimalLayout />
            {/* </GuestGuard> */}
        </NavMotion>
    ),
    children: [
        // {
        //     path: '/register',
        //     element: <AuthLogin />
        // },
        // {
        //     path: '/lo',
        //     element: <AuthLogin />
        // },
        {
            path: "/login",
            element: <Login3 />
            // element: <Login />
        },
        {
            path: "ds-selection",
            element: <DatasetSelection />
        }
        // {
        //     path: '/intro',
        //     element: <Login3 />
        // }
        // {
        //     path: '/forgot',
        //     element: <AuthForgotPassword />
        // }
    ]
};

export default LoginRoutes;
