import TotalIncomeDarkCard from "../components/basic/TotalIncomeDarkCard";
import { Grid, Typography, Button, CircularProgress, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useSelector, useDispatch } from "store";
import React, { useState } from "react";
import { setUserSerRole } from "store/slices/authorization";
import { setSelectedDataset, setSelectedDatasetProceedClicked } from "store/slices/user-login";
import { useNavigate } from "react-router-dom";
import { getDatasetFilterConfig, getPublishMlModel, setChatbots } from "store/slices/app-globe";
import { refreshTokenUrl, GetRawRefreshToken, updateDatasetSelection, GetJWT } from "views/api-configuration/default";
import axios from "axios";
import { baseApi } from "store/slices/initial-data";
import { LOCAL_STORAGE_KEYS } from "constants/authFlow";
import api from "views/api-configuration/api";
// =============================|| LANDING - FEATURE PAGE ||============================= //

const setSession = (serviceToken) => {
    if (serviceToken) {
        localStorage.setItem(LOCAL_STORAGE_KEYS?.SERVICE_TOKEN, serviceToken.access_token);
        localStorage.setItem(LOCAL_STORAGE_KEYS?.SERVICE_REFRESH_TOKEN, serviceToken.refresh_token);
        axios.defaults.headers.common.Authorization = `Bearer ${serviceToken.access_token}`;
    } else {
        localStorage.removeItem(LOCAL_STORAGE_KEYS?.SERVICE_TOKEN);
        delete axios.defaults.headers.common.Authorization;
    }
};

const DatasetSelection = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const { userRoleDataSets } = useSelector((state) => state.userLogin);
    const [selectedDs, setSelectedDs] = useState(null);
    const [loadingError, setLoadingError] = useState(false);
    const loading = useSelector((state) => state?.initialdata?.baseApiLoading);
    const navigate = useNavigate();
    const handleProductClientDatasetChange = (ind) => {
        setLoadingError(true);
        setSelectedDs(ind);
        api.put(
            `${updateDatasetSelection}${userRoleDataSets[ind].userRoleDatasets.productclientdatasetsid}`,
            {},
            {
                headers: { Authorization: `Bearer ${GetJWT()}` }
            }
        )
            .then(() => {
                axios
                    .post(`${refreshTokenUrl}${GetRawRefreshToken()}`, {
                        headers: { "Content-Type": "application/json" }
                    })
                    .then((response) => {
                        setSession(response.data.result);
                        dispatch(setChatbots(userRoleDataSets[ind].userRoleDatasets.productclientdatasetsid));

                        dispatch(getDatasetFilterConfig(userRoleDataSets[ind].userRoleDatasets.productclientdatasetsid));
                        dispatch(getPublishMlModel(userRoleDataSets[ind].userRoleDatasets.productclientdatasetsid));
                        dispatch(baseApi());
                        setLoadingError(false);
                    })
                    .catch((err) => console.error(err));
            })
            .catch((error) => {
                console.error(error);
            });

        dispatch(setUserSerRole(userRoleDataSets[ind].userRoleDatasets.rolename));
        dispatch(setSelectedDataset(userRoleDataSets[ind].userRoleDatasets));
    };

    const navigateToApplication = () => {
        if (selectedDs !== null) {
            dispatch(setSelectedDatasetProceedClicked(true));
            navigate("/");
        }
    };
    return (
        <>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "end",
                    alignItems: "center",
                    height: "100vh"
                }}
                className="_dataset-container"
            >
                <Grid container width={600}>
                    <Grid item lg={12}>
                        <Typography color="secondary" variant="p" component="p" mb={3} sx={{ fontSize: "30px", fontWeight: "bold" }}>
                            SELECT YOUR DATASET
                        </Typography>
                    </Grid>
                    <Box className="_data-sets-grid" width="90%">
                        {userRoleDataSets?.map((dataset, ind) => (
                            <Box
                                key={ind}
                                sx={{ width: "100%" }}
                                role="button"
                                tabIndex={0}
                                className={`income-card ${selectedDs === ind ? "selected" : ""}`}
                                onClick={() => handleProductClientDatasetChange(ind)}
                                onKeyDown={(event) => {
                                    if (event.key === "Enter" || event.key === " ") {
                                        handleProductClientDatasetChange(ind);
                                    }
                                }}
                            >
                                <TotalIncomeDarkCard
                                    title={dataset.userRoleDatasets.productname}
                                    value={dataset.userRoleDatasets.datasetname}
                                    selectedDs={selectedDs}
                                    ind={ind}
                                />
                            </Box>
                        ))}
                    </Box>

                    <Grid item lg={10}>
                        <Button
                            style={{ margin: "12px auto" }}
                            variant="contained"
                            size="large"
                            disabled={loading || loadingError}
                            onClick={navigateToApplication}
                            color="secondary"
                            type="submit"
                            sx={{
                                zIndex: theme.zIndex.speedDial,
                                mt: 2,
                                maxWidth: "330px",
                                width: "100%",
                                "&.Mui-disabled": {
                                    background: "grey",
                                    color: "white"
                                }
                            }}
                        >
                            {loading || loadingError ? (
                                <Box display="flex" alignItems="center" gap="5px">
                                    <Box>Proceed</Box>
                                    <Box marginTop="5px">
                                        <CircularProgress size={14} color="inherit" />
                                    </Box>
                                </Box>
                            ) : (
                                "Proceed"
                            )}
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
};

export default DatasetSelection;
