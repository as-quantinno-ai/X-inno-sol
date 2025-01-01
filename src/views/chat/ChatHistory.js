import PropTypes from "prop-types";
import React, { useCallback, useEffect, useRef, useState } from "react";
import logo from "../../assets/images/xtremelogoWBG.png";

// material-ui
import { Card, CardContent, Grid, Typography, CircularProgress, IconButton, Select, MenuItem } from "@mui/material";
import AddchartIcon from "@mui/icons-material/Addchart";
// import { useDispatch, useSelector } from "store";
import { useSelector } from "store";
import MUIDataTable from "mui-datatables";

// project imports
import { gridSpacing } from "store/constant";
import { truncateText, chatVisualizationIframeUrl, GetJWT } from "views/api-configuration/default";
import { useTheme } from "@mui/material/styles";
import { filterKeys, formatKey } from "constants/generic";

// ==============================|| CHAT MESSAGE HISTORY ||============================== //
const ChatVisualization = ({ messageId }) => {
    const visualTypes = ["Line Chart", "Pie Chart", "Bar Chart"];
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

    const [toggle, setTogggle] = useState(false);
    const [visual, setVisual] = useState("Bar Chart");

    return (
        <>
            <br />
            <div style={{ display: toggle ? "block" : "none" }}>
                <Select
                    name="visualType"
                    placeholder="Select Visual Type"
                    onChange={(event) => setVisual(event.target.value)}
                    style={{ width: "100%", marginTop: "5px", padding: "0px" }}
                >
                    {visualTypes?.map((item, ind) => (
                        <MenuItem key={ind} value={item}>
                            {item}
                        </MenuItem>
                    ))}
                </Select>
                <iframe
                    title={messageId}
                    src={chatVisualizationIframeUrl(messageId, visual, themetype, GetJWT())}
                    width="100%"
                    height="500"
                />
            </div>
            <IconButton onClick={() => setTogggle(!toggle)} size="small" style={{ float: "right" }}>
                <AddchartIcon />
            </IconButton>
        </>
    );
};

ChatVisualization.propTypes = {
    messageId: PropTypes.string
};

// const ChartHistory = ({ loading, data, theme, user }) =>
const ChartHistory = ({ data, theme }) => {
    // scroll to bottom when new message is sent or received
    const { selectedDataset } = useSelector((state) => state.userLogin);

    const wrapper = useRef(document.createElement("div"));
    const el = wrapper.current;
    const scrollToBottom = useCallback(() => {
        el.scrollIntoView(false);
    }, [el]);

    useEffect(() => {
        scrollToBottom();
    }, [data.length, scrollToBottom]);
    /* eslint-disable */
    return (
        <Grid item xs={12}>
            <Grid container spacing={gridSpacing} ref={wrapper}>
                <>
                    {data.map((history, index) => (
                        <React.Fragment key={index}>
                            {history.from === selectedDataset.emailaddress ? (
                                <Grid item xs={12}>
                                    <Grid container spacing={gridSpacing}>
                                        <Grid item xs={2} />
                                        <Grid item xs={12} lg={12} md={12}>
                                            <Card
                                                sx={{
                                                    display: "inline-block",
                                                    width: "100%",
                                                    bgcolor: theme.palette.mode === "dark" ? "grey.600" : theme.palette.primary.light
                                                }}
                                            >
                                                <CardContent
                                                    sx={{
                                                        p: 2,
                                                        pb: "16px !important",
                                                        ml: "auto"
                                                    }}
                                                >
                                                    <Grid container spacing={1}>
                                                        <Grid item xs={12}>
                                                            <Typography
                                                                variant="body2"
                                                                color={theme.palette.mode === "dark" ? "dark.900" : ""}
                                                            >
                                                                <div style={{ display: "flex", alignItems: "center" }}>
                                                                    <img style={{}} src={logo} alt="logo" />
                                                                    <b style={{ textAlign: "center" }}>You</b>
                                                                </div>
                                                                <br />
                                                                {history.text}
                                                                <br />
                                                                <br />
                                                                {/* <b>{history.from}</b> */}
                                                            </Typography>
                                                        </Grid>
                                                    </Grid>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            ) : (
                                <Grid item xs={12}>
                                    <Grid container spacing={gridSpacing}>
                                        <Grid item xs={12} sm={12} lg={12} md={12}>
                                            <Card
                                                sx={{
                                                    display: "inline-block",
                                                    width: "100%",
                                                    background:
                                                        theme.palette.mode === "dark"
                                                            ? theme.palette.dark[900]
                                                            : theme.palette.secondary.light
                                                }}
                                            >
                                                <CardContent sx={{ p: 2 }}>
                                                    <Grid container spacing={1}>
                                                        <Grid item xs={12}>
                                                            {history.loading && (
                                                                <CircularProgress size={20} style={{ marginRight: "10px" }} />
                                                            )}
                                                            {history.error && <Typography color="error">Service Unavailable</Typography>}

                                                            {history.type === "GRID" ? (
                                                                <>
                                                                    <MUIDataTable
                                                                        data={history.text1 ? JSON.parse(history.text1) : []}
                                                                        columns={
                                                                            history.text1 &&
                                                                            typeof JSON.parse(history.text1)[0] === "object"
                                                                                ? filterKeys(Object.keys(JSON.parse(history.text1)[0])).map(
                                                                                      (key) => ({
                                                                                          name: key,
                                                                                          label: formatKey(key),
                                                                                          options: {
                                                                                              width: "500px",
                                                                                              customBodyRender: (
                                                                                                  value,
                                                                                                  tableMeta,
                                                                                                  updateValue
                                                                                              ) => (
                                                                                                  <div style={{ width: 20 * 7 }}>
                                                                                                      {truncateText(value, 20)}
                                                                                                  </div>
                                                                                              )
                                                                                          }
                                                                                      })
                                                                                  )
                                                                                : []
                                                                        }
                                                                        options={{
                                                                            filter: false,
                                                                            sort: false,
                                                                            // empty: true,
                                                                            selectableRows: "none",
                                                                            print: false,
                                                                            download: false,
                                                                            search: false,
                                                                            viewColumns: false,
                                                                            resizableColumns: true,
                                                                            responsive: "simple",
                                                                            count: history.count
                                                                        }}
                                                                    />
                                                                    <ChatVisualization messageId={history.messageId} />
                                                                </>
                                                            ) : (
                                                                <Typography variant="body2">
                                                                    <div style={{ display: "flex", alignItems: "center" }}>
                                                                        <img src={logo} alt="logo" />
                                                                        <b style={{ textAlign: "center" }}>tremeAnalytix</b>
                                                                    </div>
                                                                    <br />
                                                                    {history.text1} <br />
                                                                    <ChatVisualization messageId={history.messageId} />
                                                                </Typography>
                                                            )}
                                                        </Grid>
                                                    </Grid>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            )}
                        </React.Fragment>
                    ))}
                </>
            </Grid>
        </Grid>
    );
};
/* eslint-enable */
ChartHistory.propTypes = {
    // loading: PropTypes.bool,
    theme: PropTypes.object,
    data: PropTypes.array
    // user: PropTypes.object
};

export default ChartHistory;
