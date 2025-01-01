import React, { useState, useEffect, useCallback } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
// import { Button, Drawer, FormControl, Grid } from "@mui/material";
import { Button, Drawer, Grid } from "@mui/material";
import { gridSpacing } from "store/constant";
import { getScreenByScreenIdAndMode, getScreenByScreenIdAndModeAndDashboard, GetAccessToken } from "views/api-configuration/default";
import { DashboardBuilder } from "views/page-builder/CustomDashboard";
import FormHeader from "../formHeader";
import api from "views/api-configuration/api";
import PropTypes from "prop-types";
// import CloseIcon from "@mui/icons-material/Close";

const ButtonDetailsDrawer = ({
    handleLoadingState,
    // productclientdatasetsid,
    // tableid,
    recid,
    referenceid,
    isopen,
    handleDrawer,
    dashboard
}) => {
    const [open, setOpen] = useState(isopen);
    const [screen, setScreen] = useState(null);

    const handleToggle = () => {
        handleLoadingState();
        setOpen(!open);
        handleDrawer();
    };

    function fetchScreens() {
        const url = dashboard
            ? `${getScreenByScreenIdAndModeAndDashboard(referenceid, "DETAILS", dashboard)}`
            : `${getScreenByScreenIdAndMode(referenceid, "DETAILS")}`;

        api.get(url, { headers: GetAccessToken() })
            .then((res) => {
                setScreen(res.data.result);
                handleLoadingState();
            })
            // eslint-disable-next-line no-unused-vars
            .catch((err) => {
                handleLoadingState();
            });
    }

    useEffect(() => {
        fetchScreens();
    }, []);

    const refreshScreens = useCallback(() => {
        fetchScreens();
    }, [fetchScreens]);

    return (
        <Drawer
            anchor="right"
            onClose={handleToggle}
            open={open}
            PaperProps={{
                sx: {
                    width: 700
                }
            }}
        >
            {open && (
                <PerfectScrollbar component="div">
                    <Grid container spacing={gridSpacing} sx={{ p: 3 }}>
                        <Grid item xs={12}>
                            <FormHeader onCancel={handleToggle} />
                            {screen && (
                                <DashboardBuilder
                                    gridDimensions={JSON.parse(screen.screen.screenrows)}
                                    componentsLayout={screen.components.map((component) => JSON.parse(component.layout.position))}
                                    components={screen.components}
                                    refreshScreens={refreshScreens}
                                    title={screen?.screen.screentitle}
                                    uuid={recid}
                                />
                            )}
                            <Grid item xs={12} sm={12} style={{ padding: "7px 0px", margin: "5px" }}>
                                <Grid item xs={12} lg={12} sm={12}>
                                    <Button
                                        type="button"
                                        onClick={handleToggle}
                                        color="secondary"
                                        variant="contained"
                                        sx={{ width: "100%" }}
                                    >
                                        Cancel
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </PerfectScrollbar>
            )}
        </Drawer>
    );
};

ButtonDetailsDrawer.propTypes = {
    handleDrawer: PropTypes.func,
    handleLoadingState: PropTypes.func,
    isopen: PropTypes.bool,
    // productclientdatasetsid: PropTypes.string,
    // tableid: PropTypes.string,
    recid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    referenceid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    dashboard: PropTypes.object
};

export default ButtonDetailsDrawer;
