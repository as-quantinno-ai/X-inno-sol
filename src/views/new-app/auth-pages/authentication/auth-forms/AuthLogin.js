import React, { useState, useCallback } from "react";
import { useTheme } from "@mui/material/styles";
import {
    Box,
    Button,
    Checkbox,
    CircularProgress,
    FormControl,
    FormControlLabel,
    FormHelperText,
    Grid,
    IconButton,
    InputAdornment,
    OutlinedInput,
    Stack,
    Typography
} from "@mui/material";
import * as Yup from "yup";
import { useFormik } from "formik";
import useScriptRef from "hooks/useScriptRef";
import AnimateButton from "ui-component/extended/AnimateButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import axios from "axios";
import { getOtp } from "views/api-configuration/default";
import { ERROR_MESSAGES, INPUT_TYPE, LOCAL_STORAGE_KEYS, LOGIN_INPUT_FIELDS, SCREENS } from "constants/authFlow";
import { THEME_MODE } from "constants/generic";
import PropTypes from "prop-types";
// const AuthLoginForm = ({ setScreenHandler, ...others }) => {
const AuthLoginForm = ({ setScreenHandler}) => {
    const theme = useTheme();
    const scriptedRef = useScriptRef();
    const [checked, setChecked] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = useCallback(() => setShowPassword((prev) => !prev), []);
    const handleMouseDownPassword = useCallback((event) => event.preventDefault(), []);

    const validationSchema = Yup.object().shape({
        email: Yup.string().email("Invalid email address").required(ERROR_MESSAGES.REQUIRED),
        password: Yup.string().required(ERROR_MESSAGES.REQUIRED)
    });

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
            submit: null
        },
        validationSchema,
        onSubmit: async (values, { setErrors, setStatus, setSubmitting }) => {
            try {
                const { email, password } = values;
                const formattedEmail = email;
                localStorage.setItem(LOCAL_STORAGE_KEYS.AUTH_DATA, JSON.stringify({ email: formattedEmail }));

                const response = await axios.post(getOtp, {
                    email: formattedEmail,
                    password
                });

                if (response.data) {
                    setScreenHandler(SCREENS.CODE_VERIFICATION);
                } else {
                    alert(ERROR_MESSAGES.INVALID_TOKEN);
                }
            } catch (error) {
                console.error("Login error:", error);
                if (scriptedRef.current) {
                    setStatus({ success: false });
                    setErrors({ submit: error.message });
                    setSubmitting(false);
                }
            }
        }
    });

    const renderInputField = (field) => (
        <FormControl
            key={field.name}
            fullWidth
            error={Boolean(formik.touched[field.name] && formik.errors[field.name])}
            sx={{ ...theme.typography.customInput }}
        >
            <Typography variant="body2" sx={{ margin: "10px 0px" }}>
                {field.label}
            </Typography>
            <OutlinedInput
                id={`outlined-adornment-${field.name}-login`}
                value={formik.values[field.name]}
                name={field.name}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type={field.name === INPUT_TYPE.PASSWORD && !showPassword ? INPUT_TYPE.PASSWORD : INPUT_TYPE.TEXT}
                sx={{
                    color: theme.palette.mode === THEME_MODE.DARK && theme.palette.inputField.color,
                    backgroundColor: theme.palette.mode === THEME_MODE.DARK && theme.palette.inputField.background,
                    padding: "5px 10px",
                    "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: theme.palette.inputField.color
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: theme.palette.inputField.color
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: theme.palette.inputField.color
                    }
                }}
                inputProps={{
                    sx: {
                        color: theme.palette.mode === THEME_MODE.DARK && theme.palette.inputField.color,
                        backgroundColor: theme.palette.mode === THEME_MODE.DARK && theme.palette.inputField.background,
                        padding: "5px 10px"
                    }
                }}
                endAdornment={
                    field.name === INPUT_TYPE.PASSWORD && (
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                edge="end"
                                size="large"
                            >
                                {showPassword ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                        </InputAdornment>
                    )
                }
            />

            {formik.touched[field.name] && formik.errors[field.name] && (
                <FormHelperText error id={`standard-weight-helper-text-${field.name}-login`}>
                    {formik.errors[field.name]}
                </FormHelperText>
            )}
        </FormControl>
    );

    return (
        <>
            <Grid container direction="column" justifyContent="center" spacing={2}>
                <Grid item xs={12} container aligntems="center">
                    <Box sx={{ mb: 2 }}>
                        <Typography sx={{ fontSize: "11px" }} variant="caption">
                            Enter your username and password to log in to your admin panel
                        </Typography>
                    </Box>
                </Grid>
            </Grid>
            {/* <form noValidate onSubmit={formik.handleSubmit} {...others} className="_input-fields-login"> */}
            <form noValidate onSubmit={formik.handleSubmit}  className="_input-fields-login">
                {LOGIN_INPUT_FIELDS?.map(renderInputField)}
                {formik.errors.submit && (
                    <Box>
                        <FormHelperText error>{formik.errors.submit}</FormHelperText>
                    </Box>
                )}
                <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2} marginY="25px">
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={checked}
                                onChange={(event) => setChecked(event.target.checked)}
                                name="checked"
                                color="primary"
                                sx={{ transform: "scale(0.75)", width: "10px", height: "10px" }}
                            />
                        }
                        label={<span style={{ paddingLeft: "5px" }}>Remember me</span>}
                    />
                </Stack>
                <Box sx={{ mt: 2 }}>
                    <AnimateButton>
                        <Button
                            sx={{ fontSize: "1.5vh", alignItems: "center" }}
                            disableElevation
                            fullWidth
                            size="large"
                            type="submit"
                            variant="contained"
                            color="secondary"
                            display="flex"
                        >
                            <>
                                <Typography>Sign In</Typography>
                                {formik.isSubmitting && (
                                    <Box marginLeft={1}>
                                        <CircularProgress size={12} color="inherit" />
                                    </Box>
                                )}
                            </>
                        </Button>
                    </AnimateButton>
                </Box>
            </form>
        </>
    );
};

AuthLoginForm.propTypes = {
    setScreenHandler: PropTypes.func
};
export default AuthLoginForm;
