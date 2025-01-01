import React, { useState } from "react";
import MainCard from "./cards/MainCard";
import { gridSpacing } from "store/constant";
import { Grid, TextField, Typography, FormControl } from "@mui/material";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
// project imports
import { useDispatch } from "store";
import { openSnackbar } from "store/slices/snackbar";
import { useTheme } from "@mui/material/styles";

// API Config
import { postResRole, GetAccessToken } from "views/api-configuration/default";
import { baseApi } from "store/slices/initial-data";
import FormFooterButtons from "../FormButtons";
import api from "views/api-configuration/api";

const RolesForm = ({ handleCloseDrawer }) => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const { selectedDataset } = useSelector((state) => state.userLogin);
    const [formData, setFormData] = useState({
        productclientdatasetsid: selectedDataset.productclientdatasetsid,
        roleDescription: "",
        roleName: ""
    });

    const [fieldsNameError, setFieldsNameError] = useState({
        productclientdatasetsid: false,
        roleName: false,
        roleDescription: false
    });

    const changeFieldValue = (e) => {
        const data = { ...formData };
        data[e.target.name] = e.target.value;
        setFormData(data);
        setFieldsNameError((prevErrors) => ({
            ...prevErrors,
            [e.target.name]: false
        }));
    };

    const submitForm = (e) => {
        e.preventDefault();

        const hasErrors = {};
        if (formData.productclientdatasetsid === 0) {
            hasErrors.productclientdatasetsid = true;
        }
        if (formData.roleName.trim() === "") {
            hasErrors.roleName = true;
        }
        if (formData.roleDescription.trim() === "") {
            hasErrors.roleDescription = true;
        }

        if (Object.keys(hasErrors).length > 0) {
            setFieldsNameError(hasErrors);
            return;
        }

        const modifiedFormData = {
            ...formData,
            roleName: formData.roleName.toUpperCase().replace(/\s+/g, "")
        };

        api.post(postResRole, modifiedFormData, { headers: GetAccessToken() })
            .then(() => {
                dispatch(
                    openSnackbar({
                        open: true,
                        message: "Roles Created Successfully",
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
                dispatch(
                    openSnackbar({
                        open: true,
                        message: "Error Creating Roles Record",
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
                                Add Your Roles
                            </Typography>
                        </Grid>
                    </Grid>
                }
                style={{ width: "100%", height: "fit-content" }}
            >
                <Grid container spacing={2} p={2}>
                    <Grid item xs={6} lg={6}>
                        <FormControl sx={{ m: 1, minWidth: 120, width: "100%" }}>
                            <TextField
                                fullWidth
                                id="rn"
                                name="roleName"
                                label="Role Name"
                                onChange={changeFieldValue}
                                variant="outlined"
                                error={fieldsNameError.roleName}
                            />
                            {/* do not remove below commented code */}

                            {/* {fieldsNameError.roleName && (
                                <Typography variant="caption" color="error">
                                    Please enter a Role Name.
                                </Typography>
                            )} */}
                        </FormControl>
                    </Grid>
                    <Grid item xs={6} lg={6}>
                        <FormControl sx={{ m: 1, minWidth: 120, width: "100%" }}>
                            <TextField
                                fullWidth
                                id="rdes"
                                name="roleDescription"
                                label="Role Description"
                                onChange={changeFieldValue}
                                variant="outlined"
                                error={fieldsNameError.roleDescription}
                            />
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

RolesForm.propTypes = {
    handleCloseDrawer: PropTypes.func
};

export default RolesForm;
