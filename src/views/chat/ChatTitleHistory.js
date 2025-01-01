import PropTypes from "prop-types";
import React, { useState } from "react";

// material-ui
import { useTheme } from "@mui/material/styles";
import { Box, Avatar, Card, CardContent, Button, Grid, Typography } from "@mui/material";

// third-party
import PerfectScrollbar from "react-perfect-scrollbar";
import { useSelector } from "store";

// project imports
import UserList from "./UserLists";
import MainCard from "ui-component/cards/MainCard";

const ChatTitleHistory = ({ setUser }) => {
    const theme = useTheme();
    const drawerBG = theme.palette.mode === "dark" ? "dark.main" : "grey.50";
    // eslint-disable-next-line no-unused-vars
    const [showChat, setShowChat] = useState(false);
    // const { userRoleDataSets, selectedDataset, userInstance } = useSelector((state) => state.userLogin);
    const { selectedDataset, userInstance } = useSelector((state) => state.userLogin);
    const firstLetter = userInstance ? userInstance.firstName.charAt(0).toUpperCase() : "U";
    const handleClick = () => {
        setShowChat(true);
    };

    return (
        <MainCard
            sx={{
                bgcolor: drawerBG,

                flexShrink: 0
            }}
            content={false}
        >
            <>
                <Grid item xs={12}>
                    <Card>
                        <CardContent
                            sx={{
                                bgcolor: drawerBG,
                                textAlign: "center"
                            }}
                        >
                            <Grid container spacing={1}>
                                <Grid item xs={12}>
                                    <Avatar
                                        sx={{
                                            m: "0 auto",
                                            width: 40,
                                            height: 40,
                                            border: "1px solid",
                                            borderColor: theme.palette.primary.main,
                                            p: 1,
                                            bgcolor: "transparent"
                                        }}
                                    >
                                        {firstLetter}
                                    </Avatar>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="h5" component="div">
                                        {userInstance ? (
                                            <>
                                                {userInstance.firstName} {userInstance.lastName}
                                            </>
                                        ) : (
                                            <></>
                                        )}{" "}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="body2" component="div">
                                        {selectedDataset ? (
                                            selectedDataset.rolename.charAt(0).toUpperCase() +
                                            selectedDataset.rolename.slice(1).toLowerCase()
                                        ) : (
                                            <></>
                                        )}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                <Box sx={{ p: 3, pb: 2 }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Button fullWidth variant="contained" onClick={handleClick}>
                                New Chat
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
                <PerfectScrollbar
                    style={{
                        overflowX: "hidden",
                        height: "calc(110vh - 440px)",
                        minHeight: 480,
                        maxHeight: 400
                    }}
                >
                    <Box sx={{ p: 2, pt: 0 }}>
                        <UserList setUser={setUser} />
                    </Box>
                </PerfectScrollbar>
            </>
        </MainCard>
    );
};
ChatTitleHistory.propTypes = {
    setUser: PropTypes.func
};

export default ChatTitleHistory;
