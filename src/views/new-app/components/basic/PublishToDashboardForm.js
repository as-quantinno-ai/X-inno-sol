import React, { useState, useEffect } from "react";
import MainCard from "./cards/MainCard";
import PropTypes from "prop-types";
import { gridSpacing } from "store/constant";

import { Grid, Typography, Button, Select, MenuItem, InputLabel, FormControl } from "@mui/material";

import { useDispatch, useSelector } from "store";
import { openSnackbar } from "store/slices/snackbar";
import { useTheme } from "@mui/material/styles";

// API Config
import { createCustomDashboardComponentData, GetAccessToken, getCustomDashboard } from "views/api-configuration/default";

import SendIcon from "@mui/icons-material/Send";
import LayoutSelectionMatrix from "views/page-builder/LayoutSelectionMatrix";
import { baseApi } from "store/slices/initial-data";
import api from "views/api-configuration/api";

const PublishToDashboardForm = ({ functionname, referenceid, tableid, componentDisplayType }) => {
    const dispatch = useDispatch();
    const theme = useTheme();

    const { selectedDataset } = useSelector((state) => state.userLogin);

    const [dashboardScreens, setDashboardScreens] = useState(null);

    useEffect(() => {
        api.get(`${getCustomDashboard}${selectedDataset.productclientdatasetsid}`, { headers: GetAccessToken() }).then((res) =>
            setDashboardScreens(res.data.result)
        );
    }, []);

    // Selected Dashboard Screen & Layout
    const [ScreenId, setScreenId] = useState(0);
    const [LayoutId, setLayoutId] = useState(0);

    const onScreenChange = (e) => {
        setScreenId(e.target.value);
    };

    const onLayoutIdChange = (val) => {
        setLayoutId(val);
    };

    const [formData, setFormData] = useState({
        componentdataid: 0,
        productclientdatasetsid: selectedDataset.productclientdatasetsid,
        layoutid: LayoutId,
        componentDisplayType,
        functionname,
        referenceid,
        tableid,
        status: "active"
    });

    useEffect(() => {
        const data = { ...formData };
        data.layoutid = LayoutId;
        setFormData(data);
    }, [LayoutId]);

    const submitForm = (e) => {
        e.preventDefault();
        api.post(createCustomDashboardComponentData, formData, { headers: GetAccessToken() })
            .then(() => {
                dispatch(
                    openSnackbar({
                        open: true,
                        message: "Successfully Published to Dashboard",
                        variant: "alert",
                        alert: {
                            color: "success"
                        },
                        close: false
                    })
                );
                dispatch(baseApi());
                // dispatch(getAllCatalogs(catalogs));
            })
            .catch((response) => {
                dispatch(
                    openSnackbar({
                        open: true,
                        message: "Failed to Publish on Dashboard",
                        variant: "alert",
                        alert: {
                            color: "error"
                        },
                        close: false
                    })
                );
                return response;
            });
    };

    return (
        <Grid container spacing={0} alignItems="right" style={{ minHeight: "100vh" }}>
            <MainCard
                content={false}
                title={
                    <Grid container justifyContent="space-between" spacing={gridSpacing}>
                        <Grid item>
                            <Typography variant="h3" component="div" align="center" sx={{ color: theme.palette.primary.dark }}>
                                Publish To Dashboard
                            </Typography>
                        </Grid>
                    </Grid>
                }
                style={{ width: "100%", height: "fit-content" }}
            >
                <Grid container spacing={2} p={2}>
                    <Grid item xs={12} lg={12}>
                        <InputLabel>Select Screen</InputLabel>
                        {dashboardScreens ? (
                            <Select id="demo-simple-select" style={{ width: "100%" }} onChange={onScreenChange}>
                                {dashboardScreens.map((item, indx) => (
                                    <MenuItem key={indx} value={item.screenid}>
                                        {item.screentitle}
                                    </MenuItem>
                                ))}
                            </Select>
                        ) : (
                            <></>
                        )}
                        <InputLabel>Select Layout</InputLabel>
                    </Grid>

                    <Grid item xs={12} sm={12}>
                        {ScreenId ? <LayoutSelectionMatrix screenid={ScreenId} onLayoutIdChange={onLayoutIdChange} /> : <></>}
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        {" "}
                        <FormControl sx={{ m: 1, minWidth: 120, width: "100%" }}>
                            <Button type="submit" onClick={submitForm} variant="contained" endIcon={<SendIcon />}>
                                SUBMIT
                            </Button>
                        </FormControl>
                    </Grid>
                </Grid>
            </MainCard>
        </Grid>
    );
};

PublishToDashboardForm.propTypes = {
    functionname: PropTypes.string,
    referenceid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    tableid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    componentDisplayType: PropTypes.string
};

export default PublishToDashboardForm;
