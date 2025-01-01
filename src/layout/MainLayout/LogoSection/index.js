// import { Link as RouterLink } from "react-router-dom";
import React from "react";
// material-ui
// import { Link, Divider } from "@mui/material";
import { Divider } from "@mui/material";

// project imports
// import { DASHBOARD_PATH } from "config";
import Logo from "ui-component/Logo";
// import { useTheme } from "@mui/material/styles";

// ==============================|| MAIN LOGO ||============================== //

const LogoSection = () => (
    <div style={{ display: "flex", alignItems: "center" }}>
        <Logo />
        <Divider sx={{ mt: 0.25, mb: 1.25 }} />
    </div>
);

export default LogoSection;
