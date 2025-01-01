import React, { useState } from "react";
import PropTypes from "prop-types";
// material-ui
// import { useTheme } from "@mui/material/styles";
import { Drawer, Fab, Grid, IconButton, Tooltip } from "@mui/material";
import { IconSettings } from "@tabler/icons";

// Redux Imports
// import { useDispatch } from "store";
import JSXStyles from "styles/style";

// ==============================|| LIVE CUSTOMIZATION ||============================== //

const ChartCustomization = ({ visual, visualCustomization }) => {
    // const theme = useTheme();
    // const dispatch = useDispatch();
    const styles = JSXStyles();
    // drawer on/off
    const [open, setOpen] = useState(false);
    const handleToggle = () => {
        setOpen(!open);
    };

    return (
        <>
            <Tooltip title="Live Customize">
                <Fab component="div" onClick={handleToggle} size="small" variant="circular" color="secondary">
                    <IconButton color="inherit" size="large" disableRipple onClick={handleToggle}>
                        <IconSettings />
                    </IconButton>
                </Fab>
            </Tooltip>

            <Drawer
                anchor="right"
                onClose={handleToggle}
                open={open}
                PaperProps={{
                    sx: {
                        // width: 280,
                        width: "80%"
                    }
                }}
                style={{
                    zIndex: 20000
                }}
            >
                <Grid container spacing={0} style={{ padding: "0px", margin: "0px" }}>
                    <Grid item sm={12} md={8} lg={8} style={{ padding: "0px", margin: "0px" }}>
                        <div style={styles.componentStyles.chartWindow}>{visual}</div>
                    </Grid>
                    <Grid item sm={12} md={4} lg={4} style={{ padding: "0px", margin: "0px", borderLeft: "1px solid" }}>
                        {visualCustomization}
                    </Grid>
                </Grid>
            </Drawer>
        </>
    );
};

ChartCustomization.propTypes = {
    visual: PropTypes.any,
    visualCustomization: PropTypes.any
};

export default ChartCustomization;
