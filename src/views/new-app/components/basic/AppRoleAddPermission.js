import { GetAccessToken, putUpdateAppPerm } from "views/api-configuration/default";
import InputLabel from "ui-component/extended/Form/InputLabel";
import SubCard from "ui-component/cards/SubCard";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { setButtons } from "store/slices/app-globe";
import { openSnackbar } from "store/slices/snackbar";
import SendIcon from "@mui/icons-material/Send";
import { dispatch, useSelector } from "store";
// material-ui
import { Autocomplete, Grid, TextField, Button } from "@mui/material";
import api from "views/api-configuration/api";
import useFetchPermissions from "hooks/useFetchPerms";
import PropTypes from "prop-types";
const AddAppRolePermissionForm = ({ title }) => {
    const { roleNamee, productClientDatasetId } = useParams();
    const { screens } = useSelector((state) => state.globe);
    const { forms } = useSelector((state) => state.globe);
    const { actionButtons } = useSelector((state) => state.globe);
    const [formData, setFormData] = useState({
        allowedScreens: [],
        allowedForms: [],
        allowedButtons: []
    });

    const shouldFetch = Boolean(title);
    const { formData: initialFormData, isFetched } = useFetchPermissions(productClientDatasetId, roleNamee, shouldFetch);

    useEffect(() => {
        if (title && isFetched) {
            setFormData(initialFormData);
        }
    }, [title, isFetched, initialFormData]);

    const handleScreenSelection = (valueScrn) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            allowedScreens: valueScrn
        }));
    };

    const handleFormSelection = (value) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            allowedForms: value
        }));
    };
    const handleButtonSelection = (value) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            allowedButtons: value
        }));
    };
    useEffect(() => {
        dispatch(setButtons(productClientDatasetId, roleNamee));
    }, [productClientDatasetId, roleNamee]);
    const submitFieldData = () => {
        api.put(putUpdateAppPerm(productClientDatasetId, roleNamee), formData, {
            headers: GetAccessToken()
        })
            .then(() => {
                dispatch(
                    openSnackbar({
                        open: true,
                        message: "App Permission Created Successfully",
                        variant: "alert",
                        alert: {
                            color: "success"
                        },
                        close: false
                    })
                );
            })
            .catch((response) => {
                dispatch(
                    openSnackbar({
                        open: true,
                        message: "Error Creating App Record",
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
        <>
            <SubCard title={title || "Application permissions"}>
                {screens ? (
                    <Grid container spacing={2} p={1}>
                        <Grid item xs={12} lg={12}>
                            <InputLabel>Featured Screens</InputLabel>
                            <Autocomplete
                                multiple
                                value={title ? screens.filter((screen) => formData.allowedScreens.includes(screen.screenid)) : []}
                                disableCloseOnSelect
                                onChange={(event, valueScrn) => {
                                    if (Array.isArray(valueScrn)) {
                                        const selectedScreenIds = valueScrn.map((screen) => screen.screenid);
                                        handleScreenSelection(selectedScreenIds);
                                    }
                                }}
                                options={screens}
                                getOptionLabel={(option) => option.screentitle}
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </Grid>
                    </Grid>
                ) : (
                    <></>
                )}
                {forms ? (
                    <Grid container spacing={2} p={1}>
                        <Grid item xs={12} lg={12}>
                            <InputLabel>Forms</InputLabel>
                            <Autocomplete
                                multiple
                                value={title ? forms.filter((form) => formData.allowedForms.includes(form.formid)) : []}
                                onChange={(event, value) => {
                                    if (Array.isArray(value)) {
                                        const selectedFormIds = value.map((form) => form.formid);
                                        handleFormSelection(selectedFormIds);
                                    }
                                }}
                                options={forms}
                                getOptionLabel={(option) => option.formtitle}
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </Grid>
                    </Grid>
                ) : (
                    <></>
                )}
                {actionButtons !== null && actionButtons !== undefined ? (
                    <Grid container spacing={2} p={1}>
                        <Grid item xs={12} lg={12}>
                            <InputLabel>Featured Buttons</InputLabel>
                            <Autocomplete
                                multiple
                                value={title ? actionButtons.filter((button) => formData.allowedButtons.includes(button.buttonId)) : []}
                                onChange={(event, value) => {
                                    if (Array.isArray(value)) {
                                        const selectedButtonIds = value.map((button) => button.buttonId);
                                        handleButtonSelection(selectedButtonIds);
                                    }
                                }}
                                options={actionButtons}
                                getOptionLabel={(option) => option.buttonName}
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </Grid>
                    </Grid>
                ) : (
                    <></>
                )}
                <Grid container spacing={2} p={1}>
                    <Grid item xs={6} sm={6}>
                        <Button
                            type="submit"
                            onClick={submitFieldData}
                            color="secondary"
                            variant="contained"
                            style={{ marginTop: "10px" }}
                            endIcon={<SendIcon />}
                        >
                            SUBMIT
                        </Button>
                    </Grid>
                </Grid>
            </SubCard>
        </>
    );
};

AddAppRolePermissionForm.propTypes = {
    title: PropTypes.string
};
export default AddAppRolePermissionForm;
