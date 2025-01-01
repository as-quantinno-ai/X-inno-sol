import { useRoutes } from "react-router-dom";

import LoginRoutes from "./LoginRoutes";
import MainRoutes from "./MainRoutes";
// import { selectIsAuthenticated } from "store/slices/authorization";
// import { useSelector } from "react-redux";

// ==============================|| ROUTING RENDER ||============================== //

export default function ThemeRoutes() {
    return useRoutes([MainRoutes, LoginRoutes]);
    // return useRoutes([MainRoutes, LoginRoutes]);
}
