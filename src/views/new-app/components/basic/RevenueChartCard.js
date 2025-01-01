import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
// material-ui
import { useTheme } from "@mui/material/styles";
// import { Box, Divider, Grid, useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";
// third party
// import Chart from "react-apexcharts";
import { useDispatch } from "store";
import { getCumulativeData } from "store/slices/app-dashboard";
// import { SOCKET_URL, DashboardListner, dashChartUrl, GetJWT } from "views/api-configuration/default";
import { dashChartUrl, GetJWT } from "views/api-configuration/default";
// import SockJsClient from "react-stomp";

// project imports
import MainCard from "./cards/MainCard";

// ===========================|| REVENUE CHART CARD ||=========================== //

const RevenueChartCard = () => {
    // Styles
    const theme = useTheme();
    let themetype = "theme1";

    if (theme.palette.primary.light === "#eceff1") {
        // Theme2
        themetype = "theme1";
    } else if (theme.palette.primary.light === "#e4e7ec") {
        // Theme3
        themetype = "theme2";
    } else if (theme.palette.primary.light === "#e3ebeb") {
        // Theme4
        themetype = "theme3";
    } else if (theme.palette.primary.light === "#e3e8e8") {
        // Theme5
        themetype = "theme4";
    } else if (theme.palette.primary.light === "#e2e5e8") {
        // Theme6
        themetype = "theme5";
    } else if (theme.palette.primary.light === "#e3f2fd") {
        // Theme1
        themetype = "theme6";
    } else {
        // Theme7
        themetype = "theme7";
    }

    // const secondary = theme.palette.secondary.main;
    // const primary = theme.palette.primary.main;

    // Constants
    // // for main pie chart
    // const [jwt, setJwt] = useState(GetJWT());
    // eslint-disable-next-line no-unused-vars
    const [series, setSeries] = useState(null);
    // const [mainPieChart, setMainPieChart] = useState({
    //     height: 228,
    //     type: "donut",
    //     options: {
    //         chart: {
    //             id: "revenue-chart"
    //         },
    //         colors: [secondary, primary],
    //         dataLabels: {
    //             enabled: false
    //         },
    //         labels: ["Poitive Cases", "Negative Cases"],
    //         legend: {
    //             show: true,
    //             position: "bottom",
    //             fontFamily: "inherit",
    //             labels: {
    //                 colors: [secondary, primary]
    //             },
    //             itemMargin: {
    //                 horizontal: 10,
    //                 vertical: 10
    //             }
    //         }
    //     }
    // });

    // Redux Store
    const dispatch = useDispatch();
    const { cummulativeData } = useSelector((state) => state.dashboard);

    useEffect(() => {
        dispatch(getCumulativeData());
        setSeries(cummulativeData);
    }, []);

    // function updateChart() {
    //     dispatch(getCumulativeData());
    //     setSeries(cummulativeData);
    // }
    return (
        <MainCard title="Total Patients Count" style={{ height: 500 }}>
            <iframe
                src={`${dashChartUrl}total-patients-heart-count?height=300&width=300&theme=${themetype}&jwt=${GetJWT()}`}
                title="something"
                width="100%"
                height="400"
                style={{ border: "none" }}
            />
            {/* <SockJsClient url={SOCKET_URL} topics={[`${DashboardListner}`]} onMessage={(newData) => updateChart()} debug={false} />
            <Grid container spacing={2} direction={matchDownMd && !matchDownXs ? 'row' : 'column'}>
                {series ? (
                    <Grid item xs={12} sm={7} md={12}>
                        {series.countnegative === null || series.countpositive === null || series.counttotal === null ? (
                            <></>
                        ) : (
                            <Chart options={mainPieChart.options} series={[series.countpositive, series.countnegative]} type="donut" />
                        )}
                    </Grid>
                ) : (
                    <></>
                )}
                <Box sx={{ display: { xs: 'none', sm: 'block', md: 'none' } }}>
                    <Grid item>
                        <Divider />
                    </Grid>
                </Box>
            </Grid> */}
        </MainCard>
    );
};

RevenueChartCard.propTypes = {
    chartData: PropTypes.object
};

export default RevenueChartCard;
