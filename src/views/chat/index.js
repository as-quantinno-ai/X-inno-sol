import React, { useState, useEffect } from "react";

// material-ui
import { useTheme, styled } from "@mui/material/styles";
import { Divider, CardContent, Grid, IconButton, TextField, Typography, Collapse, Card, Radio, useMediaQuery } from "@mui/material";

// third-party
import PerfectScrollbar from "react-perfect-scrollbar";

// project imports
import ChartHistory from "./ChatHistory";
import MainCard from "ui-component/cards/MainCard";
// import { appDrawerWidth as drawerWidth, gridSpacing } from "store/constant";
import { appDrawerWidth as gridSpacing } from "store/constant";
import { useDispatch, useSelector } from "store";
// import { getUser, getUserChats, insertChat } from 'store/slices/chat';
import axios from "axios";
import { selectBaseData } from "store/slices/initial-data";

import SendTwoToneIcon from "@mui/icons-material/SendTwoTone";
import { getAllCatalogs } from "store/slices/AppDashboardRawSha";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import { gptQueryEngine } from "views/api-configuration/default";

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(({ theme }) => ({
    flexGrow: 1,
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    marginLeft: 0,
    marginRight: 0
}));

// ==============================|| APPLICATION CHAT ||============================== //

const ChatMainPage = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const matchDownLg = useMediaQuery((theme) => theme.breakpoints.down("lg"));
    const matchDownMd = useMediaQuery((theme) => theme.breakpoints.down("md"));
    const { selectedDataset } = useSelector((state) => state.userLogin);

    // SUBMENU FOR CATALOGS SELECTION
    const [mainMenuOpen, setMainMenuOpen] = useState(true);
    // eslint-disable-next-line no-unused-vars
    const [subMenuOpen, setSubMenuOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    // const [chartType, setChartType] = useState(false);

    const { rawDataSources } = useSelector((state) => state.dataCollection);
    const [selectedIndex, setSelectedIndex] = useState(null);
    // eslint-disable-next-line no-unused-vars
    const [catalogueName, setCatalogueName] = useState(null);
    // eslint-disable-next-line no-unused-vars
    const [catalogueFields, setCatalogueFields] = useState(null);

    const baseData = useSelector(selectBaseData);
    const { catalogs } = baseData;

    const [userMessageRequest, setUserMessageRequest] = useState({
        product_client_datasets_id: 1,
        table_id: 1,
        query: "",
        userid: selectedDataset.userId
    });

    const [userMessage, setUserMessage] = useState("");

    const userMsgChange = (e) => {
        setUserMessage(e.target.value);
        setUserMessageRequest({ ...userMessageRequest, query: `${e.target.value}` });
    };

    const handleMainMenuClick = () => {
        setSubMenuOpen(false);
        setMainMenuOpen(!mainMenuOpen);
    };

    const handleSelectItem = (e, index) => {
        setSelectedIndex(index);
        const [tablename, productclientdatasetsid, tableid] = e.target.value.split(",");

        setCatalogueName(tablename.replace(/ /g, "_").toLowerCase());
        setUserMessageRequest({ ...userMessageRequest, product_client_datasets_id: productclientdatasetsid, table_id: tableid });
    };

    useEffect(() => {
        if (catalogs) {
            dispatch(getAllCatalogs(catalogs));
        }
    }, [catalogs]);

    // CHAT COMPONENT STATES
    const [user, setUser] = useState({});
    const [data, setData] = useState([]);
    const chatState = useSelector((state) => state.chat);

    useEffect(() => {
        setUser(chatState.user);
    }, [chatState.user]);

    useEffect(() => {
        if (rawDataSources.length === 1) {
            handleSelectItem(
                {
                    target: {
                        value: `${rawDataSources[0].tablename},${rawDataSources[0].productclientdatasetsid},${rawDataSources[0].tableid}`
                    }
                },
                0
            );
        }
    }, [rawDataSources]);

    // handle new message form
    // eslint-disable-next-line no-unused-vars
    const [message, setMessage] = useState("");

    const handleOnSend = () => {
        setMessage("");
        setIsLoading(true);
        const messageId = Date.now();

        if (selectedIndex === null) {
            alert("Please select a catalog before sending a message");
            setIsLoading(false);
            return;
        }
        const newMessage = {
            id: messageId,
            from: selectedDataset.emailaddress,
            type: data,
            to: "assistance",
            text: userMessage,
            loading: true
        };

        setData((prevState) => [...prevState, newMessage]);

        setData((prevMessages) => [
            ...prevMessages,
            { id: messageId, from: "assistance", to: selectedDataset.emailaddress, loading: true, error: false }
        ]);

        setUserMessage("");

        axios
            .post(gptQueryEngine, userMessageRequest)

            .then((res) => {
                const assistanceMessage = {
                    id: messageId,
                    from: "assistance",
                    to: selectedDataset.emailaddress,
                    text1: res.data.data.data,
                    loading: false,
                    error: false,
                    type: res.data.data.type,
                    count: res.data.data_count,
                    messageId: res.data.chat_message_id
                };
                setData((prevMessages) => [...prevMessages.slice(0, -1), assistanceMessage]);
                setIsLoading(false);
                setUserMessage("");
            })

            .catch((err) => {
                console.log("ERROR in ChatMainPage ", err);
                setUserMessage("");
                setData((prevMessages) => [
                    ...prevMessages.slice(0, -1),
                    { id: messageId, from: "assistance", loading: false, error: true }
                ]);
                setIsLoading(false);
            })
            .finally(() => {
                setIsLoading(false);
                setUserMessage("");
            });
    };

    const handleEnter = (event) => {
        if (event?.key !== "Enter") {
            return;
        }
        handleOnSend();
    };
    if (!user) return <Typography>Loading...</Typography>;

    return (
        <Grid container spacing={1}>
            <Grid item lg={9} sm={12} md={9}>
                <Main theme={theme} match={matchDownLg} matchmd={matchDownMd}>
                    <MainCard
                        sx={{
                            width: "100%",
                            height: "100%",
                            flexShrink: 0,
                            bgcolor: theme.palette.mode === "dark" ? "dark.main" : "grey.50"
                        }}
                    >
                        <Grid container spacing={gridSpacing}>
                            <PerfectScrollbar style={{ width: "100%", height: "calc(100vh - 230px)", overflowX: "hidden", minHeight: 500 }}>
                                <CardContent style={{ width: "100%" }}>
                                    <ChartHistory loading={isLoading} theme={theme} user={user} data={data} />
                                </CardContent>
                            </PerfectScrollbar>
                            <Grid item xs={12}>
                                <Grid container spacing={1} alignItems="center">
                                    <Grid item xs zeroMinWidth>
                                        <TextField
                                            fullWidth
                                            label="Type a Message"
                                            onChange={userMsgChange}
                                            onKeyPress={handleEnter}
                                            value={userMessage}
                                        />
                                    </Grid>

                                    <Grid item>
                                        <IconButton color="primary" onClick={handleOnSend} disabled={isLoading} size="large">
                                            <SendTwoToneIcon />
                                        </IconButton>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </MainCard>
                </Main>
            </Grid>
            <Grid item md={3} lg={3} sm={12}>
                <Card>
                    <CardContent>
                        <Grid container alignItems="center" spacing={0.5}>
                            <Grid item>
                                <IconButton onClick={handleMainMenuClick} size="small">
                                    <MenuRoundedIcon />
                                </IconButton>
                            </Grid>
                            <Grid item>
                                <Typography variant="h5">Select Any Topic</Typography>
                            </Grid>
                            <Grid container direction="row" alignItems="center" justify="center" spacing={1} sx={{ p: 2 }}>
                                {catalogueFields && (
                                    <PerfectScrollbar
                                        style={{
                                            width: "100%",
                                            height: "calc(110vh - 440px)",
                                            overflowX: "hidden",
                                            minHeight: 200,
                                            maxHeight: 300
                                        }}
                                    >
                                        {catalogueFields.split(",").map((item, index) => (
                                            <>
                                                <Typography key={index} variant="body1">
                                                    {item.trim()}
                                                </Typography>
                                                <Divider />
                                            </>
                                        ))}
                                    </PerfectScrollbar>
                                )}
                            </Grid>
                        </Grid>
                        {rawDataSources.map((item, index) => (
                            <React.Fragment key={index}>
                                <Collapse in={mainMenuOpen} timeout="auto" unmountOnExit>
                                    <Grid container alignItems="center" spacing={0.5}>
                                        <Grid item>
                                            <Radio
                                                size="small"
                                                checked={selectedIndex === index}
                                                value={[item.tablename, item.productclientdatasetsid, item.tableid]}
                                                onChange={(e) => handleSelectItem(e, index)}
                                            />
                                        </Grid>

                                        <Grid item>
                                            <Typography
                                                variant="subtitle1"
                                                sx={{
                                                    fontSize: "11px",
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                    whiteSpace: "nowrap",
                                                    display: "block"
                                                }}
                                            >
                                                {item.label}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Collapse>
                            </React.Fragment>
                        ))}
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

export default ChatMainPage;
