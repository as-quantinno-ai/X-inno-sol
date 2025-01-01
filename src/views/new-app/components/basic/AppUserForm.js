import React, { useState } from "react";
import { Grid, TextField, Typography, FormControl, Checkbox } from "@mui/material";
import MainCard from "./cards/MainCard";
import { gridSpacing } from "store/constant";
import { useDispatch, useSelector } from "react-redux";
import { openSnackbar } from "store/slices/snackbar";
import { useTheme } from "@mui/material/styles";
import { postApplicationUser, GetAccessToken } from "views/api-configuration/default";
import FormFooterButtons from "../FormButtons";
// import { baseApi, selectBaseData } from "store/slices/initial-data";
import { baseApi } from "store/slices/initial-data";
import { UserFormFields } from "constants/generic";
import api from "views/api-configuration/api";
import PropTypes from "prop-types";
const ApplicationUserForm = ({ handleCloseDrawer }) => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const { selectedDataset } = useSelector((state) => state.userLogin);
    // const baseData = useSelector(selectBaseData);
    // const { userApp, catalogs } = baseData;

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
    const [fieldsNameError, setFieldsNameError] = useState({});

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const changeFieldValue = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
        setFieldsNameError((prevErrors) => ({ ...prevErrors, [name]: false }));
    };

    const submitForm = (e) => {
        e.preventDefault();

        api.post(postApplicationUser, formData, { headers: GetAccessToken() })
            .then(() => {
                handleCloseDrawer();
                dispatch(
                    openSnackbar({
                        open: true,
                        message: "Application User Created Successfully",
                        variant: "alert",
                        alert: { color: "success" },
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
                        message: "Error Creating Application User",
                        variant: "alert",
                        alert: { color: "error" },
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
                                Add Your Application User
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
                                    error={fieldsNameError[field.id]}
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
                                error={fieldsNameError.pwd}
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
                            <FormFooterButtons onSubmit={submitForm} onCancel={handleCloseDrawer} />
                        </Grid>
                    </Grid>
                </Grid>
            </MainCard>
        </Grid>
    );
};

ApplicationUserForm.propTypes = {
    handleCloseDrawer: PropTypes.func 
};
export default ApplicationUserForm;
