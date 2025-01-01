import PropTypes from "prop-types";
import React, { memo, useEffect, useState } from "react";

// material-ui
import { styled, useTheme } from "@mui/material/styles";
import {
    // Avatar,
    Card,
    CardContent,
    Grid,
    LinearProgress,
    List,
    ListItem,
    ListItemText,
    Typography,
    linearProgressClasses,
    FormControlLabel,
    RadioGroup,
    Radio,
    Box,
    CircularProgress
} from "@mui/material";
// import { getDatasetFilterConfig, setForms, setScreens, getPublishMlModel, setChatbots } from "store/slices/app-globe";
import { getDatasetFilterConfig, getPublishMlModel, setChatbots } from "store/slices/app-globe";
// import { setAssignedResRoles } from "store/slices/assignresrole";
// import { getRoleAddPermission } from "store/slices/roleaddpermission";
import {
    refreshTokenUrl,
    // GetAccessToken,
    GetRawRefreshToken,
    // getResourcePermissions,
    updateDatasetSelection,
    GetJWT
    // getAppPermissions,
    // getInitialData
} from "views/api-configuration/default";
import axios from "axios";
import {
    // getDashboardHeader,
    // getDashboardTable,
    // getDashboardVisual,
    // getDashboardRawVisualList,
    // getDashboardFeatureVisualList,
    configureApplicationMode
} from "store/slices/app-dashboard";
// import { setUserSerRole, setUserPerms } from "store/slices/authorization";
import { setUserSerRole } from "store/slices/authorization";

// assets
// import TableChartOutlinedIcon from "@mui/icons-material/TableChartOutlined";
import { useDispatch, useSelector } from "store";
// import { getSelectedDatasetSuccess, getUserRoleDataSets, setSelectedDataset } from "store/slices/user-login";
import { getUserRoleDataSets, setSelectedDataset } from "store/slices/user-login";
// import { getAllCatalogs, resetApDashBoardRawShaState } from "store/slices/AppDashboardRawSha";
import { resetApDashBoardRawShaState } from "store/slices/AppDashboardRawSha";
import RoleBasedHOC from "authorization-hocs/RoleBasedHOC";
import { baseApi } from "store/slices/initial-data";
import api from "views/api-configuration/api";
// import { resetmlModelRawState } from "store/slices/MlModelsRawSha";

import { resetState } from "store/slices/tables-user-selected-val";

// styles
const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 10,
    borderRadius: 30,
    [`&.${linearProgressClasses.colorPrimary}`]: {
        backgroundColor: theme.palette.mode === "dark" ? theme.palette.dark.light : "#fff"
    },
    [`& .${linearProgressClasses.bar}`]: {
        borderRadius: 5,
        backgroundColor: theme.palette.mode === "dark" ? theme.palette.primary.dark : theme.palette.primary.main
    }
}));
const setSession = (serviceToken) => {
    if (serviceToken) {
        localStorage.setItem("serviceToken", serviceToken.access_token);
        localStorage.setItem("serviceRefreshToken", serviceToken.refresh_token);
        axios.defaults.headers.common.Authorization = `Bearer ${serviceToken}`;
    } else {
        localStorage.removeItem("serviceToken");
        delete axios.defaults.headers.common.Authorization;
    }
};
const CardStyle = styled(Card)(({ theme }) => ({
    background: theme.palette.mode === "dark" ? theme.palette.dark.main : theme.palette.primary.light,
    marginBottom: "22px",
    overflow: "hidden",
    position: "relative",
    "&:after": {
        content: "",
        position: "absolute",
        width: "157px",
        height: "157px",
        background: theme.palette.mode === "dark" ? theme.palette.dark.dark : theme.palette.primary[200],
        borderRadius: "50%",
        top: "-105px",
        right: "-96px"
    }
}));

// ==============================|| PROGRESS BAR WITH LABEL ||============================== //

function LinearProgressWithLabel({ value, ...others }) {
    const theme = useTheme();

    return (
        <Grid container direction="column" spacing={1} sx={{ mt: 1.5 }}>
            <Grid item>
                <Grid container justifyContent="space-between">
                    <Grid item>
                        <Typography
                            variant="h6"
                            sx={{ color: theme.palette.mode === "dark" ? theme.palette.dark.light : theme.palette.primary[800] }}
                        >
                            Progress
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant="h6" color="inherit">{`${Math.round(value)}%`}</Typography>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item>
                <BorderLinearProgress variant="determinate" value={value} {...others} />
            </Grid>
        </Grid>
    );
}

LinearProgressWithLabel.propTypes = {
    value: PropTypes.number
};

// ==============================|| SIDEBAR - MENU CARD ||============================== //

const MenuCard = () => {
    const theme = useTheme();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getUserRoleDataSets());
    }, []);

    // const { applicationMode } = useSelector((state) => state.dashboard);
    // const { userRoleDataSets, selectedDataset, userInstance } = useSelector((state) => state.userLogin);
    const { userRoleDataSets, selectedDataset } = useSelector((state) => state.userLogin);
    // const { chatbots } = useSelector((state) => state.globe);

    const [localSelectedValue, setLocalSelectedValue] = useState(
        userRoleDataSets.findIndex((item) => item.userRoleDatasets.productclientdatasetsid === selectedDataset.productclientdatasetsid)
    );
    const [loadingIndex, setLoadingIndex] = useState(null);

    async function onDatasetChange(ind) {
        if (loadingIndex !== null) {
            return;
        }
        try {
            setLoadingIndex(ind);
            setLocalSelectedValue(ind);

            const userRoleDataSet = userRoleDataSets[ind].userRoleDatasets;
            const userRoleDataSetsId = userRoleDataSet.productclientdatasetsid;
            await api.put(
                `${updateDatasetSelection}${userRoleDataSetsId}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${GetJWT()}`
                    }
                }
            );
            await axios
                .post(`${refreshTokenUrl}${GetRawRefreshToken()}`, {
                    headers: { "Content-Type": "application/json" }
                })
                .then((response) => {
                    setSession(response.data.result);
                });

            await dispatch(setUserSerRole(userRoleDataSet.rolename));
            await dispatch(getPublishMlModel(userRoleDataSetsId));
            await dispatch(setChatbots(userRoleDataSetsId));
            await dispatch(setSelectedDataset(userRoleDataSet));
            await dispatch(baseApi());

            await dispatch(getDatasetFilterConfig(userRoleDataSetsId));

            const currentDomain = window.location.origin;
            window.location.href = `${currentDomain}/`;
        } catch (err) {
            console.log(err);
        } finally {
            setLoadingIndex(null);
            dispatch(resetApDashBoardRawShaState());
            dispatch(resetState());
        }
    }

    function onApplicationModeChange(val) {
        if (selectedDataset !== null && selectedDataset !== undefined)
            // *** here instead of userroledatasetid we have to pass datasetid
            // dispatch(configureApplicationMode(val, selectedDataset.userroledatasetid));
            // *** this needs to be fix in API Layer also
            dispatch(configureApplicationMode(val, selectedDataset.datasetid));
    }

    return (
        <CardStyle>
            <CardContent sx={{ p: 2 }}>
                {selectedDataset ? (
                    <>
                        <RoleBasedHOC allowedRoles={["TENANT_ADMIN", "USER@TR"]}>
                            <List sx={{ p: 0, m: 0 }}>
                                <ListItem alignItems="flex-start" disableGutters sx={{ p: 0 }}>
                                    <ListItemText
                                        sx={{ mt: 0 }}
                                        primary={
                                            <Typography
                                                variant="subtitle1"
                                                sx={{
                                                    color:
                                                        theme.palette.mode === "dark"
                                                            ? theme.palette.dark.light
                                                            : theme.palette.primary[800]
                                                }}
                                            >
                                                Select Application Mode
                                            </Typography>
                                        }
                                    />
                                </ListItem>
                            </List>
                            <>
                                <RadioGroup
                                    row
                                    aria-label="layout"
                                    // value={navType}
                                    onChange={(e) => onApplicationModeChange(e.target.value)}
                                    name="row-radio-buttons-group"
                                >
                                    <FormControlLabel
                                        value="STOPPED"
                                        control={<Radio />}
                                        label="Live Mode"
                                        sx={{
                                            "& .MuiSvgIcon-root": { fontSize: 16 },
                                            "& .MuiFormControlLabel-label": {
                                                color: theme.palette.mode === "dark" ? theme.palette.dark.light : theme.palette.primary[800]
                                            }
                                        }}
                                    />
                                    <FormControlLabel
                                        value="SUBMITTED"
                                        control={<Radio />}
                                        label="Configure Mode"
                                        sx={{
                                            "& .MuiSvgIcon-root": { fontSize: 16 },
                                            "& .MuiFormControlLabel-label": {
                                                color: theme.palette.mode === "dark" ? theme.palette.dark.light : theme.palette.primary[800]
                                            }
                                        }}
                                    />
                                </RadioGroup>
                            </>
                        </RoleBasedHOC>
                    </>
                ) : (
                    <></>
                )}
                <List sx={{ p: 0, m: 0 }}>
                    <ListItem alignItems="flex-start" disableGutters sx={{ p: 0 }}>
                        <ListItemText
                            sx={{ mt: 0 }}
                            primary={
                                <Typography
                                    variant="subtitle1"
                                    sx={{ color: theme.palette.mode === "dark" ? theme.palette.dark.light : theme.palette.primary[800] }}
                                >
                                    Select Dataset
                                </Typography>
                            }
                        />
                    </ListItem>
                </List>
                <RadioGroup
                    row
                    aria-label="layout"
                    // value={navType}
                    value={localSelectedValue}
                    onChange={(e) => onDatasetChange(e.target.value)}
                    name="column-radio-buttons-group"
                    style={{ display: "block" }}
                >
                    {userRoleDataSets !== null ? (
                        userRoleDataSets.map((item, ind) => (
                            <Box key={ind} style={{ display: "block" }}>
                                <FormControlLabel
                                    value={ind}
                                    control={<Radio />}
                                    disabled={loadingIndex !== null && loadingIndex !== ind.toString()}
                                    label={
                                        <Box display="flex" alignItems="center">
                                            {item.userRoleDatasets.datasetname}
                                            {loadingIndex === ind.toString() && <CircularProgress size={16} style={{ marginLeft: 8 }} />}
                                        </Box>
                                    }
                                    sx={{
                                        "& .MuiSvgIcon-root": { fontSize: 16 },
                                        "& .MuiFormControlLabel-label": {
                                            color: theme.palette.mode === "dark" ? theme.palette.dark.light : theme.palette.primary[800]
                                        }
                                    }}
                                />
                            </Box>
                        ))
                    ) : (
                        <></>
                    )}
                </RadioGroup>
            </CardContent>
        </CardStyle>
    );
};

export default memo(MenuCard);
