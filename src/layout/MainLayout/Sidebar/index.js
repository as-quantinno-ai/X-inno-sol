import PropTypes from "prop-types";
import React, { memo, useMemo, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import { Box, Drawer, useMediaQuery } from "@mui/material";
import PerfectScrollbar from "react-perfect-scrollbar";
import MenuList from "./MenuList";
import LogoSection from "../LogoSection";
import { openDrawer } from "store/slices/menu";
import { useDispatch, useSelector } from "store";
import { drawerWidth } from "store/constant";
import LogoCollapsed from "ui-component/LogoCollapsed";

// ==============================|| SIDEBAR DRAWER ||============================== //

const Sidebar = ({ window }) => {
    const theme = useTheme();
    const matchUpMd = useMediaQuery(theme.breakpoints.up("md"));
    const { applicationMode } = useSelector((state) => state.dashboard);
    const dispatch = useDispatch();
    const { drawerOpen } = useSelector((state) => state.menu);
    useEffect(() => {
        if (applicationMode !== "STOPPED") {
            dispatch(openDrawer(true));
        } else {
            dispatch(openDrawer(false));
        }
    }, [applicationMode]);

    const drawerWidthWhenClosed = matchUpMd ? 300 : 60;
    const drawer = useMemo(
        () => (
            <Box overflow="hidden">
                {drawerOpen && (
                    <Box
                        sx={{
                            mt: 0,
                            p: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            height: 90,
                            position: "relative",
                            paddingBottom: "5px",
                            overflow: "hidden"
                        }}
                    >
                        <LogoSection />
                    </Box>
                )}

                <PerfectScrollbar
                    component="div"
                    style={{
                        height: !matchUpMd ? "calc(100vh - 50px)" : "calc(100vh - 70px)",
                        width: drawerOpen ? "235px" : "90px",
                        paddingLeft: drawerOpen ? "16px" : "12px",
                        paddingRight: drawerOpen ? "16px" : "14px",
                        overflowY: "hidden"
                    }}
                >
                    {!drawerOpen && (
                        <Box
                            sx={{
                                mt: 0,
                                p: 1,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                height: 100,
                                position: "relative",
                                paddingBottom: "5px",
                                overflow: "hidden"
                            }}
                        >
                            <LogoCollapsed />
                        </Box>
                    )}

                    <MenuList />
                </PerfectScrollbar>
            </Box>
        ),
        [dispatch, matchUpMd, theme, drawerOpen]
    );

    const container = window !== undefined ? () => window.document.body : undefined;

    return (
        <Box
            component="nav"
            sx={{ flexShrink: { md: 0 }, width: drawerOpen ? drawerWidth : drawerWidthWhenClosed }}
            aria-label="mailbox folders"
        >
            {!drawerOpen && drawer}
            <Drawer
                container={container}
                variant={matchUpMd ? "persistent" : "temporary"}
                anchor="left"
                open={drawerOpen}
                onClose={() => dispatch(openDrawer(!drawerOpen))}
                sx={{
                    "& .MuiDrawer-paper": {
                        width: drawerOpen ? drawerWidth : drawerWidthWhenClosed,
                        background: theme.palette.background.default,
                        color: theme.palette.text.primary,
                        borderRight: "none",
                        [theme.breakpoints.up("md")]: {
                            top: "10px"
                        }
                    }
                }}
                ModalProps={{ keepMounted: true }}
                color="inherit"
            >
                {drawer}
            </Drawer>
        </Box>
    );
};

Sidebar.propTypes = {
    window: PropTypes.object
};

export default memo(Sidebar);
