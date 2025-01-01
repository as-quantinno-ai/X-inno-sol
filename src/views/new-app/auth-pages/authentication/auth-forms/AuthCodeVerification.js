import React, { useState } from "react";
import { useTheme } from "@mui/material/styles";
import { Button, CircularProgress, Grid, Stack, Typography } from "@mui/material";
import axios from "axios";
import { useDispatch } from "react-redux";
import OtpInput from "react-otp-input-rc-17";

import { getUserRoleDataSets } from "store/slices/user-login";
import { loginUrl } from "views/api-configuration/default";
import { LOCAL_STORAGE_KEYS, SCREENS } from "constants/authFlow";
import { THEME_MODE } from "constants/generic";
import PropTypes from "prop-types";
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

const AuthCodeVerification = ({ setScreenHandler }) => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const [otpCode, setOtpCode] = useState("");
    const [error, setError] = useState("");
    const [errInvalidOtp, setErrInvalidOtp] = useState("");
    const [isApiLoading, setIsApiLoading] = useState(false);

    const storedAuthData = JSON.parse(localStorage.getItem("authData"));

    const handleOtpChange = (otpNumber) => {
        setOtpCode(otpNumber);
    };

    const handleProceed = () => {
        setIsApiLoading(true);
        const { email } = storedAuthData || {};

        axios
            .post(loginUrl, { email, otp: otpCode })
            .then((response) => {
                const result = response.data.result;
                if (result) {
                    setSession(result);
                    dispatch(getUserRoleDataSets());
                    setScreenHandler(SCREENS.DATASET);
                    setIsApiLoading(false);
                } else {
                    setErrInvalidOtp(response.data.message);
                    setIsApiLoading(false);
                }
            })
            .catch((err) => {
                setError(err.message);
                setIsApiLoading(false);
            });
    };

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <OtpInput
                    value={otpCode}
                    onChange={handleOtpChange}
                    numInputs={5}
                    containerStyle={{ justifyContent: "space-between" }}
                    isInputNum
                    inputStyle={{
                        width: "100%",
                        margin: "8px",
                        padding: "25px",
                        border: `2px solid ${theme.palette.primary.main}`,
                        backgroundColor: theme.palette.mode === THEME_MODE.DARK && theme.palette.inputField.background,
                        borderRadius: 4,
                        color: theme.palette.mode === THEME_MODE.DARK && theme.palette.inputField.color,
                        ":hover": { borderColor: theme.palette.primary.main }
                    }}
                    focusStyle={{
                        outline: "none",
                        border: `2px solid ${theme.palette.primary.main}`
                    }}
                />
            </Grid>

            <Grid item xs={12}>
                <Typography variant="caption" sx={{ color: "red" }}>
                    {errInvalidOtp}
                    {error}
                </Typography>
            </Grid>
            <Grid item xs={6}>
                <Button
                    disableElevation
                    fullWidth
                    size="large"
                    color="primary"
                    variant="contained"
                    onClick={() => setScreenHandler("login")}
                >
                    Go Back
                </Button>
            </Grid>
            <Grid item xs={6}>
                <Button
                    disableElevation
                    fullWidth
                    size="large"
                    color="secondary"
                    variant="contained"
                    onClick={handleProceed}
                    disabled={otpCode.length !== 5 || isApiLoading}
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }}
                >
                    {isApiLoading ? (
                        <>
                            Proceeding... <CircularProgress size={12} color="inherit" />
                        </>
                    ) : (
                        "Proceed"
                    )}
                </Button>
            </Grid>
            <Grid item xs={12}>
                <Stack direction="row" justifyContent="space-between" alignItems="baseline">
                    <Typography>Did not receive the email? Check your spam filter</Typography>
                </Stack>
            </Grid>
        </Grid>
    );
};

AuthCodeVerification.propTypes = {
    setScreenHandler: PropTypes.func
};
export default AuthCodeVerification;
