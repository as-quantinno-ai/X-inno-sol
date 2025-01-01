import React from "react";
// ==============================|| LANDING - FOOTER PAGE ||============================== //
import { CircularProgress, Box } from "@mui/material";

const loadingCoverStyles = {
    width: "100%",
    height: "100vh",
    position: "fixed",
    top: "0px",
    left: "0px",
    background: "#0d0d0db3",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 20000
};

const Loading = () => (
    <>
        <Box style={loadingCoverStyles}>
            <CircularProgress />
        </Box>
    </>
);

export default Loading;
