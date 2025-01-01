import PropTypes from "prop-types";
// import React, { useState } from "react";
import React from "react";

// material-ui
// import { useTheme } from "@mui/material/styles";
// import { Box, Avatar, Card, CardContent, Button, Grid, Typography, useMediaQuery, Drawer } from "@mui/material";
import { useMediaQuery, Drawer } from "@mui/material";

// third-party
// import PerfectScrollbar from "react-perfect-scrollbar";
// import { useSelector } from "store";

// project imports
import ChatTitleHistory from "./ChatTitleHistory";
// import MainCard from "ui-component/cards/MainCard";

const ChatDrawer = ({ user, setUser, open, onClose }) => {
    // const theme = useTheme();
    // const drawerBG = theme.palette.mode === "dark" ? "dark.main" : "grey.50";
    // const [showChat, setShowChat] = useState(false);
    // const { userRoleDataSets, selectedDataset, userInstance } = useSelector((state) => state.userLogin);
    // const firstLetter = userInstance ? userInstance.firstName.charAt(0).toUpperCase() : "U";
    // const handleClick = () => {
    //     setShowChat(true);
    // };
    const matchDownLg = useMediaQuery((theme) => theme.breakpoints.down("lg"));
    const matchDownMd = useMediaQuery((theme) => theme.breakpoints.down("md"));

    return !matchDownMd || !matchDownLg ? (
        <ChatTitleHistory user={user} setUser={setUser} />
    ) : (
        <Drawer anchor="left" open={open} onClose={onClose} sx={{ width: "600px" }}>
            <ChatTitleHistory user={user} setUser={setUser} />
        </Drawer>
    );
};

ChatDrawer.propTypes = {
    user: PropTypes.object,
    setUser: PropTypes.func,
    open: PropTypes.bool,
    onClose: PropTypes.func
};

export default ChatDrawer;
