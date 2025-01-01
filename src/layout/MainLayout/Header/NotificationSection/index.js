import React, { useEffect, useRef, useState } from "react";
// import { Link } from "react-router-dom";

// material-ui
import { useTheme } from "@mui/material/styles";
import {
    Avatar,
    Box,
    // Button,
    // CardActions,
    // Chip,
    ClickAwayListener,
    // Divider,
    Grid,
    Paper,
    Popper,
    // Stack,
    // TextField,
    // Typography,
    useMediaQuery
} from "@mui/material";

// third-party
// import PerfectScrollbar from "react-perfect-scrollbar";

// project imports
import MainCard from "ui-component/cards/MainCard";
import Transitions from "ui-component/extended/Transitions";
// import NotificationList from "./NotificationList";
// import IncomingRequests from "views/new-app/components/basic/IncomingRequests";

// assets
import { IconBell } from "@tabler/icons";
// import { updateJobs } from "store/slices/app-jobs";
// import { useDispatch } from "store";
// import { useSelector } from "react-redux";

// notification status options
// const status = [
//     {
//         value: "all",
//         label: "All Notification"
//     },
//     {
//         value: "new",
//         label: "New"
//     },
//     {
//         value: "unread",
//         label: "Unread"
//     },
//     {
//         value: "other",
//         label: "Other"
//     }
// ];

// ==============================|| NOTIFICATION ||============================== //

const NotificationSection = () => {
    const theme = useTheme();
    const matchesXs = useMediaQuery(theme.breakpoints.down("md"));

    const [open, setOpen] = useState(false);
    // const [value, setValue] = useState("");
    // const dispatch = useDispatch();
    // const { jobList } = useSelector((state) => state.jobs);
    // console.log('jobList', jobList);
    // const { selectedDataset } = useSelector((state) => state.userLogin);
    /**
     * anchorRef is used on different componets and specifying one type leads to other components throwing an error
     * */
    const anchorRef = useRef(null);

    // useEffect(() => {
    //     console.log('selectedDataset ', selectedDataset);
    //     if (selectedDataset) dispatch(updateJobs(selectedDataset.userroledatasetid));
    // }, [selectedDataset]);

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpen(false);
    };

    const prevOpen = useRef(open);
    useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus();
        }
        prevOpen.current = open;
    }, [open]);

    // const handleChange = (event) => setValue(event?.target.value);

    return (
        <>
            <Box
                sx={{
                    ml: 1,
                    mr: 1,
                    [theme.breakpoints.down("md")]: {
                        ml: 1,
                        mr: 1
                    }
                }}
            >
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
                    ref={anchorRef}
                    aria-controls={open ? "menu-list-grow" : undefined}
                    aria-haspopup="true"
                    onClick={handleToggle}
                    color="inherit"
                    style={{ width: "30px", height: "30px" }}
                >
                    <IconBell stroke={1.5} size="1rem" />
                </Avatar>
            </Box>

            <Popper
                placement={matchesXs ? "bottom" : "bottom-end"}
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
                popperOptions={{
                    modifiers: [
                        {
                            name: "offset",
                            options: {
                                offset: [matchesXs ? 5 : 0, 20]
                            }
                        }
                    ]
                }}
            >
                {({ TransitionProps }) => (
                    <ClickAwayListener onClickAway={handleClose}>
                        <Transitions position={matchesXs ? "top" : "top-right"} in={open} {...TransitionProps}>
                            <Paper>
                                {open && (
                                    <MainCard
                                        title="Jobs In Queue"
                                        border={false}
                                        elevation={16}
                                        content={false}
                                        boxShadow
                                        shadow={theme.shadows[16]}
                                    >
                                        <Grid container direction="column" spacing={2}>
                                            <Grid item xs={12}>
                                                <Grid container alignItems="center" justifyContent="space-between" sx={{ pt: 2, px: 2 }}>
                                                    <Grid item>{/* <IncomingRequests data={jobList} /> */}</Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </MainCard>
                                )}
                            </Paper>
                        </Transitions>
                    </ClickAwayListener>
                )}
            </Popper>
        </>
    );
};

export default NotificationSection;
