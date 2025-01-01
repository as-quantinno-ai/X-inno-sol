import React, { useState, useEffect } from "react";

// material-ui
import { Box, Grid, Typography } from "@mui/material";
import { getScreenByScreenId } from "views/api-configuration/default";
import PropTypes from "prop-types";
import api from "views/api-configuration/api";

function TabPanel({ children, value, index, ...other }) {
    return (
        <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
            {value === index && (
                <Box
                    sx={{
                        p: 3
                    }}
                >
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any,
    value: PropTypes.any
};

// ================================|| UI TABS - COLOR ||================================ //

export function DashboardBuilder({ gridDimensions, components, onLayoutIdChangeInternal }) {
    const changeLayoutId = (e) => {
        onLayoutIdChangeInternal(e.target.value);
    };

    return (
        <div style={{ width: "100%", border: "1px solid", padding: "20px", height: "200px" }}>
            {gridDimensions.map((rowInd, rowNum) => (
                <Grid key={rowInd} container spacing={1} style={{ height: "40px" }}>
                    {components
                        .filter((item) => JSON.parse(item.layout.position)[0][0] === rowInd.num)
                        .map((item, index) => (
                            <Grid
                                key={`component-${rowNum}-${index}`}
                                item
                                xs={12}
                                sm={12}
                                md={12}
                                lg={JSON.parse(item.layout.position)[1][1] - (JSON.parse(item.layout.position)[0][1] - 1)}
                                style={{
                                    position: "relative",
                                    height: "100%"
                                }}
                            >
                                dafsdf
                                <input
                                    type="radio"
                                    id={`layout-${rowNum}-${index}`}
                                    name="fav_language"
                                    value={item.layout.layoutid}
                                    onChange={changeLayoutId}
                                />
                            </Grid>
                        ))}
                </Grid>
            ))}
        </div>
    );
}
DashboardBuilder.propTypes = {
    gridDimensions: PropTypes.array,
    components: PropTypes.array,
    onLayoutIdChangeInternal: PropTypes.func
};

export function LayoutSelectionMatrix({ screenid, onLayoutIdChange }) {
    const [screen, setScreen] = useState();
    useEffect(() => {
        api.get(`${getScreenByScreenId(screenid)}`)
            .then((res) => {
                setScreen(res.data.result);
            })
            .catch();
    }, [screenid]);

    const onLayoutIdChangeInternal = (e) => {
        onLayoutIdChange(e.target.value);
    };

    return (
        <>
            <>
                {screen ? (
                    <div
                        style={{
                            width: "100%",
                            border: "5px solid #e3e8e8",
                            padding: "20px",
                            height: "250px",
                            overflow: "auto",
                            borderRadius: "10px"
                        }}
                    >
                        {JSON.parse(screen.screen.screenrows).map((rowInd, rowNum) => (
                            <Grid key={rowInd} container spacing={0} style={{ height: "40px" }}>
                                {screen.components
                                    .filter((item) => JSON.parse(item.layout.position)[0][0] === rowInd.num)
                                    .map((item, index) => (
                                        <>
                                            {item.layout.status !== "C" ? (
                                                <Grid
                                                    item
                                                    xs={12}
                                                    sm={12}
                                                    md={
                                                        JSON.parse(item.layout.position)[1][1] -
                                                        (JSON.parse(item.layout.position)[0][1] - 1)
                                                    }
                                                    lg={
                                                        JSON.parse(item.layout.position)[1][1] -
                                                        (JSON.parse(item.layout.position)[0][1] - 1)
                                                    }
                                                    style={{
                                                        position: "relative",
                                                        height: "100%",
                                                        background: "#e3e8e8",
                                                        border: "1px solid white",
                                                        borderRadius: "8px"
                                                    }}
                                                >
                                                    <input
                                                        type="radio"
                                                        id={`layout-${rowNum}-${index}`}
                                                        name="fav_language"
                                                        value={item.layout.layoutid}
                                                        onChange={onLayoutIdChangeInternal}
                                                    />
                                                </Grid>
                                            ) : (
                                                <Grid
                                                    item
                                                    xs={12}
                                                    sm={12}
                                                    md={
                                                        JSON.parse(item.layout.position)[1][1] -
                                                        (JSON.parse(item.layout.position)[0][1] - 1)
                                                    }
                                                    lg={
                                                        JSON.parse(item.layout.position)[1][1] -
                                                        (JSON.parse(item.layout.position)[0][1] - 1)
                                                    }
                                                    style={{
                                                        position: "relative",
                                                        height: "100%",
                                                        background: "#e3e8e8",
                                                        border: "1px solid white",
                                                        borderRadius: "8px"
                                                    }}
                                                />
                                            )}
                                        </>
                                    ))}
                            </Grid>
                        ))}
                    </div>
                ) : (
                    <></>
                )}
            </>
        </>
    );
}
LayoutSelectionMatrix.propTypes = {
    screenid: PropTypes.string,
    onLayoutIdChange: PropTypes.func
};
// ================================|| UI TABS - COLOR ||================================ //

export default LayoutSelectionMatrix;
