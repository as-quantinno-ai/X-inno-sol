import React from "react";
import { Grid, Typography, Box } from "@mui/material";
import AuthCodeVerification from "../auth-forms/AuthCodeVerification";
import PropTypes from "prop-types";
const OtpVerification = ({ screenHandler, setScreenHandler }) => (
    <Box
        sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            width: "50%"
        }}
        className="otp-container"
    >
        <Box sx={{ display: "flex", justifyContent: "end", width: "80%" }}>
            <Grid container width={450} spacing={1}>
                <Grid item lg={12}>
                    <Typography
                        color="secondary"
                        variant="h3"
                        component="p"
                        mb={3}
                        sx={{ fontSize: "30px", textAlign: "center", fontWeight: "bold" }}
                    >
                        Please Enter Verification Code
                    </Typography>
                    <Grid item xs={12} container justifyContent="center">
                        <Typography sx={{ fontSize: "1.2vh" }} variant="caption">
                            We’ve sent you the OTP code
                        </Typography>
                    </Grid>
                </Grid>
                <AuthCodeVerification screenHandler={screenHandler} setScreenHandler={setScreenHandler} />
            </Grid>
        </Box>
    </Box>
);

OtpVerification.propTypes = {
    screenHandler: PropTypes.string,
    setScreenHandler: PropTypes.func
};

export default OtpVerification;
