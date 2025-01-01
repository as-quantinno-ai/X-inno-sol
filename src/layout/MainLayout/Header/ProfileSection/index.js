import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "views/api-configuration/api";
import { useTheme } from "@mui/material/styles";
import {
    Avatar,
    Box,
    Card,
    CardContent,
    Chip,
    ClickAwayListener,
    Grid,
    Paper,
    Popper,
    Switch,
    Typography,
    RadioGroup,
    FormControlLabel,
    Radio,
    IconButton
} from "@mui/material";

// third-party
import PerfectScrollbar from "react-perfect-scrollbar";
import LogoutIcon from "@mui/icons-material/Logout";
import MainCard from "ui-component/cards/MainCard";
import Transitions from "ui-component/extended/Transitions";
// import { persister, store, useSelector, useDispatch } from "store";
import { persister, useSelector, useDispatch } from "store";
import { updateAppConfigRec, GetAccessToken, logoutUrl } from "views/api-configuration/default";
// assets
import { IconSettings } from "@tabler/icons";
// import useConfig from "hooks/useConfig";
import MenuCard from "layout/MainLayout/Sidebar/MenuCard";
import { openSnackbar } from "store/slices/snackbar";
import { getDatasetFilterConfig } from "store/slices/app-globe";
import RoleBasedHOC from "authorization-hocs/RoleBasedHOC";
import { resetStateAction } from "store/actions";

// ==============================|| PROFILE MENU ||============================== //

const ProfileSection = () => {
    const theme = useTheme();
    // const { borderRadius } = useConfig();
    const navigate = useNavigate();

    const dispatch = useDispatch();
    const { datasetFiltersConfig } = useSelector((state) => state.globe);
    const [notification, setNotification] = useState(false);
    // eslint-disable-next-line no-unused-vars
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [open, setOpen] = useState(false);
    // const { selectedDataset, userInstance, selectedDatasetProceedClicked } = useSelector((state) => state.userLogin);
    const { selectedDataset, userInstance } = useSelector((state) => state.userLogin);

    /**
     * anchorRef is used on different components and specifying one type leads to other components throwing an error
     * */
    const anchorRef = useRef(null);
    const changeConfiguration = (e) => {
        api.put(
            updateAppConfigRec,
            {
                productclientdatasetsid: selectedDataset.productclientdatasetsid,
                referenceId: null,
                tableId: null,
                type: e.target.value
            },
            { headers: GetAccessToken() }
        )
            // eslint-disable-next-line no-unused-vars
            .then((res) => {
                dispatch(getDatasetFilterConfig(selectedDataset.productclientdatasetsid));
                dispatch(
                    openSnackbar({
                        open: true,
                        message: "Filter Configuration Updated Successfully",
                        variant: "alert",
                        alert: {
                            color: "success"
                        },
                        close: false
                    })
                );
            })
            // eslint-disable-next-line no-unused-vars
            .catch((err) => {
                dispatch(
                    openSnackbar({
                        open: true,
                        message: "Error Updating Filter Configuration",
                        variant: "alert",
                        alert: {
                            color: "error"
                        },
                        close: false
                    })
                );
            });
    };

    const handleLogout = async () => {
        try {
            const refreshToken = localStorage.getItem("serviceRefreshToken");
            await api.post(`${logoutUrl}${refreshToken}`);
            localStorage.clear();
            navigate("/login");
        } catch (err) {
            console.error(err);
        } finally {
            localStorage.clear();
            dispatch(resetStateAction());
            persister.pause();
            persister.flush().then(() => persister.purge());
        }
    };

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpen(false);
    };
    // const handleListItemClick = (event, index, route = "") => {
    //     setSelectedIndex(index);
    //     handleClose(event);

    //     if (route && route !== "") {
    //         navigate(route);
    //     }
    // };
    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const prevOpen = useRef(open);
    useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus();
        }

        prevOpen.current = open;
    }, [open]);

    return (
        <>
            <Chip
                sx={{
                    height: "36px",
                    alignItems: "center",
                    borderRadius: "27px",
                    transition: "all .2s ease-in-out",
                    borderColor: theme.palette.mode === "dark" ? theme.palette.dark.main : theme.palette.primary.light,
                    backgroundColor: theme.palette.mode === "dark" ? theme.palette.dark.main : theme.palette.primary.light,
                    // eslint-disable-next-line quotes
                    '&[aria-controls="menu-list-grow"], &:hover': {
                        borderColor: theme.palette.primary.main,
                        background: `${theme.palette.primary.main}!important`,
                        color: theme.palette.primary.light,
                        "& svg": {
                            stroke: theme.palette.primary.light
                        }
                    },
                    "& .MuiChip-label": {
                        lineHeight: 0
                    }
                }}
                icon={
                    <Avatar
                        ref={anchorRef}
                        aria-controls={open ? "menu-list-grow" : undefined}
                        aria-haspopup="true"
                        color="inherit"
                        style={{
                            height: "24px",
                            width: "24px",
                            fontSize: 12
                        }}
                    >
                        {userInstance ? userInstance.firstName[0].toUpperCase() : <></>}
                    </Avatar>
                }
                label={<IconSettings stroke={1} size="1rem" color={theme.palette.primary.main} stlye={{ marginRight: "-10px" }} />}
                variant="outlined"
                ref={anchorRef}
                aria-controls={open ? "menu-list-grow" : undefined}
                aria-haspopup="true"
                onClick={handleToggle}
                color="primary"
            />

            <Popper
                placement="bottom"
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
                                offset: [0, 14]
                            }
                        }
                    ]
                }}
            >
                {({ TransitionProps }) => (
                    <ClickAwayListener onClickAway={handleClose}>
                        <Transitions in={open} {...TransitionProps}>
                            <Paper>
                                {open && (
                                    <MainCard border={false} elevation={16} content={false} boxShadow shadow={theme.shadows[16]}>
                                        <PerfectScrollbar style={{ height: "100%", maxHeight: "calc(100vh - 250px)", overflowX: "hidden" }}>
                                            <Box sx={{ p: 2, pt: 0 }}>
                                                <Card
                                                    sx={{
                                                        bgcolor:
                                                            theme.palette.mode === "dark"
                                                                ? theme.palette.dark[800]
                                                                : theme.palette.primary.light,
                                                        my: 2
                                                    }}
                                                >
                                                    <CardContent>
                                                        <Grid container spacing={3} direction="column">
                                                            <Grid item>
                                                                <Grid item container alignItems="center" justifyContent="space-between">
                                                                    <Grid item sm={12} md={4} lg={4}>
                                                                        <Typography variant="subtitle1">Welcome Back</Typography>
                                                                    </Grid>
                                                                    <Grid item sm={12} md={6} lg={6}>
                                                                        <Typography variant="subtitle1">
                                                                            {selectedDataset ? <>{selectedDataset.emailaddress}</> : <></>}
                                                                        </Typography>
                                                                    </Grid>
                                                                    <Grid item sm={12} md={2} lg={2}>
                                                                        <IconButton
                                                                            size="small"
                                                                            sx={{
                                                                                mt: -0.75,
                                                                                mr: -0.75,
                                                                                flexDirection: "flex-end"
                                                                            }}
                                                                            onClick={handleLogout}
                                                                        >
                                                                            <LogoutIcon
                                                                                style={{
                                                                                    verticalAlign: "middle",
                                                                                    color: theme.palette.primary.dark
                                                                                }}
                                                                                fontSize="small"
                                                                                aria-controls="menu-friend-card"
                                                                                aria-haspopup="true"
                                                                                sx={{ opacity: 0.6 }}
                                                                            />
                                                                            <Typography variant="subtitle1"> Logout</Typography>
                                                                        </IconButton>
                                                                    </Grid>
                                                                    <Grid item sm={12} md={4} lg={4}>
                                                                        <Typography variant="subtitle1">Your Role</Typography>
                                                                    </Grid>
                                                                    <Grid item sm={12} md={8} lg={8}>
                                                                        <Typography variant="subtitle1">
                                                                            {selectedDataset ? selectedDataset.rolename : <></>}
                                                                        </Typography>
                                                                    </Grid>
                                                                    <Grid item sm={12} md={4} lg={4}>
                                                                        <Typography variant="subtitle1">Selected Dataset</Typography>
                                                                    </Grid>
                                                                    <Grid item sm={12} md={8} lg={8}>
                                                                        <Typography variant="subtitle1">
                                                                            {selectedDataset ? selectedDataset.datasetname : <></>}
                                                                        </Typography>
                                                                    </Grid>
                                                                </Grid>
                                                            </Grid>
                                                            <Grid item>
                                                                <Grid item container alignItems="center" justifyContent="space-between">
                                                                    <Grid item>
                                                                        <Typography variant="subtitle1">Allow Notifications</Typography>
                                                                    </Grid>
                                                                    <Grid item>
                                                                        <Switch
                                                                            checked={notification}
                                                                            onChange={(e) => setNotification(e.target.checked)}
                                                                            name="sdm"
                                                                            size="small"
                                                                        />
                                                                    </Grid>
                                                                </Grid>
                                                            </Grid>
                                                            <RoleBasedHOC allowedRoles={["TENANT_ADMIN"]}>
                                                                <Grid item>
                                                                    <Grid item container alignItems="center" justifyContent="space-between">
                                                                        <Grid item>
                                                                            <Typography variant="subtitle1">
                                                                                Filter Configuration
                                                                            </Typography>
                                                                        </Grid>
                                                                        <Grid item>
                                                                            <RadioGroup
                                                                                row
                                                                                aria-labelledby="filter-selection-group-label"
                                                                                name="filter-selection"
                                                                                defaultValue={
                                                                                    datasetFiltersConfig && datasetFiltersConfig?.type
                                                                                }
                                                                                onChange={changeConfiguration}
                                                                            >
                                                                                <FormControlLabel
                                                                                    value="QUERY_FILTER"
                                                                                    control={<Radio />}
                                                                                    label="Query Based"
                                                                                />
                                                                                <FormControlLabel
                                                                                    value="STREAMING_FILTER"
                                                                                    control={<Radio />}
                                                                                    label="Streaming Based"
                                                                                />
                                                                            </RadioGroup>
                                                                        </Grid>
                                                                    </Grid>
                                                                </Grid>
                                                            </RoleBasedHOC>
                                                        </Grid>
                                                    </CardContent>
                                                </Card>
                                                <MenuCard />
                                            </Box>
                                        </PerfectScrollbar>
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

export default ProfileSection;
