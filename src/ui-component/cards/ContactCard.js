/* eslint-disable no-undef */
import PropTypes from "prop-types";
import React, { useState } from "react";

// material-ui
import { useTheme } from "@mui/material/styles";
import { Button, Card, Grid, Typography, RadioGroup, FormControlLabel, Radio, Box } from "@mui/material";

// project imports
import Avatar from "../extended/Avatar";
import { gridSpacing } from "store/constant";

// assets
// import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import ChatBubbleTwoToneIcon from "@mui/icons-material/ChatBubbleTwoTone";
// import PhoneTwoToneIcon from "@mui/icons-material/PhoneTwoTone";
import { IconNotification, IconCircleDot } from "@tabler/icons";
import JSXStyles from "styles/style";
import { useDispatch } from "store";
import { useSelector } from "react-redux";
import PerfectScrollbar from "react-perfect-scrollbar";
import { getSelectedDatasetSuccess } from "store/slices/user-login";
import { configureApplicationMode } from "store/slices/app-dashboard";
import Marquee from "react-fast-marquee";

// const avatarImage = require.context('assets/images/users', true);

// ==============================|| USER CONTACT CARD ||============================== //
// const ContactCard = ({ avatar, contact, email, name, location, onActive, role, visuals })
const ContactCard = () => {
    const theme = useTheme();
    const styles = JSXStyles();
    const dispatch = useDispatch();
    const { applicationMode } = useSelector((state) => state.dashboard);
    // const { userRoleDataSets, selectedDataset, userInstance } = useSelector((state) => state.userLogin);
    const { userRoleDataSets, selectedDataset } = useSelector((state) => state.userLogin);

    function onDatasetChange(datasetid) {
        dispatch(getSelectedDatasetSuccess(datasetid));
    }
    function onApplicationModeChange(val) {
        if (selectedDataset !== null && selectedDataset !== undefined)
            dispatch(configureApplicationMode(val, selectedDataset.userroledatasetid));
    }
    // const avatarProfile = avatar && avatarImage(`./${avatar}`).default;

    // eslint-disable-next-line no-unused-vars
    const [anchorEl, setAnchorEl] = useState(null);
    // const handleClick = (event) => {
    //     setAnchorEl(event?.currentTarget);
    // };

    // const handleClose = () => {
    //     setAnchorEl(null);
    // };

    return (
        <Card
            style={styles.componentStyles.rightCardStyle}
            sx={{
                p: 2,
                bgcolor: theme.palette.mode === "dark" ? theme.palette.dark.main : theme.palette.grey[50],
                border: theme.palette.mode === "dark" ? "none" : "1px solid",
                borderColor: theme.palette.grey[100]
            }}
        >
            <Grid container spacing={1}>
                <Grid item xs={12}>
                    <Grid container spacing={gridSpacing}>
                        <Grid item xs zeroMinWidth style={{ cursor: "pointer" }}>
                            <Avatar size="lg" sx={{ bgcolor: "white", width: 72, height: 72 }}>
                                {/* {userInstance.firstName[0].toUpperCase()} */}A
                            </Avatar>
                        </Grid>
                        <Grid item>
                            {/* if stopped configuration is stopped and application is live */}
                            <IconCircleDot className={applicationMode === "STOPPED" ? "greenDot" : "redDot"} />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="h3" component="div" style={styles.color}>
                        {/* {userInstance.firstName} {userInstance.lastName} */}
                    </Typography>
                    <Typography variant="caption" style={styles.color}>
                        {selectedDataset ? selectedDataset.rolename : <></>}
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="caption" style={styles.color}>
                        User Login Id
                    </Typography>
                    {/* <Typography variant="h6">{userInstance.userLoginId}</Typography> */}
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="caption" style={styles.color}>
                        Data Set & Application mode Details
                    </Typography>
                    <Typography variant="h6" style={styles.color}>
                        <Marquee style={{ background: "transparent" }} gradientColor={[255, 255, 255]}>
                            {selectedDataset ? (
                                `DATASET: ${selectedDataset.datasetname} | PRODUCT: ${selectedDataset.productname} | ROLE: ${selectedDataset.rolename}`
                            ) : (
                                <></>
                            )}
                        </Marquee>
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Grid container spacing={1}>
                        <Grid item xs={6}>
                            <Button
                                variant="outlined"
                                color={theme.palette.mode === "dark" ? "secondary" : "primary"}
                                sx={{ width: "100%" }}
                                startIcon={<ChatBubbleTwoToneIcon />}
                            >
                                History
                            </Button>
                        </Grid>
                        <Grid item xs={6}>
                            <Button
                                variant="outlined"
                                color={theme.palette.mode === "dark" ? "primary" : "primary"}
                                sx={{ width: "100%" }}
                                startIcon={<IconNotification />}
                            >
                                Notifications
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            {visuals !== "active" ? (
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        {selectedDataset ? (
                            <>
                                {selectedDataset.rolename !== "VIEWER" ? (
                                    <>
                                        <Typography variant="h4" component="div" style={{ marginTop: "20px" }}>
                                            APPLICATION MODE
                                        </Typography>
                                        <RadioGroup
                                            row
                                            aria-label="layout"
                                            // value={navType}
                                            onChange={(e) => onApplicationModeChange(e.target.value)}
                                            name="row-radio-buttons-group"
                                        >
                                            <FormControlLabel
                                                value="STOPPED"
                                                control={<Radio />}
                                                label="Live Mode"
                                                sx={{
                                                    "& .MuiSvgIcon-root": { fontSize: 16 },
                                                    "& .MuiFormControlLabel-label": {
                                                        color:
                                                            theme.palette.mode === "dark"
                                                                ? theme.palette.secondary.light
                                                                : theme.palette.secondary.dark
                                                    }
                                                }}
                                            />
                                            <FormControlLabel
                                                value="SUBMITTED"
                                                control={<Radio />}
                                                label="Configure Mode"
                                                sx={{
                                                    "& .MuiSvgIcon-root": { fontSize: 16 },
                                                    "& .MuiFormControlLabel-label": {
                                                        color:
                                                            theme.palette.mode === "dark"
                                                                ? theme.palette.secondary.light
                                                                : theme.palette.secondary.dark
                                                    }
                                                }}
                                            />
                                        </RadioGroup>
                                    </>
                                ) : (
                                    <></>
                                )}
                            </>
                        ) : (
                            <></>
                        )}
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h4" component="div" style={{ marginTop: "20px" }}>
                            SELECT DATASET
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <PerfectScrollbar style={{ height: 230 }}>
                            {/* layout type */}
                            <Box>
                                <RadioGroup
                                    row
                                    aria-label="layout"
                                    // value={navType}
                                    onChange={(e) => onDatasetChange(e.target.value)}
                                    name="column-radio-buttons-group"
                                >
                                    {userRoleDataSets !== null ? (
                                        userRoleDataSets.map((item, ind) => (
                                            <Box key={ind} style={styles.componentStyles.chckBtnList}>
                                                <FormControlLabel
                                                    value={item.userroledatasetid}
                                                    control={<Radio />}
                                                    label={item.datasetname}
                                                    sx={{
                                                        "& .MuiSvgIcon-root": { fontSize: 16 },
                                                        "& .MuiFormControlLabel-label": {
                                                            color:
                                                                theme.palette.mode === "dark"
                                                                    ? theme.palette.secondary.light
                                                                    : theme.palette.secondary.dark
                                                        }
                                                    }}
                                                />
                                            </Box>
                                        ))
                                    ) : (
                                        <></>
                                    )}
                                </RadioGroup>
                            </Box>
                        </PerfectScrollbar>
                    </Grid>
                </Grid>
            ) : (
                <></>
            )}
        </Card>
    );
};

ContactCard.propTypes = {
    avatar: PropTypes.string,
    contact: PropTypes.string,
    email: PropTypes.string,
    location: PropTypes.string,
    name: PropTypes.string,
    onActive: PropTypes.func,
    role: PropTypes.string
};

export default ContactCard;
