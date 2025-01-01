/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import { useFetch } from "react-async";
import { useSelector } from "store";
import { useTheme } from "@mui/material/styles";
import {
    dashChartUrl,
    getMlModelCummulativeDataByModelId,
    GetJWT,
    renderRecordLevelCharts,
    renderStreamingMultiVariateChart,
    renderNonStreamingMultiVariateChart,
    retrieveCustomFormRecord,
    createCustomFormRefreshBronzeView
} from "views/api-configuration/default";
import api from "views/api-configuration/api";
import TotalIncomeDarkCard from "views/new-app/components/basic/TotalIncomeDarkCard";
import { Grid, TextField, FormControl, FormLabel, IconButton, Box, Tooltip } from "@mui/material";
import FeaturedDataTable from "views/new-app/components/basic/FeaturedDataTable";
import QueryBasedTables from "views/new-app/components/basic/QueryBasedTables";
import StreamingBasedTables from "views/new-app/components/basic/StreamingBasedTables";
// import { AddCircleOutlined, DeleteOutline, FormatListBulletedOutlined } from "@mui/icons-material";
import { DeleteOutline } from "@mui/icons-material";
import RoleBasedHOC from "authorization-hocs/RoleBasedHOC";
import FormArea from "views/new-app/components/FormArea";
import ButtonsForm from "views/new-app/components/basic/ButtonsForm";
import QueryBasedCustomForm from "views/new-app/components/QueryBasedCustomForm";
import PerfectScrollbar from "react-perfect-scrollbar";
import PropTypes from "prop-types";
// ================================|| UI TABS - COLOR ||================================ //

function chartDisplayTypeToChartGenerateType(cdt) {
    let generteType = "";
    if (cdt === "Line Chart") generteType = "line";
    else if (cdt === "Bar Chart") generteType = "bar";
    else if (cdt === "Area Chart") generteType = "area";
    else if (cdt === "Pie Chart") generteType = "pie";
    else if (cdt === "Column Chart") generteType = "col";
    else if (cdt === "Doughnut Chart") generteType = "donut";
    else if (cdt === "Semi Doughnut Chart") generteType = "semi-donut";
    else if (cdt === "Radial Chart") generteType = "radial";
    else if (cdt === "Box Chart") generteType = "box";
    else if (cdt === "Gauge Chart") generteType = "gauge";
    else if (cdt === "Polar Chart") generteType = "polar";
    else if (cdt === "Scatter Chart") generteType = "scatter";
    else if (cdt === "Tree Chart") generteType = "tree";
    return generteType;
}

const DetailsCard = ({ obj }) => {
    const { data, error } = useFetch(`${getMlModelCummulativeDataByModelId(obj[0].referenceid)}`, {
        headers: { accept: "application/json", Authorization: `Bearer ${GetJWT()}` }
    });
    if (error) return error.message;
    if (data) {
        const modelRunDetails = data.result[0].mlModelRun.filter((mlRunObj) => mlRunObj.stepCd === "RUN");
        return (
            <>
                {modelRunDetails ? (
                    <Grid container spacing={1}>
                        <Grid item lg={3} md={3}>
                            <TotalIncomeDarkCard title="Accuracy" value={modelRunDetails[0].modelRunDetailsObj.accuracy} />
                        </Grid>
                        <Grid item lg={3} md={3}>
                            <TotalIncomeDarkCard title="Preision" value={modelRunDetails[0].modelRunDetailsObj.weightedPrecision} />
                        </Grid>
                        <Grid item lg={3} md={3}>
                            <TotalIncomeDarkCard title="F1" value={modelRunDetails[0].modelRunDetailsObj.f1} />
                        </Grid>
                        <Grid item lg={3} md={3}>
                            <TotalIncomeDarkCard title="Recall" value={modelRunDetails[0].modelRunDetailsObj.weightedRecall} />
                        </Grid>
                    </Grid>
                ) : (
                    <></>
                )}
            </>
        );
    }
    return null;
};

DetailsCard.protoType = {
    obj: PropTypes.any
};

const PredictionDetailsGrid = ({ obj, recId }) => {
    const [columns, setColumns] = useState([]);
    const [transformedData, setTransformedData] = useState([]);

    const refreshBronzeView = async () => {
        try {
            // eslint-disable-next-line no-unused-vars
            const res = await api.put(`${createCustomFormRefreshBronzeView(obj[0].productclientdatasetsid, obj[0].tableid)}`);
        } catch (error) {
            console.error("Error refreshing bronze view:", error);
        }
    };

    refreshBronzeView();

    useEffect(() => {
        const apiUrl = retrieveCustomFormRecord();
        const RequestBody = {
            productclientdatasetsid: obj[0].productclientdatasetsid,
            uuid: recId,
            viewname: obj[0].viewname
        };

        const fetchData = async () => {
            try {
                const res = await api.post(apiUrl, RequestBody, {
                    headers: { accept: "application/json", Authorization: `Bearer ${GetJWT()}` }
                });
                const data = JSON.parse(res.data.data);

                if (data && data.length > 0) {
                    // Extract the columns from the keys of the first object
                    let cols = Object.keys(data[0]);
                    const substringsToRemove = [
                        "uuid_identifier_da_an_v1",
                        "status_identifier_da_an_v1",
                        "topic_name_xan",
                        "partition_msg_xan",
                        "offset_msg_xan"
                    ];
                    cols = cols.filter((item) => !substringsToRemove.some((substring) => item.includes(substring)));

                    setColumns(cols);

                    const transformed = data.map((item) => cols.map((column) => item[column]));
                    setTransformedData(transformed);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [obj, recId]);

    return (
        <div style={{ height: "800px" }}>
            <PerfectScrollbar>
                {columns.map((column, index) => {
                    const value = transformedData[0] && transformedData[0][index];
                    // const isLongText = typeof value === "string" && value.split(" ").length > 10;
                    return (
                        <FormControl fullWidth key={index}>
                            <FormLabel sx={{ marginTop: "15px", color: "black", paddingLeft: "10px" }}>{column}</FormLabel>

                            <TextField
                                value={value}
                                variant="outlined"
                                multiline
                                disabled
                                sx={{ color: "black", padding: "5px", height: "auto" }}
                                fullWidth
                            />
                        </FormControl>
                    );
                })}
            </PerfectScrollbar>
        </div>
    );
};

PredictionDetailsGrid.propTypes = {
    obj: PropTypes.any,
    recId: PropTypes.string
};

function SwitchDashboardGrids({ data, height, title }) {
    const { datasetFiltersConfig } = useSelector((state) => state.globe);
    let component = <></>;
    if (datasetFiltersConfig?.type === "CONFIG_FILTER") {
        component = (
            <FeaturedDataTable
                componentDataId={data.componentdataid}
                type="raw"
                dashDatasetId={data.productclientdatasetsid}
                dashTableId={data.tableid}
                onDashboard="yes"
                formTitle={title}
            />
        );
    } else if (datasetFiltersConfig?.type === "QUERY_FILTER") {
        component = (
            <QueryBasedTables
                data={data}
                componentDataId={data.componentdataid}
                dashDatasetId={data.productclientdatasetsid}
                refrenceId={data.referenceid}
                height={height}
                dashTableId={data.tableid}
                formTitle={title}
            />
        );
    } else if (datasetFiltersConfig?.type === "STREAMING_FILTER") {
        component = (
            <StreamingBasedTables
                componentDataId={data.componentdataid}
                dashDatasetId={data.productclientdatasetsid}
                dashTableId={data.tableid}
                viewName={data.viewname}
            />
        );
    }
    return component;
}

SwitchDashboardGrids.propTypes = {
    data: PropTypes.oneOfType([PropTypes.object, PropTypes.arrayOf(PropTypes.object)]),
    height: PropTypes.string,
    title: PropTypes.string
};

function RenderGrid({ data, height, title }) {
    // const { datasetFiltersConfig } = useSelector((state) => state.globe);

    if (!data || data.length === 0) return null;

    const { functionname, componentdataid, productclientdatasetsid, tableid, referenceid } = data[0];
    /* eslint-disable */
    switch (functionname) {
        case "RAW-DATA-GRID":
            return <SwitchDashboardGrids data={data[0]} height={height} title={title} />;

        case "FEATURE-DATA-GRID":
            return (
                <FeaturedDataTable
                    componentDataId={componentdataid}
                    type="feature"
                    dashDatasetId={productclientdatasetsid}
                    dashTableId={tableid}
                    onDashboard="yes"
                    formTitle={title}
                />
            );

        default:
            return (
                <FeaturedDataTable
                    componentDataId={componentdataid}
                    mlmodelRefId={referenceid}
                    type="mlmodel"
                    onDashboard="yes"
                    formTitle={title}
                />
            );
    }
}
/* eslint-enable */

RenderGrid.propTypes = {
    data: PropTypes.oneOfType([PropTypes.object, PropTypes.arrayOf(PropTypes.object)]),
    height: PropTypes.string,
    title: PropTypes.string
};

// function DashChart({ data, dataDetails, height, title, uuid }) {
function DashChart({ data, height, title, uuid }) {
    const { datasetFiltersConfig } = useSelector((state) => state.globe);
    const { selectedDataset } = useSelector((state) => state.userLogin);
    const { publishedMlModel } = useSelector((state) => state.globe);

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

    let component = <></>;
    if (data.length !== 0) {
        if (data[0].componentDisplayType === "GRID") {
            component = (
                <>
                    <Box
                        sx={{
                            height: "100%",
                            "&:hover .role-based-hoc": {
                                opacity: 1,
                                transform: "translateY(0)",
                                transition: "opacity 0.3s ease, transform 0.3s ease"
                            }
                        }}
                    >
                        <RoleBasedHOC allowedRoles={["TENANT_ADMIN"]}>
                            <Box
                                className="role-based-hoc"
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                                sx={{
                                    position: "absolute",
                                    top: -1,
                                    left: "40%",
                                    width: "150px",
                                    height: "6%",
                                    borderRadius: "8px",
                                    alignItems: "center",
                                    opacity: 0,
                                    transform: "translateY(20px)",
                                    transition: "opacity 0.3s ease, transform 0.3s ease",
                                    display: "flex",
                                    justifyContent: "center",
                                    backgroundColor: theme.palette.secondary.light,
                                    zIndex: 50,
                                    overflow: "visible"
                                }}
                            >
                                <Box
                                    display="flex"
                                    justifyContent="center"
                                    alignItems="center"
                                    sx={{
                                        width: "10%",
                                        padding: "5px",
                                        borderRadius: "8px"
                                    }}
                                >
                                    <FormArea
                                        form={<QueryBasedCustomForm componentDataId={data[0].componentdataid} />}
                                        icon="true"
                                        actionType="FormatListBulletedOutlined"
                                        btnTitle="Attach Form"
                                    />

                                    <FormArea
                                        form={
                                            <ButtonsForm
                                                datasetid={data[0].productclientdatasetsid}
                                                componentdataid={data[0].componentdataid}
                                                tableid={data[0].tableid}
                                                tablename={title}
                                            />
                                        }
                                        btnTitle="Add Custom Button"
                                        icon="true"
                                        actionType="AddCircleOutlined"
                                    />

                                    <Tooltip title="Delete">
                                        <IconButton onClick={() => console.log("Delete action")}>
                                            <DeleteOutline />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            </Box>
                        </RoleBasedHOC>

                        <RenderGrid data={data} height={height} title={title} />
                    </Box>
                </>
            );
        } else if (data[0].componentDisplayType === "DETAILS-GRID") {
            component = (
                <PerfectScrollbar component="div" style={{ height: "80%", overflow: "auto" }}>
                    <PredictionDetailsGrid obj={data} recId={uuid} />
                </PerfectScrollbar>
            );
        } else if (data[0].componentDisplayType === "COMMULATIVE BAR CHART") {
            component = (
                <iframe
                    src={`${dashChartUrl}prediction-summary-cummulative?mlModelRunId=${
                        publishedMlModel?.mlmodelRuns?.mlmodelrunsid
                    }&height=200&width=200&theme=${themetype}&jwt=${GetJWT()}`}
                    title="something"
                    width="100%"
                    height={Number(height.replace("px", "") - 60)}
                    style={{ border: "none" }}
                />
            );
            // component = <TotalGrowthBarChart isLoading={false} mlRunId={41} />;
        } else if (data[0].componentDisplayType === "COMMULATIVE PIE CHART") {
            component = (
                <iframe
                    src={`${dashChartUrl}total-patients-heart-count/?height=300&width=300&theme=${themetype}&jwt=${GetJWT()}`}
                    title="something"
                    width="100%"
                    height={Number(height.replace("px", "") - 60)}
                    style={{ border: "none" }}
                />
            );
        } else if (data[0].componentDisplayType === "MODEL DETAILS") {
            component = <DetailsCard obj={data} />;
        } else if (data[0].componentDisplayType === "MULTIVARIATE VISUAL") {
            if (datasetFiltersConfig?.type === "STREAMING_FILTER") {
                component = (
                    <iframe
                        src={`${renderStreamingMultiVariateChart(
                            data[0].referenceid,
                            themetype,
                            data[0].chartType,
                            data[0].viewname
                        )}${GetJWT()}&height=${Number(height.replace("px", "") - 200)}`}
                        title="multi-variate-analysis"
                        width="100%"
                        height={Number(height.replace("px", "") - 60)}
                        style={{ border: "0px" }}
                    />
                );
            } else {
                component = (
                    <iframe
                        src={`${renderNonStreamingMultiVariateChart(
                            data[0].referenceid,
                            themetype,
                            data[0].chartType,
                            data[0].viewname
                        )}${GetJWT()}&height=${Number(height.replace("px", "") - 200)}`}
                        title="multi-variate-analysis"
                        width="100%"
                        height={Number(height.replace("px", "") - 60)}
                        style={{ border: "0px" }}
                    />
                );
            }
        } else if (data[0].componentDisplayType === "RECORD VISUAL") {
            component = (
                <iframe
                    src={`${renderRecordLevelCharts(
                        data[0].productclientdatasetsid,
                        data[0].referenceid,
                        themetype,
                        data[0].chartType,
                        data[0].viewname,
                        data[0].tableid,
                        uuid,
                        200
                    )}${GetJWT()}&height=${Number(height.replace("px", "") - 100)}`}
                    title="record-level-visuals"
                    width="100%"
                    height={Number(height.replace("px", "") - 60)}
                    style={{ border: "0px" }}
                />
            );
        } else {
            component = (
                <>
                    {" "}
                    <iframe
                        src={`${dashChartUrl}single-variate-${chartDisplayTypeToChartGenerateType(
                            data[0].componentDisplayType
                        )}-chart?datasetid=${data[0].productclientdatasetsid}&tableid=${data[0].tableid}&attributeid=${
                            data[0].referenceid
                        }&theme=${themetype}&param=A&width=300&height=${Number(height.replace("px", "") - 100)}&perm=${
                            selectedDataset.userroledatasetid === 5 ? "allow" : "notallow"
                        }&jwt=${GetJWT()}`}
                        title="something"
                        width="100%"
                        height={Number(height.replace("px", "") - 60)}
                        style={{ border: "none" }}
                    />
                </>
            );
        }
    }

    return component;
}
// ================================|| UI TABS - COLOR ||================================ //

DashChart.propTypes = {
    data: PropTypes.oneOfType([PropTypes.object, PropTypes.arrayOf(PropTypes.object)]),
    height: PropTypes.string,
    title: PropTypes.string,
    uuid: PropTypes.string
};
export default DashChart;
