import React from "react";
import PropTypes from "prop-types";
// material-ui
import { Grid, LinearProgress, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
// import { useSelector } from "store";

// project imports
import { gridSpacing } from "store/constant";
import PerfectScrollbar from "react-perfect-scrollbar";

// ===========================|| DATA WIDGET - TRAFFIC SOURCES ||=========================== //

// eslint-disable-next-line react/prop-types
const RenderVisual = ({ val, color, max }) =>
    val !== undefined ? (
        <>
            {" "}
            <Grid item>
                <Typography variant="body2" align="right">
                    {val !== null ? val : "null"}
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <LinearProgress
                    variant="determinate"
                    value={
                        val !== null && val !== undefined && max !== 0 && max !== undefined && max !== 0 ? Math.ceil((val / max) * 100) : 0
                    }
                    color={color}
                />
            </Grid>
        </>
    ) : (
        <></>
    );
RenderVisual.protoTypes = {
    val: PropTypes.number,
    color: PropTypes.string,
    max: PropTypes.number
};
const MeanModeList = ({ obj }) => {
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
        // eslint-disable-next-line no-unused-vars
        themetype = "theme7";
    }
    const distinctValuesObject = JSON.parse(obj.distinctValues);
    return (
        <div>
            {obj ? (
                <>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                        {obj.attribCategory === "QUANTITATIVE" ? (
                            <Typography variant="h6">VARAIBLE SUMMARY</Typography>
                        ) : (
                            <Typography variant="h6">DISTINCT VALUES COUNT</Typography>
                        )}
                    </Grid>
                    {obj.attribCategory === "QUANTITATIVE" ? (
                        <>
                            <Grid item xs={6}>
                                <Grid container spacing={gridSpacing}>
                                    <Grid item xs={12}>
                                        <Grid container alignItems="center" spacing={gridSpacing}>
                                            <Grid item sm zeroMinWidth>
                                                <Typography variant="body2">Mean</Typography>
                                            </Grid>
                                            <RenderVisual val={obj.mean} color="primary" max={obj.quartile3} />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={gridSpacing}>
                                    <Grid item xs={12}>
                                        <Grid container alignItems="center" spacing={gridSpacing}>
                                            <Grid item sm zeroMinWidth>
                                                <Typography variant="body2">Median</Typography>
                                            </Grid>
                                            <RenderVisual val={obj.median} color="secondary" max={obj.quartile3} />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={gridSpacing}>
                                    <Grid item xs={12}>
                                        <Grid container alignItems="center" spacing={gridSpacing}>
                                            <Grid item sm zeroMinWidth>
                                                <Typography variant="body2">Mode</Typography>
                                            </Grid>
                                            <RenderVisual val={obj.mod} color="primary" max={obj.quartile3} />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={gridSpacing}>
                                    <Grid item xs={12}>
                                        <Grid container alignItems="center" spacing={gridSpacing}>
                                            <Grid item sm zeroMinWidth>
                                                <Typography variant="body2">Square Root</Typography>
                                            </Grid>
                                            <RenderVisual val={obj.sqrtroot} color="secondary" max={obj.quartile3} />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={gridSpacing}>
                                    <Grid item xs={12}>
                                        <Grid container alignItems="center" spacing={gridSpacing}>
                                            <Grid item sm zeroMinWidth>
                                                <Typography variant="body2">Null Value Count</Typography>
                                            </Grid>
                                            <RenderVisual val={obj.nullValueCount} color="primary" max={obj.quartile3} />
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={6}>
                                <Grid container spacing={gridSpacing}>
                                    <Grid item xs={12}>
                                        <Grid container alignItems="center" spacing={gridSpacing}>
                                            <Grid item sm zeroMinWidth>
                                                <Typography variant="body2">Maximum Value</Typography>
                                            </Grid>
                                            <RenderVisual val={obj.min} color="primary" max={obj.quartile3} />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={gridSpacing}>
                                    <Grid item xs={12}>
                                        <Grid container alignItems="center" spacing={gridSpacing}>
                                            <Grid item sm zeroMinWidth>
                                                <Typography variant="body2">Minimum Value</Typography>
                                            </Grid>
                                            <RenderVisual val={obj.max} color="secondary" max={obj.quartile3} />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={gridSpacing}>
                                    <Grid item xs={12}>
                                        <Grid container alignItems="center" spacing={gridSpacing}>
                                            <Grid item sm zeroMinWidth>
                                                <Typography variant="body2">Quartile 01</Typography>
                                            </Grid>
                                            <RenderVisual val={obj.quartile1} color="primary" max={obj.quartile3} />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={gridSpacing}>
                                    <Grid item xs={12}>
                                        <Grid container alignItems="center" spacing={gridSpacing}>
                                            <Grid item sm zeroMinWidth>
                                                <Typography variant="body2">Quartile 02</Typography>
                                            </Grid>
                                            <RenderVisual val={obj.quartile2} color="secondary" max={obj.quartile3} />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={gridSpacing}>
                                    <Grid item xs={12}>
                                        <Grid container alignItems="center" spacing={gridSpacing}>
                                            <Grid item sm zeroMinWidth>
                                                <Typography variant="body2">Quartile 03</Typography>
                                            </Grid>
                                            <RenderVisual val={obj.quartile3} color="primary" max={obj.quartile3} />
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </>
                    ) : (
                        <>
                            <PerfectScrollbar style={{ height: "280px" }}>
                                <Grid item xs={12}>
                                    <Grid container spacing={gridSpacing} justifyContent="space-between">
                                        {obj.distinctValues && distinctValuesObject ? (
                                            Object.entries(distinctValuesObject).map(([key, value], index) => (
                                                <Grid item xs={12} sm={12} lg={6} key={index}>
                                                    <Grid container alignItems="center" spacing={gridSpacing}>
                                                        <Grid item sm zeroMinWidth>
                                                            <Typography variant="body2">{key.trim().toUpperCase()}</Typography>
                                                        </Grid>
                                                        <RenderVisual val={Number(value)} color="primary" />
                                                    </Grid>
                                                </Grid>
                                            ))
                                        ) : (
                                            <></>
                                        )}
                                    </Grid>
                                </Grid>
                            </PerfectScrollbar>
                        </>
                    )}
                </>
            ) : (
                <Typography>Null</Typography>
            )}
        </div>
    );
};

MeanModeList.propTypes = {
    obj: PropTypes.object,
    height: PropTypes.string
};
export default MeanModeList;
