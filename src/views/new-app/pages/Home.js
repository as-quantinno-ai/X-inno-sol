import React, { useEffect } from "react";
import { useDispatch } from "store";
import { useSelector } from "react-redux";

// material-ui
import { Box, Grid, Divider, Link, Typography, useMediaQuery } from "@mui/material";
import Chart from "react-apexcharts";

// third party
import PerfectScrollbar from "react-perfect-scrollbar";

// project imports
import MainCard from "ui-component/cards/MainCard";
import { useTheme } from "@mui/material/styles";

// assets

import HoverSocialCard from "ui-component/cards/HoverSocialCard";
import SideIconCard from "ui-component/cards/SideIconCard";

import AccountCircleTwoTone from "@mui/icons-material/AccountCircleTwoTone";

import LinkedInIcon from "@mui/icons-material/LinkedIn";

import EmailTwoToneIcon from "@mui/icons-material/EmailTwoTone";
import BadgeTwoToneIcon from "@mui/icons-material/BadgeTwoTone";
import PhoneTwoToneIcon from "@mui/icons-material/PhoneTwoTone";
import { baseApi } from "store/slices/initial-data";
// =============================|| LANDING - FEATURE PAGE ||============================= //
const chartData = {
    height: 228,
    type: "donut",
    options: {
        chart: {
            id: "revenue-chart"
        },
        dataLabels: {
            enabled: false
        },
        labels: ["Users", "Roles", "Resources"],
        legend: {
            show: true,
            position: "bottom",
            fontFamily: "inherit",
            labels: {
                colors: "inherit"
            },
            itemMargin: {
                horizontal: 10,
                vertical: 10
            }
        }
    },
    series: [1258, 975, 500]
};

const quickLinksData = [
    {
        title: "XtremeQ",
        url: "/XtremeQ",
        desc: "Talk with your data"
    },
    {
        title: "Data Ingestion",
        url: "/data-ingestion",
        desc: "Manage your datasources"
    },
    {
        title: "Machine Learning",
        url: "/machine-learning",
        desc: "Manage your datasources"
    },
    {
        title: "Data Discovery",
        url: "/data-discovery",
        desc: "Explore your data"
    },
    {
        title: "Dashboard Builder",
        url: "/build-dashboard",
        desc: "Generate Insigts"
    },
    {
        title: "Resource Roles",
        url: "resource-role",
        desc: "Manage tenant resources"
    }
];

const Home = () => {
    const dispatch = useDispatch();

    const theme = useTheme();
    const { quickLinks, userHistory, userProfile } = useSelector((state) => state.userLogin);
    const matchDownMd = useMediaQuery(theme.breakpoints.down("md"));
    const matchDownXs = useMediaQuery(theme.breakpoints.down("sm"));

    const colors = [theme.palette.orange.dark, theme.palette.primary.dark, theme.palette.secondary.main];

    useEffect(() => {
        dispatch(baseApi());
    }, []);

    return (
        <Grid container spacing={3}>
            <Grid item xs={12} sm={12} lg={12}>
                <Typography variant="h3">User Profile</Typography>
                <Divider sx={{ margin: "0 0 0 0" }} />
            </Grid>

            <Grid item xs={4} md={4} lg={4}>
                <MainCard title="About" sx={{ height: "380px" }}>
                    <Grid
                        container
                        spacing={2}
                        sx={{
                            "& >div": {
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                display: "block",
                                width: "100%"
                            },
                            "& a": {
                                color: theme.palette.grey[700],
                                "& svg": {
                                    mr: 1,
                                    verticalAlign: "bottom"
                                },
                                "&:hover": {
                                    color: theme.palette.primary.main,
                                    textDecoration: "none"
                                }
                            }
                        }}
                    >
                        {userHistory && (
                            <>
                                <Grid item xs={12}>
                                    <Link underline="hover">
                                        <BadgeTwoToneIcon color="secondary" />
                                        {userHistory.firstName} {userHistory.lastName}
                                    </Link>
                                </Grid>
                                <Grid item xs={12}>
                                    <Link underline="hover">
                                        <EmailTwoToneIcon sx={{ color: "primary" }} /> {userHistory.emailAddress}
                                    </Link>
                                </Grid>
                                <Grid item xs={12}>
                                    <Link underline="hover">
                                        <PhoneTwoToneIcon color="success" />
                                        {userHistory.phone}
                                    </Link>
                                </Grid>
                                <Grid item xs={12}>
                                    <Link underline="hover">
                                        <LinkedInIcon sx={{ color: theme.palette.grey[900] }} /> {userHistory.companyName}
                                    </Link>
                                </Grid>
                                <Grid item xs={12}>
                                    <Link underline="hover">
                                        <AccountCircleTwoTone sx={{ color: theme.palette.grey[900] }} /> Last Login: 26 Feb 2024
                                    </Link>
                                </Grid>
                            </>
                        )}
                    </Grid>
                </MainCard>
            </Grid>
            <Grid item xs={4} md={4} lg={4}>
                <MainCard title="History" sx={{ height: "380px" }}>
                    <PerfectScrollbar style={{ height: 230 }}>
                        <Grid container spacing={2}>
                            {userProfile && (
                                <>
                                    {userProfile.map((userprofile, index) => (
                                        <React.Fragment key={index}>
                                            <Grid item xs={12}>
                                                <Typography variant="h5" color="textPrimary" sx={{ mb: "-20px" }}>
                                                    {userprofile.className}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Typography variant="caption" color="textSecondary" sx={{ mt: "-15px" }}>
                                                    {userprofile.operation}
                                                </Typography>
                                            </Grid>
                                        </React.Fragment>
                                    ))}
                                </>
                            )}
                        </Grid>
                        <Divider sx={{ margin: "16px 0" }} />
                    </PerfectScrollbar>
                </MainCard>
            </Grid>
            <Grid item xs={4} md={4} lg={4}>
                {/* <RevenueChartCard chartData={chartData} /> */}
                <MainCard title="Resources Infographics">
                    <Grid container spacing={2} direction={matchDownMd && !matchDownXs ? "row" : "column"}>
                        <Grid item xs={12} sm={7} md={12}>
                            <Chart {...chartData} />
                        </Grid>
                        <Box sx={{ display: { xs: "none", sm: "block", md: "none" } }}>
                            <Grid item>
                                <Divider />
                            </Grid>
                        </Box>
                        <Grid item container justifyContent="space-around" alignItems="center" xs={12} sm={5} md={12}>
                            <Grid item sm={4}>
                                <Grid container direction="column">
                                    <Typography variant="h6">Users</Typography>
                                    <Typography variant="subtitle1" style={{ color: theme.palette.error.main }}>
                                        16
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Grid item sm={4}>
                                <Grid container direction="column">
                                    <Typography variant="h6">Roles</Typography>
                                    <Box sx={{ color: theme.palette.primary.main }}>
                                        <Typography variant="subtitle1" color="inherit">
                                            45
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                            <Grid item sm={4}>
                                <Grid container direction="column">
                                    <Typography variant="h6">Resources</Typography>
                                    <Typography variant="subtitle1" style={{ color: theme.palette.secondary.main }}>
                                        50
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </MainCard>
            </Grid>

            <Grid item xs={12} sm={12} lg={12}>
                <Typography variant="h3">Quick Links</Typography>
            </Grid>
            {quickLinks && (
                <>
                    {quickLinks.map((quicklink, index) => (
                        <React.Fragment key={index}>
                            <Grid item xs={12} lg={3} sm={6}>
                                <a href={quickLinksData[index].url} style={{ textDecoration: "none" }}>
                                    <HoverSocialCard
                                        primary={quickLinksData[index].desc}
                                        secondary={quickLinksData[index].title}
                                        // iconPrimary={TwitterIcon}
                                        color={colors[index % colors.length]}
                                    />
                                </a>
                            </Grid>
                        </React.Fragment>
                    ))}
                </>
            )}
            <Grid item xs={12} sm={12} lg={12}>
                <Typography variant="h3">Usage & Costing Details</Typography>
            </Grid>
            <Grid item xs={12} lg={3} sm={6}>
                <SideIconCard
                    iconPrimary={AccountCircleTwoTone}
                    primary="$148"
                    secondary="Total Cost of Month"
                    // secondarySub="USD"
                    color={theme.palette.secondary.main}
                />
            </Grid>
            <Grid item xs={12} lg={3} sm={6}>
                <SideIconCard
                    iconPrimary={AccountCircleTwoTone}
                    primary="$105"
                    secondary="Resources Cost"
                    // secondarySub="USD"
                    color={theme.palette.secondary.main}
                />
            </Grid>
            <Grid item xs={12} lg={3} sm={6}>
                <SideIconCard
                    iconPrimary={AccountCircleTwoTone}
                    primary="$43"
                    secondary="Chat Engine Cost"
                    // secondarySub="USD"
                    color={theme.palette.secondary.main}
                />
            </Grid>
        </Grid>
    );
};

export default Home;
