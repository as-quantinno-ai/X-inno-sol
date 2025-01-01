import React from "react";
import PropTypes from "prop-types";

// material-ui
import { useTheme } from "@mui/material/styles";
import { Box, Grid, Typography, useMediaQuery } from "@mui/material";

// third party
import Chart from "react-apexcharts";

// project imports
import MainCard from "views/new-app/components/basic/cards/MainCard";

// =============================|| SEO CHART CARD ||============================= //

const ObservabilityChartsCard = ({ chartData, value, title, icon, type }) => {
    const theme = useTheme();
    const matchDownMd = useMediaQuery(theme.breakpoints.down("lg"));

    return (
        <MainCard>
            <Grid container justifyContent="space-between" spacing={2}>
                <Grid item xs={12}>
                    <Grid container direction={type === 1 ? "column-reverse" : "column"} spacing={type === 1 ? 0 : 1}>
                        {value && (
                            <Grid item>
                                <Typography component="span" variant={matchDownMd ? "h4" : "h3"}>
                                    {value}
                                </Typography>
                            </Grid>
                        )}
                        {(title || icon) && (
                            <Grid item container justifyContent="flex-start" alignContent="center">
                                {title && (
                                    <Typography component="span" variant="body1">
                                        {title}
                                    </Typography>
                                )}
                                {icon && (
                                    <Box
                                        sx={{
                                            ml: 1
                                        }}
                                    >
                                        {icon}
                                    </Box>
                                )}
                            </Grid>
                        )}
                    </Grid>
                </Grid>
                {chartData && (
                    <Grid item xs={12}>
                        <Chart {...chartData} />
                    </Grid>
                )}
            </Grid>
        </MainCard>
    );
};

ObservabilityChartsCard.propTypes = {
    chartData: PropTypes.object,
    title: PropTypes.string,
    icon: PropTypes.oneOfType([PropTypes.element, PropTypes.node]),
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    type: PropTypes.number
};

export default ObservabilityChartsCard;
