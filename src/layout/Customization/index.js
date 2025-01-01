import React, { useState } from "react";

// material-ui
import { useTheme } from "@mui/material/styles";
// import { Drawer, Fab, Grid, IconButton, Tooltip, FormControlLabel, Radio, Box, Avatar } from "@mui/material";
import { Drawer, Grid, Box, Avatar } from "@mui/material";
import { IconSettings } from "@tabler/icons";

// third-party
import PerfectScrollbar from "react-perfect-scrollbar";

// project imports
import BorderRadius from "./BorderRadius";
import Layout from "./Layout";
import PresetColor from "./PresetColor";
import FontFamily from "./FontFamily";
import InputFilled from "./InputFilled";
import BoxContainer from "./BoxContainer";
// import AnimateButton from "ui-component/extended/AnimateButton";
import { gridSpacing } from "store/constant";

// Redux Imports
// import { useDispatch } from "store";
// import { useSelector } from "react-redux";
// import { configureApplicationMode } from "store/slices/app-dashboard";
// import { getSelectedDatasetSuccess } from "store/slices/user-login";
// import Avatar from '@mui/material/Avatar';
// import SubCard from "ui-component/cards/SubCard";

// ==============================|| LIVE CUSTOMIZATION ||============================== //

const Customization = () => {
    const theme = useTheme();
    // const dispatch = useDispatch();
    // const { applicationMode } = useSelector((state) => state.dashboard);
    // const { userRoleDataSets, selectedDataset, userInstance } = useSelector((state) => state.userLogin);

    // function onApplicationModeChange(val) {
    //     if (selectedDataset !== null && selectedDataset !== undefined)
    //         dispatch(configureApplicationMode(val, selectedDataset.userroledatasetid));
    // }

    // function onDatasetChange(datasetid) {
    //     dispatch(getSelectedDatasetSuccess(datasetid));
    // }

    // drawer on/off
    const [open, setOpen] = useState(false);
    const handleToggle = () => {
        setOpen(!open);
    };

    return (
        <>
            <Box
                sx={{
                    ml: 1,
                    [theme.breakpoints.down("md")]: {
                        ml: 1
                    }
                }}
            >
                {/* <Fab
                    component="div"
                    onClick={handleToggle}
                    size="medium"
                    variant="circular"
                    color="secondary"
                    // sx={{
                    //     borderRadius: 0,
                    //     borderTopLeftRadius: '50%',
                    //     borderBottomLeftRadius: '50%',
                    //     borderTopRightRadius: '50%',
                    //     borderBottomRightRadius: '4px',
                    //     top: '25%',
                    //     position: 'fixed',
                    //     right: 10,
                    //     zIndex: theme.zIndex.speedDial,
                    //     boxShadow: theme.customShadows.secondary
                    // }}
                >
                    </Fab> */}
                {/* <IconButton color="inherit" size="large" disableRipple>
                    </IconButton> */}
                {/* <AnimateButton type="rotate">
                    </AnimateButton> */}
                <Avatar
                    variant="rounded"
                    sx={{
                        ...theme.typography.commonAvatar,
                        ...theme.typography.mediumAvatar,
                        border: "1px solid",
                        borderColor: theme.palette.mode === "dark" ? theme.palette.dark.main : theme.palette.primary.light,
                        background: theme.palette.mode === "dark" ? theme.palette.dark.main : theme.palette.primary.light,
                        color: theme.palette.primary.dark,
                        transition: "all .2s ease-in-out",
                        // eslint-disable-next-line
                        '&[aria-controls="menu-list-grow"],&:hover': {
                            borderColor: theme.palette.primary.main,
                            background: theme.palette.primary.main,
                            color: theme.palette.primary.light
                        }
                    }}
                    onClick={handleToggle}
                    color="inherit"
                    style={{ width: "30px", height: "30px" }}
                >
                    <IconSettings stroke={1.5} size="1rem" />
                </Avatar>
            </Box>
            <Drawer
                anchor="right"
                onClose={handleToggle}
                open={open}
                PaperProps={{
                    sx: {
                        width: 280
                    }
                }}
            >
                {open && (
                    <PerfectScrollbar component="div">
                        <Grid container spacing={gridSpacing} sx={{ p: 3 }}>
                            <Grid item xs={12}>
                                <Layout />
                            </Grid>
                            <Grid item xs={12}>
                                <PresetColor />
                            </Grid>
                            <Grid item xs={12}>
                                <FontFamily />
                            </Grid>
                            <Grid item xs={12}>
                                <BorderRadius />
                            </Grid>
                            <Grid item xs={12}>
                                <InputFilled />
                            </Grid>
                            <Grid item xs={12}>
                                <BoxContainer />
                            </Grid>
                        </Grid>
                    </PerfectScrollbar>
                )}
            </Drawer>
        </>
    );
};

export default Customization;
