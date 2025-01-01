import PropTypes from "prop-types";
import React from "react";

// material-ui
import { useTheme } from "@mui/material/styles";
// import { Grid, MenuItem, TextField, Typography } from "@mui/material";

import { useSelector } from "store";

// project imports
// import useConfig from "hooks/useConfig";
import SkeletonTotalGrowthBarChart from "./cards/TotalGrowthBarChart";
import MainCard from "./cards/MainCard";
// import { gridSpacing } from 'store/constant';
// import { GenerateMixedChart } from 'views/new-app/components/Apexchart/ApexMixedChart';
// import ApexSyncChart from 'views/new-app/components/Apexchart/ApexSyncChart';
import { GetJWT, dashChartUrl } from "views/api-configuration/default";

// chart data
// import chartData from './chart-data/total-growth-bar-chart';

// const status = [
//     {
//         value: "Y",
//         label: "Yearly Statistics"
//     },
//     {
//         value: "M",
//         label: "Monthly Statistics"
//     },
//     {
//         value: "D",
//         label: "Daily Statistics"
//     },
//     {
//         value: "H",
//         label: "Hourly Statistics"
//     },
//     {
//         value: "m",
//         label: "Minutes Statistics"
//     }
// ];

// ==============================|| DASHBOARD DEFAULT - TOTAL GROWTH BAR CHART ||============================== //

const TotalGrowthBarChart = ({ isLoading}) => {
    // const [value, setValue] = React.useState("D");
    const { publishedMlModel } = useSelector((state) => state.globe);
    // const { navType } = useConfig();
    // const { cummulativeData } = useSelector((state) => state.dashboard);
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

    return (
        <>
            {isLoading ? (
                <SkeletonTotalGrowthBarChart />
            ) : (
                <MainCard>
                    {/* <Grid container spacing={gridSpacing}>
                        <Grid item xs={12}>
                            <Grid container alignItems="center" justifyContent="space-between">
                                <Grid item>
                                    <Grid container direction="column" spacing={1}>
                                        <Grid item>
                                            <Typography variant="subtitle2">Patient Diagnosis Summary</Typography>
                                        </Grid>
                                        <Grid item>
                                            <Typography variant="h3">Total Patients: {cummulativeData.counttotal}</Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item>
                                    <TextField
                                        id="standard-select-currency"
                                        select
                                        value={value}
                                        onChange={(e) => setValue(e.target.value)}
                                    >
                                        {status.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <ApexSyncChart mlModelRunId={mlRunId} chck={value} />
                        </Grid>
                    </Grid> */}
                    <iframe
                        src={`${dashChartUrl}prediction-summary-cummulative?mlModelRunId=${
                            publishedMlModel?.mlmodelRuns?.mlmodelrunsid
                        }&height=400&width=200&theme=${themetype}&jwt=${GetJWT()}`}
                        title="something"
                        width="100%"
                        height="500"
                    />
                </MainCard>
            )}
        </>
    );
};

TotalGrowthBarChart.propTypes = {
    isLoading: PropTypes.bool
};

export default TotalGrowthBarChart;
