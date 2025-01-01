import React, { useEffect } from "react";
// material-ui
import { useTheme } from "@mui/material/styles";
import { Avatar, Box, Button, useMediaQuery } from "@mui/material";

// project imports
import MobileSection from "./MobileSection";
import ProfileSection from "./ProfileSection";
import LocalizationSection from "./LocalizationSection";
import NotificationSection from "./NotificationSection";
import { useDispatch, useSelector } from "store";
import { openDrawer } from "store/slices/menu";
import Breadcrumbs from "ui-component/extended/Breadcrumbs";

// assets
import Customization from "layout/Customization";
import { IconChevronRight, IconMenu2 } from "@tabler/icons";
import navigation from "menu-items";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import styled from "@emotion/styled";
import { THEME_MODE } from "constants/generic";
import AvatarHomeSection from "./AvatarHomeSection";

// ==============================|| HEADER ||============================== //
// eslint-disable-next-line
const BoldArrowBackIosNewIcon = styled(ArrowBackIosNewIcon)(({ theme }) => ({
    fontSize: "1.75rem",
    stroke: "currentColor",
    strokeWidth: 1.5
}));

// eslint-disable-next-line
const BoldArrowForwardBackIosNewIcon = styled(ArrowForwardIosIcon)(({ theme }) => ({
    fontSize: "1.75rem",
    stroke: "currentColor",
    strokeWidth: 1.5
}));
// ==============================|| MAIN NAVBAR / HEADER ||============================== //

const Header = () => {
    const theme = useTheme();

    const dispatch = useDispatch();
    const { drawerOpen } = useSelector((state) => state.menu);
    const { applicationMode } = useSelector((state) => state.dashboard);

    const isLaptopScreen = useMediaQuery(theme.breakpoints.up("md"));
    const isSmallScreen = useMediaQuery(theme.breakpoints.between("xs", "sm"));

    useEffect(() => {
        if (applicationMode !== "STOPPED") {
            dispatch(openDrawer(true));
        } else {
            dispatch(openDrawer(false));
        }
    }, [applicationMode]);

    return (
        <>
            {!drawerOpen ? (
                <>
                    {applicationMode !== "STOPPED" ? (
                        <Box
                            sx={{
                                width: 228,
                                display: "flex",
                                height: "48px",
                                [theme.breakpoints.down("md")]: {
                                    width: "auto"
                                }
                            }}
                        >
                            <Avatar
                                variant="rounded"
                                sx={{
                                    ...theme.typography.commonAvatar,
                                    ...theme.typography.mediumAvatar,
                                    border: "1px solid",
                                    borderColor:
                                        theme.palette.mode === THEME_MODE.DARK ? theme.palette.dark.main : theme.palette.primary.light,
                                    background:
                                        theme.palette.mode === THEME_MODE.DARK
                                            ? theme.palette.dark.main
                                            : theme.palette.toggleIcon.background,
                                    color: theme.palette.primary.dark,
                                    transition: "all .2s ease-in-out",
                                    // eslint-disable-next-line
                                    '&[aria-controls="menu-list-grow"],&:hover': {
                                        borderColor: theme.palette.primary.main,
                                        background: theme.palette.primary.main,
                                        color: theme.palette.primary.light
                                    },
                                    visibility: "hidden"
                                }}
                                onClick={() => dispatch(openDrawer(!drawerOpen))}
                                color="inherit"
                                style={{ width: "30px", height: "30px" }}
                            >
                                <IconMenu2 stroke={1.5} size="1rem" />
                            </Avatar>
                            <Button
                                variant="contained"
                                color="primary"
                                sx={{
                                    backgroundColor: "#fff",
                                    minWidth: "40px",
                                    minHeight: "50px",
                                    marginLeft: "30px",
                                    marginTop: "10px",
                                    ...theme.typography.commonAvatar,
                                    ...theme.typography.mediumAvatar,
                                    background:
                                        theme.palette.mode === THEME_MODE.DARK
                                            ? theme.palette.dark.main
                                            : theme.palette.toggleIcon.background,
                                    color: theme.palette.primary.dark,
                                    transition: "all .2s ease-in-out",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    // "&[aria-controls=\"menu-list-grow\"],&:hover" option
                                    // eslint-disable-next-line
                                    '&[aria-controls="menu-list-grow"],&:hover': {
                                        borderColor: theme.palette.primary.main,
                                        background: theme.palette.primary.main,
                                        color: theme.palette.primary.light
                                    },
                                    borderTopRightRadius: "45%",
                                    borderBottomRightRadius: "45%",
                                    borderTopLeftRadius: "0%",
                                    borderBottomLeftRadius: "0%",
                                    zIndex: 1,
                                    boxShadow:
                                        "0px 3px 1px -2px rgba(0,0,0,0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 1px 5px 0px rgba(0,0,0,0.12)" // Adjust to your preference
                                }}
                                onClick={() => dispatch(openDrawer(!drawerOpen))}
                            >
                                <BoldArrowBackIosNewIcon />
                            </Button>
                        </Box>
                    ) : (
                        <></>
                    )}
                </>
            ) : (
                <></>
            )}

            <Box
                sx={{
                    flexGrow: 1,
                    ml: drawerOpen ? (isLaptopScreen ? 35 : 12) : 0
                }}
            >
                {drawerOpen && (
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{
                            backgroundColor: "#fff",
                            minWidth: "40px",
                            minHeight: "50px",
                            padding: "8px",
                            position: "absolute",
                            left: "234px",
                            top: "30px",
                            border: "none",
                            ...theme.typography.commonAvatar,
                            ...theme.typography.mediumAvatar,
                            background: theme.palette.mode === "dark" ? theme.palette.dark.main : theme.palette.toggleIcon.background,
                            color: theme.palette.primary.dark,
                            transition: "all .2s ease-in-out",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            // eslint-disable-next-line
                            '&[aria-controls="menu-list-grow"],&:hover': {
                                borderColor: theme.palette.primary.main,
                                background: theme.palette.primary.main,
                                color: theme.palette.primary.light
                            },
                            borderTopRightRadius: "45%",
                            borderBottomRightRadius: "45%",
                            borderTopLeftRadius: "0%",
                            borderBottomLeftRadius: "0%",
                            zIndex: 1,
                            boxShadow: "0px 3px 1px -2px rgba(0,0,0,0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 1px 5px 0px rgba(0,0,0,0.12)"
                        }}
                        onClick={() => dispatch(openDrawer(!drawerOpen))}
                    >
                        <BoldArrowForwardBackIosNewIcon />
                    </Button>
                )}
                <Breadcrumbs separator={IconChevronRight} navigation={navigation} icon title rightAlign />
            </Box>

            {isLaptopScreen ? (
                <>
                    <LocalizationSection />
                    <Customization />
                    <Box
                        sx={{
                            ml: 1
                        }}
                    >
                        <AvatarHomeSection />
                    </Box>

                    <NotificationSection />
                    <ProfileSection />
                </>
            ) : isSmallScreen ? (
                <Box>
                    <MobileSection />
                </Box>
            ) : (
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <ProfileSection />
                    <MobileSection />
                </Box>
            )}
        </>
    );
};

export default Header;
