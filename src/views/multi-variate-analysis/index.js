import React, { useState, useEffect } from "react";
// import axios from "axios";
import MainCard from "views/new-app/components/basic/cards/MainCard";
import SubCard from "ui-component/cards/SubCard";
import FormArea from "views/new-app/components/FormArea";
import PublishToDashboardForm from "views/new-app/components/basic/PublishToDashboardForm";
import { useSelector } from "store";
import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import {
    getMultiVariate,
    // GetAccessToken,
    GetJWT,
    renderStreamingMultiVariateChart,
    renderNonStreamingMultiVariateChart
    // pyServiceIp,
    // mulVariatePort
} from "views/api-configuration/default";
// import { Typography, Grid } from "@mui/material";
import { Grid } from "@mui/material";
import api from "views/api-configuration/api";

function MultiVariateIframe({ productclientdsid, multivariateid, tableid, themetype, charttype, viewname, mode }) {
    return (
        <Grid item xs={12} key={multivariateid}>
            <SubCard>
                <Grid item xs={12} sm={12} md={12}>
                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                        <FormArea
                            form={
                                <PublishToDashboardForm
                                    functionname="MULTIVARIATE"
                                    referenceid={multivariateid}
                                    tableid={tableid}
                                    componentDisplayType="MULTIVARIATE VISUAL"
                                />
                            }
                            btnTitle="Publish"
                        />
                    </div>
                </Grid>
                {mode?.type === "STREAMING_FILTER" ? (
                    <iframe
                        src={`${renderStreamingMultiVariateChart(multivariateid, themetype, charttype, viewname)}${GetJWT()}`}
                        title={`multi-variate-analysis-${productclientdsid}-${multivariateid}`}
                        width="100%"
                        height="450"
                        style={{ border: "0px" }}
                    />
                ) : (
                    <iframe
                        src={`${renderNonStreamingMultiVariateChart(multivariateid, themetype, charttype, viewname)}${GetJWT()}`}
                        title={`multi-variate-analysis-${productclientdsid}-${multivariateid}`}
                        width="100%"
                        height="450"
                        style={{ border: "0px" }}
                    />
                )}
            </SubCard>
        </Grid>
    );
}

MultiVariateIframe.propTypes = {
    productclientdsid: PropTypes.string,
    multivariateid: PropTypes.string,
    tableid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    themetype: PropTypes.string,
    charttype: PropTypes.string,
    viewname: PropTypes.string,
    mode: PropTypes.object
};

function MultiVariateAnalysis() {
    // const { rawDataSources } = useSelector((state) => state.dataCollection);
    const { datasetFiltersConfig } = useSelector((state) => state.globe);
    const [data, setData] = useState([]);
    // const { userRoleDataSets, selectedDataset, userInstance } = useSelector((state) => state.userLogin);
    const { selectedDataset } = useSelector((state) => state.userLogin);

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

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await api.get(getMultiVariate(selectedDataset.productclientdatasetsid));
                const responseData = response.data.result;

                const iframes = (
                    <Grid container spacing={2}>
                        {responseData.map((item) => (
                            <MultiVariateIframe
                                key={`iframe-${item.productclientdatasetsid}-${item.multivariateid}`}
                                productclientdsid={item.productclientdatasetsid}
                                multivariateid={item.multivariateid}
                                tableid={item.tableid}
                                themetype={themetype}
                                charttype={item.charttype}
                                viewname={item.viewname}
                                mode={datasetFiltersConfig}
                            />
                        ))}
                    </Grid>
                );

                setData(iframes);
            } catch (err) {
                console.error("Error", err);
            }
        }

        fetchData();
    }, []);

    return <MainCard title="Multivariate Analysis">{data}</MainCard>;
}

export default MultiVariateAnalysis;
