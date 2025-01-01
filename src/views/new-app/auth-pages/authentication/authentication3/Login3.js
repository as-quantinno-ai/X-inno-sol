import React from "react";
import "./Login.css"; // FIX: Please fix this we dont allow importing .css like this
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";
import { Grid, Typography, Button, Box } from "@mui/material";
import Logo from "./Logo";
import DatasetSelection from "views/new-app/pages/DatasetSelection";
// import { ConfigContext } from "contexts/ConfigContext";
import { selectIsAuthenticated } from "store/slices/authorization";
import OtpVerification from "./OtpVerification";
import { useTheme } from "@mui/material/styles";
import LoginForm from "./LoginForm";
import { ADDITIONAL_OPTIONS, ANALYTICS_WEBSITE_URL, WINDOW_OPTIONS } from "views/api-configuration/default";
import { THEME_MODE } from "constants/generic";
import PropTypes from "prop-types";

const ActiveScreen = ({ screenHandler, setScreenHandler }) => {
    const screens = {
        default: <LoginForm screenHandler={screenHandler} setScreenHandler={setScreenHandler} />,
        codeverification: <OtpVerification screenHandler={screenHandler} setScreenHandler={setScreenHandler} />,
        dataset: <DatasetSelection />
    };

    return screens[screenHandler] || screens.default;
};

ActiveScreen.propTypes = {
    screenHandler: PropTypes.string,
    setScreenHandler: PropTypes.func
};

const HeadingSection = () => (
    <Box marginTop="30px">
        <Typography className="main-heading" color="secondary" fontSize="30px" sx={{ fontWeight: "bold" }}>
            Next-Gen Big Data Management
        </Typography>
        <Typography className="main-heading-para" color="secondary" sx={{ fontWeight: "bold", fontSize: "16px" }}>
            Designed to Empower Faster Decisions With Streamlined Workflows
        </Typography>
    </Box>
);

const FooterSection = ({ handleClick }) => (
    <Box sx={{ position: "relative", bottom: 0 }}>
        <Typography className="bottom-text" fontSize="1.5rem">
            Helping you make the right decision for your business
        </Typography>
        <Button
            color="secondary"
            variant="contained"
            sx={{
                fontSize: "1.5rem",
                marginBottom: "5px",
                marginTop: "5%",
                paddingLeft: "10%",
                paddingRight: "10%",
                borderRadius: "8px"
            }}
            onClick={handleClick}
        >
            <Typography sx={{ fontSize: "1rem", fontWeight: "bold" }}>xtremeAnalytix.com</Typography>
        </Button>
    </Box>
);

FooterSection.propTypes = {
    handleClick: PropTypes.func
};
const Login = () => {
    const theme = useTheme();
    const [screenHandler, setScreenHandler] = useState("");
    const handleClick = () => {
        window.open(ANALYTICS_WEBSITE_URL, WINDOW_OPTIONS, ADDITIONAL_OPTIONS);
    };
    const isAuthenticated = useSelector(selectIsAuthenticated);
    // const { presetColor } = useContext(ConfigContext);

    const selectedDatasetProceedClicked = useSelector((state) => state.userLogin.selectedDatasetProceedClicked);

    if (isAuthenticated && selectedDatasetProceedClicked) {
        return <Navigate to="/" />;
    }

    return (
        <Box sx={{ background: theme.palette.mode === THEME_MODE.DARK ? theme.palette.dark.main : theme.palette.primary.light }}>
            <Grid container className="main-screen">
                <ActiveScreen screenHandler={screenHandler} setScreenHandler={setScreenHandler} />
                {/* <Box> */}
                <Grid
                    item
                    xs={12}
                    xl={6}
                    sm={6}
                    md={6}
                    className={" _container"}
                    sx={{ height: "85vh", width: "40vh", borderRadius: "30px" }}
                    display="flex"
                    flexDirection="column"
                    justifyContent="space-between"
                    alignSelf="center"
                    padding="40px"
                >
                    <Box className="_logo-section">
                        <Logo />
                        <HeadingSection />
                    </Box>
                    <FooterSection handleClick={handleClick} />
                </Grid>
            </Grid>
        </Box>
    );
};

export default Login;
