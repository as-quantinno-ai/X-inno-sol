import React, { useState, useEffect } from "react";

// material-ui
import { useTheme, styled } from "@mui/material/styles";
import { CardContent, Grid, IconButton, TextField, Typography, useMediaQuery } from "@mui/material";

// third-party
import PerfectScrollbar from "react-perfect-scrollbar";

// project imports
import ChartHistory from "./ChatHistory";
import MainCard from "ui-component/cards/MainCard";
import { gridSpacing } from "store/constant";
import { useDispatch, useSelector } from "store";
// import axios from "axios";
import { selectBaseData } from "store/slices/initial-data";

import SendTwoToneIcon from "@mui/icons-material/SendTwoTone";
import { getAllCatalogs } from "store/slices/AppDashboardRawSha";
import { getGenAiFLowFlowIdUrl, getGenAiFLowProductIdUrl } from "views/api-configuration/default";
import { useParams, useLocation } from "react-router-dom";
import api from "views/api-configuration/api";

// const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(({ theme, open, matchLg, matchmd }) => ({
//     flexGrow: 1,
//     paddingLeft: theme.spacing(1),
//     paddingRight: theme.spacing(1),
//     marginLeft: 0,
//     marginRight: 0
// }));
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
    const { flowid } = useParams();
    const location = useLocation();

    // SUBMENU FOR CATALOGS SELECTION
    const [isLoading, setIsLoading] = useState(false);

    const baseData = useSelector(selectBaseData);
    const { catalogs } = baseData;

    const [userMessageRequest, setUserMessageRequest] = useState({
        message: ""
    });

    const [userMessage, setUserMessage] = useState("");

    const userMsgChange = (e) => {
        setUserMessage(e.target.value);
        setUserMessageRequest({ ...userMessageRequest, message: `${e.target.value}` });
    };

    useEffect(() => {
        if (catalogs) {
            dispatch(getAllCatalogs(catalogs));
        }
    }, [catalogs]);

    // CHAT COMPONENT STATES
    const [user, setUser] = useState({});
    // eslint-disable-next-line
    const [flowId, setFlowId] = useState();

    const [data, setData] = useState([]);
    const chatState = useSelector((state) => state.chat);

    useEffect(() => {
        setUser(chatState.user);
    }, [chatState.user]);

    // handle new message form
    // eslint-disable-next-line
    const [message, setMessage] = useState("");

    useEffect(() => {
        api.get(`${getGenAiFLowProductIdUrl(selectedDataset.productclientdatasetsid)}`).then((res) => {
            setFlowId(res.data.result[0].genaiflowid);
        });
    }, []);

    useEffect(() => {
        setData([]);
    }, [location.pathname]);

    const handleOnSend = () => {
        setMessage("");
        setIsLoading(true);
        const messageId = Date.now();
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

        api.post(`${getGenAiFLowFlowIdUrl(flowid)}`, userMessageRequest)
            .then((res) => {
                // const text = res.data.response.messages;
                const assistanceMessage = {
                    id: messageId,
                    from: "assistance",
                    to: selectedDataset.emailaddress,
                    text1: res.data.response.messages,
                    loading: false,
                    error: false
                    // type: res.data.data?.type,
                    // count: res.data?.data_count,
                    // messageId: res.data?.chat_message_id
                };
                setData((prevMessages) => [...prevMessages.slice(0, -1), assistanceMessage]);
                setIsLoading(false);
                setUserMessage("");
            })
            .catch((err) => {
                setUserMessage("");
                setData((prevMessages) => [
                    ...prevMessages.slice(0, -1),
                    { id: messageId, from: "assistance", loading: false, error: true }
                ]);
                setIsLoading(false);
                console.error("error in chatBots root file :", err);
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
            <Grid item lg={12} sm={12} md={12}>
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
        </Grid>
    );
};

export default ChatMainPage;
