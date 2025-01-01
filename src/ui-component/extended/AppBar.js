import PropTypes from "prop-types";
import React from "react";
// import { Link as RouterLink } from "react-router-dom";

// material-ui
import { useTheme } from "@mui/material/styles";
import LogoutIcon from "@mui/icons-material/Logout";
// import { useDispatch, useSelector } from "react-redux";
// import { hasRequest } from "store/slices/app-dashboard";
import {
    AppBar as MuiAppBar,
    // Box,
    Button,
    Container,
    // Drawer,
    // IconButton,
    Link,
    // List,
    // ListItemButton,
    // ListItemIcon,
    // ListItemText,
    Stack,
    Toolbar,
    Typography,
    useScrollTrigger
    // CircularProgress
} from "@mui/material";

// project imports
import Logo from "ui-component/Logo";

// assets
// import { IconBook, IconCreditCard, IconDashboard, IconHome2 } from "@tabler/icons";
// import MenuIcon from "@mui/icons-material/Menu";

// elevation scroll

function ElevationScroll({ children, window }) {
    const theme = useTheme();
    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 0,
        target: window
    });
    const darkBorder = theme.palette.mode === "dark" ? theme.palette.dark.dark : theme.palette.grey[200];

    return React.cloneElement(children, {
        elevation: trigger ? 2 : 0,
        style: {
            backgroundColor: theme.palette.background.default,
            borderBottom: trigger ? "none" : "1px solid",
            borderColor: trigger ? "" : darkBorder,
            color: theme.palette.text.dark,
            boxShadow: "none"
        }
    });
}

ElevationScroll.propTypes = {
    children: PropTypes.node,
    window: PropTypes.object
};

// ==============================|| MINIMAL LAYOUT APP BAR ||============================== //

export const loadingCoverStyles = {
    width: "100%",
    height: "100vh",
    position: "fixed",
    top: "0px",
    left: "0px",
    background: "#0d0d0db3",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 20000
};

export const loadingCover = () => <></>;

const AppBar = ({ ...others }) => {
    // const dispatch = useDispatch();
    // const counter = useSelector((state) => state.dashboard);

    // const [drawerToggle, setDrawerToggle] = React.useState(false);
    /** Method called on multiple components with different event types */
    // const drawerToggler = (open) => (event) => {
    //     if (event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
    //         return;
    //     }
    //     setDrawerToggle(open);
    // };

    return (
        <ElevationScroll {...others}>
            <MuiAppBar>
                <Container>
                    <Toolbar>
                        <Typography component="div" sx={{ flexGrow: 1, textAlign: "left" }}>
                            <Logo />
                        </Typography>
                        <Stack direction="row" sx={{ display: { xs: "none", sm: "block" } }} spacing={1}>
                            <Button color="inherit" component={Link} href="#home">
                                Intro
                                {/* {counter.counter} */}
                            </Button>
                            <Button color="inherit" component={Link} href="#test-results">
                                Predictions
                            </Button>
                            <Button color="inherit" component={Link} href="#data-ingestion">
                                Data Ingestion
                            </Button>
                            {/* <Button color="inherit" component={Link} href="#raw-data-discovery">
                                Raw Data Discovery
                            </Button>
                             <Button color="inherit" component={Link} href="#data-preparation">
                                Data Curation
                            </Button> 
                            <Button color="inherit" component={Link} href="#feature-data-discovery">
                                Feature Data Discovery
                            </Button> */}
                            <Button color="inherit" component={Link} href="#machine-learning-modeling">
                                ML Modeling
                            </Button>
                            <Button color="inherit" component={Link} href="#available-ml-models">
                                Models
                            </Button>
                            {/* <Button color="inherit" component={Link} href="https://codedthemes.gitbook.io/berry" target="_blank">
                                Data Discovery
                            </Button> */}
                            <Button
                                // component={Link}
                                // href=""
                                disableElevation
                                variant="contained"
                                color="secondary"
                                // onClick={() => dispatch(getDashboardData())}
                            >
                                <LogoutIcon />
                                LOGOUT
                            </Button>
                        </Stack>
                    </Toolbar>
                </Container>
            </MuiAppBar>
        </ElevationScroll>
    );
};

export default AppBar;
