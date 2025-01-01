import React from "react";
// material-ui
import { Link, Typography, Stack } from "@mui/material";

// ==============================|| FOOTER - AUTHENTICATION 2 & 3 ||============================== //

const AuthFooter = () => (
    <Stack direction="row" justifyContent="space-between">
        <Typography variant="subtitle2" component={Link} href="https://berrydashboard.io" target="_blank" underline="hover">
            DataAnalytix
        </Typography>
        <Typography variant="subtitle2" component={Link} href="https://codedthemes.com" target="_blank" underline="hover">
            &copy; the-innovative-solutions
        </Typography>
    </Stack>
);

export default AuthFooter;
