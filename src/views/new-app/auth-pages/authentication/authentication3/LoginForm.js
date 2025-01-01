import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import AuthLogin from "../auth-forms/AuthLogin";
import PropTypes from "prop-types";
const LoginForm = ({ setScreenHandler }) => {
    // const { screenHandler, setScreenHandler } = props;
    return (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", width: "50%" }} className="_login-container">
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "end", width: "80%" }}>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <Grid container item xs={12} md={12} lg={12} className="second-screen">
                        <Grid item xs={12}>
                            <div className="Inner">
                                <Typography color="secondary" fontSize="30px" sx={{ fontWeight: "bold" }}>
                                    Welcome Back!
                                </Typography>
                                {/* <AuthLogin screenHandler={screenHandler} setScreenHandler={setScreenHandler} /> */}
                                <AuthLogin setScreenHandler={setScreenHandler} />
                            </div>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Box>
    );
};
LoginForm.propTypes = {
    setScreenHandler: PropTypes.func
};

export default LoginForm;
