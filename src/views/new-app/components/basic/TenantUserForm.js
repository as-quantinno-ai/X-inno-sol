import React, { useState } from "react";
import MainCard from "./cards/MainCard";
import { gridSpacing } from "store/constant";
import { Grid, TextField, Typography, FormControl, Checkbox } from "@mui/material";
import PropTypes from "prop-types";
// project imports
import { useDispatch, useSelector } from "store";
import { openSnackbar } from "store/slices/snackbar";
import { useTheme } from "@mui/material/styles";

// API Config
import { postTenantUser, GetAccessToken } from "views/api-configuration/default";

// import { selectBaseData, baseApi } from "store/slices/initial-data";
import { baseApi } from "store/slices/initial-data";
import FormFooterButtons from "../FormButtons";
import { UserFormFields } from "constants/generic";
import api from "views/api-configuration/api";

const TenantUserForm = ({ handleCloseDrawer }) => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const { selectedDataset } = useSelector((state) => state.userLogin);
    // const baseData = useSelector(selectBaseData);
    // const { userTr, catalogs } = baseData;

    const [formData, setFormData] = useState({
        companyName: "",
        emailAddress: "",
        firstName: "",
        lastName: "",
        phone: "",
        productclientid: selectedDataset.productclientid,
        pwd: ""
    });
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const changeFieldValue = (e) => {
        const data = { ...formData };
        data[e.target.name] = e.target.value;
        setFormData(data);
    };

    const submitForm = (e) => {
        e.preventDefault();

        api.post(postTenantUser, formData, { headers: GetAccessToken() })

            .then(() => {
                handleCloseDrawer();
                dispatch(
                    openSnackbar({
                        open: true,
                        message: "Tenant User Created Successfully",
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
                        message: "Error Creating Tenant User",
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
                                Add Your Tenant User
                            </Typography>
                        </Grid>
                    </Grid>
                }
                style={{ width: "100%", height: "fit-content" }}
            >
                <Grid container spacing={2} p={2}>
                    {UserFormFields.map((field) => (
                        <Grid item xs={6} lg={6} key={field.id}>
                            <FormControl sx={{ m: 1, minWidth: 120, width: "100%" }}>
                                <TextField
                                    fullWidth
                                    id={field.id}
                                    name={field.id}
                                    label={field.label}
                                    onChange={changeFieldValue}
                                    variant="outlined"
                                    value={formData[field.id]}
                                />
                            </FormControl>
                        </Grid>
                    ))}
                    <Grid item xs={6} lg={6}>
                        <FormControl sx={{ m: 1, minWidth: 120, width: "100%" }}>
                            <TextField
                                fullWidth
                                id="pwd"
                                name="pwd"
                                label="Password"
                                onChange={changeFieldValue}
                                type={showPassword ? "text" : "password"}
                                variant="outlined"
                                value={formData.pwd}
                                InputProps={{
                                    endAdornment: (
                                        <div style={{ display: "flex", alignItems: "center" }}>
                                            <Checkbox checked={showPassword} onChange={togglePasswordVisibility} />
                                        </div>
                                    )
                                }}
                            />
                        </FormControl>
                    </Grid>

                    <Grid container spacing={2} p={2}>
                        <Grid item xs={12} sm={6}>
                            <FormFooterButtons
                                onSubmit={(e) => {
                                    submitForm(e);
                                }}
                                onCancel={handleCloseDrawer}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </MainCard>
        </Grid>
    );
};

TenantUserForm.propTypes = {
    handleCloseDrawer: PropTypes.func
};

export default TenantUserForm;
