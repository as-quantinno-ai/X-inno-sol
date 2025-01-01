import React, { useState } from "react";
import { GetJWT, pyServiceIp, mulVariatePort } from "views/api-configuration/default";
import MainCard from "views/new-app/components/basic/cards/MainCard";
import { useTheme } from "@mui/material/styles";
import { useSelector } from "store";
import { Select, MenuItem } from "@mui/material";

export function BiVariateAnalysis() {
    const { rawDataSources } = useSelector((state) => state.dataCollection);
    const [dsid, setDsid] = useState(null);
    const [taid, setTaid] = useState(null);
    const [viewname, setViewname] = useState(null);
    const [iframeSource, setIFrameSource] = useState(null);

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

    const visualizationToolkit = {
        multiTracedHorizontalBarChart: () =>
            `/multicallback-component?theme=${themetype}&prodclidsid=${dsid}&tid=${taid}&viewname=${viewname}&jwt=${GetJWT()}`,
        conversionFunnelChart: () =>
            `/conversion-funnel-chart?theme=${themetype}&prodclidsid=${dsid}&tid=${taid}&viewname=${viewname}&jwt=${GetJWT()}`,
        lineChart: () => `/rs-line-chart?theme=${themetype}&prodclidsid=${dsid}&tid=${taid}&viewname=${viewname}&jwt=${GetJWT()}`,
        barChart: () => `/rs-bar-chart?theme=${themetype}&prodclidsid=${dsid}&tid=${taid}&viewname=${viewname}&jwt=${GetJWT()}`,
        scatterChart: () => `/rs-scatter-chart?theme=${themetype}&prodclidsid=${dsid}&tid=${taid}&viewname=${viewname}&jwt=${GetJWT()}`,
        boxChart: () => `/rs-box-chart?theme=${themetype}&prodclidsid=${dsid}&tid=${taid}&viewname=${viewname}&jwt=${GetJWT()}`,
        candleStickChart: () =>
            `/rs-candlestick-chart?theme=${themetype}&prodclidsid=${dsid}&tid=${taid}&viewname=${viewname}&jwt=${GetJWT()}`,
        distChart: () => `/rs-dist-plot?theme=${themetype}&prodclidsid=${dsid}&tid=${taid}&viewname=${viewname}&jwt=${GetJWT()}`,
        groupedBarChart: () =>
            `/rs-grouped-bar-chart?theme=${themetype}&prodclidsid=${dsid}&tid=${taid}&viewname=${viewname}&jwt=${GetJWT()}`,
        scatterChartByCategory: () =>
            `/rs-scatter-chart-by-category?theme=${themetype}&prodclidsid=${dsid}&tid=${taid}&viewname=${viewname}&jwt=${GetJWT()}`,
        scatterPlotWithTrendline: () =>
            `/rs-scatter-plot-with-trendline?theme=${themetype}&prodclidsid=${dsid}&tid=${taid}&viewname=${viewname}&jwt=${GetJWT()}`,
        overlayBarChart: () =>
            `/rs-overlay-bar-chart?theme=${themetype}&prodclidsid=${dsid}&tid=${taid}&viewname=${viewname}&jwt=${GetJWT()}`,
        lineAndAreaChart: () =>
            `/rs-line-and-area-chart?theme=${themetype}&prodclidsid=${dsid}&tid=${taid}&viewname=${viewname}&jwt=${GetJWT()}`,
        horizontalBarChartCategorical: () =>
            `/rs-horizontal-bar-chart-categorical?theme=${themetype}&prodclidsid=${dsid}&tid=${taid}&viewname=${viewname}&jwt=${GetJWT()}`,
        horizontalBarChartCategoricalVsCategorical: () =>
            `/rs-horizontal-bar-chart-categorical-vs-categorical?theme=${themetype}&prodclidsid=${dsid}&tid=${taid}&viewname=${viewname}&jwt=${GetJWT()}`,
        barChartMeanStandardError: () =>
            `/rs-bar-chart-mean-error?theme=${themetype}&prodclidsid=${dsid}&tid=${taid}&viewname=${viewname}&jwt=${GetJWT()}`,
        multiTracedMeanStandardErrorBarChart: () =>
            `/multi-traced-mean-standard-error-bar-graph?theme=${themetype}&prodclidsid=${dsid}&tid=${taid}&viewname=${viewname}&jwt=${GetJWT()}`,
        multiTracedHorizontalLineChart: () =>
            `/multitraced_horizontal_line_chart?theme=${themetype}&prodclidsid=${dsid}&tid=${taid}&viewname=${viewname}&jwt=${GetJWT()}`,
        multiTracedCategoricalBarChart: () =>
            `/multi-traced-categorical-bar-chart?theme=${themetype}&prodclidsid=${dsid}&tid=${taid}&viewname=${viewname}&jwt=${GetJWT()}`,
        biVariate: () => `/bivariate-analysis?theme=${themetype}&prodclidsid=${dsid}&tid=${taid}&jwt=${GetJWT()}`
    };

    const changeCatalog = (e) => {
        setDsid(e.target.value.productclientdatasetsid);
        setTaid(e.target.value.tableid);
        setViewname(e.target.value.viewname);
    };

    const changeChartType = (e) => {
        setIFrameSource(`http://${pyServiceIp}:${mulVariatePort}${visualizationToolkit[e.target.value]()}`);
    };

    return (
        <MainCard>
            <Select
                name="catalog"
                placeholder="Select Data Domain"
                onChange={changeCatalog}
                style={{ width: "100%", marginTop: "5px", padding: "0px" }}
            >
                <MenuItem value="">---------------------</MenuItem>
                {rawDataSources?.map((item, ind) => (
                    <MenuItem key={ind} value={item}>
                        {item.tablename}
                    </MenuItem>
                ))}
            </Select>{" "}
            <Select
                name="chart_type"
                placeholder="Select Chart Type"
                onChange={changeChartType}
                style={{ width: "100%", marginTop: "5px", padding: "0px" }}
                MenuProps={{
                    style: { maxHeight: 350 },
                    PaperProps: {
                        style: { maxHeight: 350 }
                    }
                }}
            >
                <MenuItem value="biVariateAnalysisChart">BiVariate Analysis</MenuItem>
                <MenuItem value="multiTracedHorizontalBarChart">Multi Traced Horizontal Bar Chart</MenuItem>
                <MenuItem value="conversionFunnelChart">Conversion Funnel Chart</MenuItem>
                <MenuItem value="lineChart">Line Chart</MenuItem>
                <MenuItem value="barChart">Bar Chart</MenuItem>
                <MenuItem value="scatterChart">Scatter Chart</MenuItem>
                <MenuItem value="boxChart">Box Chart</MenuItem>
                <MenuItem value="candleStickChart">CandleStick Chart</MenuItem>
                <MenuItem value="distChart">Dist Plot</MenuItem>
                <MenuItem value="groupedBarChart">Grouped Bar Chart</MenuItem>
                <MenuItem value="scatterChartByCategory">Scatter Chart (By Category)</MenuItem>
                <MenuItem value="scatterPlotWithTrendline">Scatter Chart (With Trendline)</MenuItem>
                <MenuItem value="overlayBarChart">Overlay Bar Chart</MenuItem>
                <MenuItem value="lineAndAreaChart">Line and Area Chart</MenuItem>
                <MenuItem value="horizontalBarChartCategorical">Horizontal Bar Chart (Categorical)</MenuItem>
                <MenuItem value="barChartMeanStandardError">Bar Chart (Mean and Standard Error)</MenuItem>
                <MenuItem value="horizontalBarChartCategoricalVsCategorical">Horizontal Bar Chart (Categorical vs Categorical)</MenuItem>
                <MenuItem value="multiTracedMeanStandardErrorBarChart">Multi Traced Mean Standard Error Bar Chart</MenuItem>
                <MenuItem value="multiTracedHorizontalLineChart">Multi Traced Horizontal Line Chart</MenuItem>
                <MenuItem value="multiTracedCategoricalBarChart">Multi Traced Categorical Bar Chart</MenuItem>
                <MenuItem value="biVariate">Bi Variate</MenuItem>
            </Select>{" "}
            <iframe src={iframeSource} title="bi-variate-analysis" width="100%" height="650" style={{ border: "0px" }} />
        </MainCard>
    );
}

export default BiVariateAnalysis;
