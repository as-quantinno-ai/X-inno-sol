import React, { useState, useEffect } from "react";
import { Grid, Typography, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import MainCard from "./cards/MainCard";
import { gridSpacing } from "store/constant";
import { useDispatch, useSelector } from "store";
import { openSnackbar } from "store/slices/snackbar";
import { useTheme } from "@mui/material/styles";
import { postUserRoleDataset, GetAccessToken } from "views/api-configuration/default";
// import { baseApi, selectBaseData } from "store/slices/initial-data";
import { baseApi } from "store/slices/initial-data";
import FormFooterButtons from "../FormButtons";
import api from "views/api-configuration/api";
import PropTypes from "prop-types";
const AssignAppRolesForm = ({ handleCloseDrawer }) => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const [emailsAddress, setemailsAddress] = useState("");
    const [roleName, setRoleName] = useState("");
    const { selectedDataset } = useSelector((state) => state.userLogin);
    const { appUsers } = useSelector((state) => state.userrole);
    const { assignapprole } = useSelector((state) => state.userrole);

    // const baseData = useSelector(selectBaseData);
    // const { roles } = baseData;

    const [formData, setFormData] = useState({
        emailAddress: "",
        productClientDatasetsId: selectedDataset.productclientdatasetsid,
        roleName: ""
    });
    const [fieldsNameError] = useState({
        emailAddress: false,
        productClientDatasetsId: false,
        roleName: false
    });

    useEffect(() => {
        const pcdRoleName = assignapprole && assignapprole.length > 0 ? assignapprole.map((item) => item.roleName) : [];
        setRoleName(pcdRoleName);

        const tenUsrEmailAd = appUsers && appUsers.length > 0 ? appUsers.map((item) => item.emailAddress) : [];
        setemailsAddress(tenUsrEmailAd);
    }, [selectedDataset]);

    const changeFieldValue = (e) => {
        const data = { ...formData };
        alert(e.target.value);
        data[e.target.name] = e.target.value;
        setFormData(data);
    };
    const submitForm = (e) => {
        e.preventDefault();

        api.post(postUserRoleDataset, formData, { headers: GetAccessToken() })
            .then(() => {
                handleCloseDrawer();
                dispatch(
                    openSnackbar({
                        open: true,
                        message: "Role Assigned Successfully",
                        variant: "alert",
                        alert: {
                            color: "success"
                        },
                        close: false
                    })
                );
                dispatch(baseApi());
            })
            .catch((response) => {
                handleCloseDrawer();
                dispatch(
                    openSnackbar({
                        open: true,
                        message: "Error Creating Assigned Role Record",
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
                                Assign Your App Roles
                            </Typography>
                        </Grid>
                    </Grid>
                }
                style={{ width: "100%", height: "fit-content" }}
            >
                <Grid container spacing={2} p={2}>
                    <Grid item xs={6} lg={6}>
                        <FormControl sx={{ m: 1, minWidth: 120, width: "100%" }}>
                            <InputLabel id="product-client-email-label">Select Email Address</InputLabel>
                            <Select
                                fullWidth
                                id="pcemail"
                                name="emailAddress"
                                // value={formData.emailAddress}
                                onChange={changeFieldValue}
                                variant="outlined"
                                labelId="product-client-email-label"
                                label="Select Email Address"
                            >
                                {emailsAddress.length > 0 ? (
                                    emailsAddress?.map((emailsAddress, indx1) => (
                                        <MenuItem key={indx1} value={emailsAddress}>
                                            {emailsAddress}
                                        </MenuItem>
                                    ))
                                ) : (
                                    <MenuItem value="" disabled>
                                        No Emails...
                                    </MenuItem>
                                )}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={6} lg={6}>
                        <FormControl sx={{ m: 1, minWidth: 120, width: "100%" }}>
                            <InputLabel id="product-client-dataset-rolename">Select Role Name</InputLabel>
                            <Select
                                fullWidth
                                id="pcrname"
                                name="roleName"
                                // value={formData.roleName}
                                onChange={changeFieldValue}
                                variant="outlined"
                                labelId="product-client-dataset-rolename"
                                label="Select Role Name"
                                error={fieldsNameError.roleName}
                            >
                                {roleName.length > 0 ? (
                                    roleName.map((roleName) => (
                                        <MenuItem key={roleName} value={roleName}>
                                            {roleName}
                                        </MenuItem>
                                    ))
                                ) : (
                                    <MenuItem value="" disabled>
                                        No Roles...
                                    </MenuItem>
                                )}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid container spacing={2} p={2}>
                        <Grid item xs={12} sm={6}>
                            <FormFooterButtons onSubmit={submitForm} onCancel={handleCloseDrawer} />
                        </Grid>
                    </Grid>
                </Grid>
            </MainCard>
        </Grid>
    );
};

AssignAppRolesForm.propTypes = {
    handleCloseDrawer: PropTypes.func
};
export default AssignAppRolesForm;
