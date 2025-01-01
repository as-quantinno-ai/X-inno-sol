import React, { useState, useEffect } from "react";
import { Grid, Select, MenuItem, InputLabel, CardActions, Divider, Skeleton, FormControl } from "@mui/material";
import MainCard from "ui-component/cards/MainCard";
// import PropTypes from "prop-types";
// Material UI
import { useTheme } from "@mui/material/styles";
// import axios from "axios";
import {
    // createCustomDashboardComponentData,
    getCustomDashboard,
    dashChartUrl,
    GetJWT,
    GetAccessToken
} from "views/api-configuration/default";
// import { openSnackbar } from "store/slices/snackbar";
// import { useDispatch, useSelector } from "store";
import { useSelector } from "store";
import Loading from "views/components/Loading";
// import { getDashboardFeatureVisualList, getDashboardRawVisualList } from "store/slices/app-dashboard";
import FormArea from "views/new-app/components/FormArea";
import PublishToDashboardForm from "../new-app/components/basic/PublishToDashboardForm";
import api from "views/api-configuration/api";
import PropTypes from "prop-types";
// import { height } from "@mui/system";
export function chartDisplayTypeToChartGenerateType(cdt) {
    let generteType = "";
    if (cdt === "Line Chart") generteType = "line";
    else if (cdt === "Bar Chart") generteType = "bar";
    else if (cdt === "Area Chart") generteType = "area";
    else if (cdt === "Pie Chart") generteType = "pie";
    else if (cdt === "Column Chart") generteType = "col";
    else if (cdt === "Doughnut Chart") generteType = "donut";
    else if (cdt === "Semi Doughnut Chart") generteType = "semidonut";
    else if (cdt === "Radial Chart") generteType = "radial";
    else if (cdt === "Box Chart") generteType = "box";
    else if (cdt === "Gauge Chart") generteType = "gauge";
    else if (cdt === "Polar Chart") generteType = "polar";
    else if (cdt === "Scatter Chart") generteType = "scatter";
    else if (cdt === "Tree Chart") generteType = "tree";
    return generteType;
}

const chartTypes = [
    "Line Chart",
    "Bar Chart",
    "Column Chart",
    "Pie Chart",
    "Doughnut Chart",
    "Radial Chart",
    "Area Chart",
    "Polar Chart",
    "Box Chart",
    "Tree Chart",
    "Semi Doughnut Chart",
    "Gauge Chart"
];

const biChartTypes = ["Line Chart", "Bar Chart", "Area Chart", "Scatter Chart"];

const DynamicDashChart = ({
    dsid,
    taid,
    attid,
    ct,
    attName,
    functionname,
    onDashboard,
    mlModelRunId,
    state,
    type,
    board,
    // bivaraintAnalysisData,
    height = "300px"
}) => {
    const [ChartTypeSelection, setChartTypeSelection] = useState(ct || type);
    // const [ScreenId, setScreenId] = useState(0);
    // eslint-disable-next-line no-unused-vars
    const [LayoutId, setLayoutId] = useState(0);
    // const [chck, setChck] = useState("M");
    // eslint-disable-next-line no-unused-vars
    const [loading, setLoading] = useState(false);
    // const dispatch = useDispatch();
    const { selectedDataset } = useSelector((state) => state.userLogin);
    // eslint-disable-next-line no-unused-vars
    const [dashboardScreens, setDashboardScreens] = useState(null);

    // const [setDashboardScreens] = useState(null);
    // const [error, setError] = useState(null);

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
        api.get(`${getCustomDashboard}${selectedDataset.productclientdatasetsid}`, { headers: GetAccessToken() }).then((res) =>
            setDashboardScreens(res.data.result)
        );
    }, []);

    // useEffect(() => {
    //     alert(LayoutId);
    // }, [LayoutId]);
    // const onScreenChange = (e) => {
    //     setScreenId(e.target.value);
    // };

    // const onLayoutIdChange = (val) => {
    //     setLayoutId(val);
    // };

    // const DashboardVisualPostReqUpdate = (data) => {
    //     axios
    //         // .post(dashboardPost, data)
    //         .post(createCustomDashboardComponentData, data)
    //         .then((response) => {
    //             dispatch(getDashboardRawVisualList(selectedDataset.productclientdatasetsid));
    //             dispatch(getDashboardFeatureVisualList(selectedDataset.productclientdatasetsid));
    //             dispatch(
    //                 openSnackbar({
    //                     open: true,
    //                     message: "Dashboard Visual Published Successfully",
    //                     variant: "alert",
    //                     alert: {
    //                         color: "success"
    //                     },
    //                     close: false
    //                 })
    //             );
    //         })
    //         .catch((response) => {
    //             dispatch(
    //                 openSnackbar({
    //                     open: true,
    //                     message: "Dashboard Visual Published Failed",
    //                     variant: "alert",
    //                     alert: {
    //                         color: "error"
    //                     },
    //                     close: false
    //                 })
    //             );
    //             return response;
    //         });
    // };

    // const changeChartChckSelection = (e) => {
    //     setChck(e.target.value);
    // };

    const changeChartTypeSelection = (e) => {
        setChartTypeSelection(e.target.value);
    };

    // const changeLayoutId = (e) => {
    //     setLayoutId(e.target.value);
    // };

    useEffect(() => {}, [ChartTypeSelection]);
    // const [update, setUpdate] = useState(0);

    // const styles = JSXStyles();
    // Websocket implementation
    // const onConnected = () => {
    //     console.log("Connected!!");
    // };

    // const onMessageReceived = (msg) => {
    //     // Update the global dashboard state on every socket call
    //     setUpdate(update + 1);
    // };

    return (
        <>
            {/* <SockJsClient
                url={SOCKET_URL}
                topics={[`${DashboardListner}`]}
                onConnect={onConnected}
                onDisconnect={console.log('Disconnected!')}
                onMessage={(msg) => onMessageReceived(msg)}
                debug={false}
            /> */}
            {loading ? <Loading /> : <></>}

            {/* <MainCard title={attName} style={{ height: mlModelRunId ? 'fit-content' : '100%' }}> */}
            {attName !== undefined ? (
                <MainCard
                    title={attName}
                    style={{
                        height: mlModelRunId || state === "BI" ? "fit-content" : "fit-content",
                        border: "1px"
                    }}
                >
                    {ct === undefined || ct === null || ChartTypeSelection ? (
                        <div
                            style={{
                                paddingBottom: "10px",
                                display: "flex",
                                justifyContent: "flex-start"
                            }}
                        >
                            {/* {screenLayouts ? screenLayouts.map((layout) => <>{layout.layoutid}</>) : <></>} */}
                            <FormControl
                                sx={{ minWidth: 120 }}
                                style={{
                                    width: "50%",
                                    marginTop: "0px",
                                    paddingLeft: "0px"
                                }}
                            >
                                <InputLabel id="data-source-select">Select Chart</InputLabel>
                                <Select
                                    labelId="data-source-select"
                                    id="data-source"
                                    name="data-source"
                                    defaultValue={type}
                                    label="Select Data Source"
                                    fullWidth
                                    onChange={changeChartTypeSelection}
                                    sx={{ minWidth: 120, height: 40 }}
                                >
                                    {mlModelRunId
                                        ? /*eslint-disable*/
                                          biChartTypes.map((item, ind) => (
                                              <MenuItem key={ind} value={item}>
                                                  {item}
                                              </MenuItem>
                                          ))
                                        : chartTypes.map((item, ind) => (
                                              <MenuItem key={ind} value={item}>
                                                  {item}
                                              </MenuItem>
                                          ))}
                                    /* eslint-enable*/
                                </Select>
                            </FormControl>
                        </div>
                    ) : (
                        <></>
                    )}
                    {onDashboard || mlModelRunId ? (
                        <></>
                    ) : (
                        <>
                            <Divider />
                            <CardActions style={{ paddingLeft: "0px", paddingRight: "0px", padding: "0px" }}>
                                <Grid container direction="row-reverse">
                                    <Grid item>
                                        {ct !== undefined ? (
                                            <FormArea
                                                form={
                                                    <PublishToDashboardForm
                                                        functionname={functionname}
                                                        referenceid={attid}
                                                        tableid={taid}
                                                        componentDisplayType={ct}
                                                    />
                                                }
                                                btnTitle="Publish"
                                            />
                                        ) : (
                                            <FormArea
                                                form={
                                                    <PublishToDashboardForm
                                                        functionname={functionname}
                                                        referenceid={attid}
                                                        tableid={taid}
                                                        componentDisplayType={ChartTypeSelection}
                                                    />
                                                }
                                                btnTitle="Publish"
                                            />
                                        )}
                                    </Grid>
                                </Grid>
                            </CardActions>{" "}
                        </>
                    )}
                    {ChartTypeSelection === undefined && <Skeleton variant="rectangular" height={200} />}
                    {ChartTypeSelection !== undefined && (
                        <>
                            {state === "BI" ? (
                                <>
                                    {/* <RenderBiVariantChart dsid={dsid} taid={taid} data={bivaraintAnalysisData} chartType={ct} /> */}
                                    <iframe
                                        src={`${dashChartUrl}single-variate-${chartDisplayTypeToChartGenerateType(
                                            ct
                                        )}-chart?datasetid=${dsid}&tableid=${taid}&attributeid=${attid}&param=A&width=300&height=200&theme=${themetype}&perm=${
                                            selectedDataset.userroledatasetid === 5 ? "allow" : "notallow"
                                        }&jwt=${GetJWT()}`}
                                        title="something"
                                        width="100%"
                                        height={Number(height.replace("px", "") - 60)}
                                        style={{ border: "none" }}
                                    />
                                </>
                            ) : (
                                // This one is for Uni Varaint Analysis Visuals
                                <iframe
                                    src={`${dashChartUrl}single-variate-${chartDisplayTypeToChartGenerateType(
                                        ChartTypeSelection
                                    )}-chart?datasetid=${dsid}&tableid=${taid}&attributeid=${attid}&param=A&width=300&height=${Number(
                                        height.replace("px", "") - 60
                                    )}&theme=${themetype}&perm=${
                                        selectedDataset.userroledatasetid === 5 ? "allow" : "notallow"
                                    }&jwt=${GetJWT()}`}
                                    title="something"
                                    width="100%"
                                    height={Number(height.replace("px", "") - 40)}
                                    style={{ border: "none" }}
                                />
                            )}
                        </>
                    )}
                </MainCard>
            ) : (
                <>
                    {/* <MainCard title={attName} style={{ height: mlModelRunId || state === 'BI' ? 'fit-content' : 'fit-content', border: '1px' }}> */}
                    <div style={{ paddingBottom: "10px", display: "flex", justifyContent: "space-between" }}>
                        {ct === undefined || ct === null ? (
                            <div style={{ paddingBottom: "10px", display: "flex", justifyContent: "space-between", background: "white" }}>
                                {/* {screenLayouts ? screenLayouts.map((layout) => <>{layout.layoutid}</>) : <></>} */}
                                <FormControl
                                    sx={{ minWidth: 120, background: "white", color: "white" }}
                                    style={{
                                        display: "block",
                                        width: "100%",
                                        marginTop: "0px",
                                        paddingLeft: "0px",
                                        marginLeft: "0px",
                                        background: "white"
                                    }}
                                >
                                    <InputLabel id="data-source-select">Select Chart</InputLabel>
                                    <Select
                                        labelId="data-source-select"
                                        id="data-source"
                                        name="data-source"
                                        defaultValue={type}
                                        label="Select Chart"
                                        fullWidth
                                        onChange={changeChartTypeSelection}
                                        sx={{ minWidth: 120, height: 50, background: "white", color: "white" }}
                                        MenuProps={{
                                            PaperProps: {
                                                style: {
                                                    maxHeight: 150
                                                }
                                            }
                                        }}
                                    >
                                        {mlModelRunId
                                            ? biChartTypes.map((item, ind) => (
                                                  <MenuItem key={ind} value={item}>
                                                      {item}
                                                  </MenuItem>
                                              ))
                                            : chartTypes.map((item, ind) => (
                                                  <MenuItem key={ind} value={item}>
                                                      {item}
                                                  </MenuItem>
                                              ))}
                                    </Select>
                                </FormControl>
                            </div>
                        ) : (
                            <></>
                        )}
                        {onDashboard || mlModelRunId ? (
                            <></>
                        ) : (
                            <>
                                <Divider />
                                <CardActions
                                    style={{
                                        paddingLeft: "0px",
                                        paddingRight: "0px",
                                        padding: "0px",
                                        marginTop: board === "dataDiscovery" ? "-20px" : "2px"
                                    }}
                                >
                                    <Grid container direction="row-reverse">
                                        <Grid item>
                                            {ct !== undefined ? (
                                                <FormArea
                                                    form={
                                                        <PublishToDashboardForm
                                                            functionname={functionname}
                                                            referenceid={attid}
                                                            tableid={taid}
                                                            componentDisplayType={ct}
                                                        />
                                                    }
                                                    btnTitle="Publish"
                                                />
                                            ) : (
                                                <FormArea
                                                    form={
                                                        <PublishToDashboardForm
                                                            functionname={functionname}
                                                            referenceid={attid}
                                                            tableid={taid}
                                                            componentDisplayType={ChartTypeSelection}
                                                        />
                                                    }
                                                    btnTitle="Publish"
                                                />
                                            )}
                                        </Grid>
                                    </Grid>
                                </CardActions>
                            </>
                        )}
                    </div>

                    {ChartTypeSelection === undefined && <Skeleton variant="rectangular" height={200} />}
                    {ChartTypeSelection !== undefined && (
                        <>
                            {" "}
                            {state === "BI" ? (
                                <>
                                    {/* <RenderBiVariantChart dsid={dsid} taid={taid} data={bivaraintAnalysisData} chartType={ct} /> */}
                                    <iframe
                                        src={`${dashChartUrl}single-variate-${chartDisplayTypeToChartGenerateType(
                                            ct
                                        )}-chart?datasetid=${dsid}&tableid=${taid}&attributeid=${attid}&param=A&width=800&height=200&theme=${themetype}&perm=${
                                            selectedDataset.userroledatasetid === 5 ? "allow" : "notallow"
                                        }&jwt=${GetJWT()}`}
                                        title="something"
                                        width="100%"
                                        height={Number(height.replace("px", "") - 60)}
                                        style={{ border: "none" }}
                                    />
                                </>
                            ) : (
                                // This one is for Uni Varaint Analysis Visuals
                                <div style={{ overflow: "auto", maxHeight: "800px", maxWidth: "800px", minWidth: "300px" }}>
                                    <iframe
                                        src={`${dashChartUrl}single-variate-${chartDisplayTypeToChartGenerateType(
                                            ct || ChartTypeSelection
                                        )}-chart?datasetid=${dsid}&tableid=${taid}&attributeid=${attid}&param=A&width=300&height=${Number(
                                            height.replace("px", "") - 60
                                        )}&theme=${themetype}&perm=${
                                            selectedDataset.userroledatasetid === 5 ? "allow" : "notallow"
                                        }&jwt=${GetJWT()}`}
                                        title="something"
                                        width="800"
                                        height={Number(height.replace("px", "") - 50)}
                                        style={{ border: "none" }}
                                    />
                                </div>
                            )}
                        </>
                    )}
                </>
            )}
        </>
    );
};

DynamicDashChart.propTypes = {
    // Props
    dsid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    taid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    attid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    ct: PropTypes.string,
    attName: PropTypes.string,
    functionname: PropTypes.string,
    onDashboard: PropTypes.bool,
    mlModelRunId: PropTypes.string,
    state: PropTypes.string,
    type: PropTypes.string,
    board: PropTypes.string,
    height: PropTypes.string
    // End Props
};
export default DynamicDashChart;
