import React from "react";
import { Box, Typography, CircularProgress } from "@mui/material";

const FEATURE_RESOURCE = {
    RAW: "raw",
    FEATURE: "feature",
    ML_MODEL: "mlmodel",
    ALL: "all"
};

export const TOOLTIP_TITLE = {
    RELOAD_GRID: "Reload Grid",
    FILTER: "Filter"
};

export const titleStyles = {
    fontSize: "18px",
    fontWeight: 800
};
export default FEATURE_RESOURCE;

// util-function

export const getNoMatchContent = (error, loading, dataCount, data) => {
    if (error) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Typography color="error">Feature Not Available at The Moment</Typography>
            </Box>
        );
    }
    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <CircularProgress />
            </Box>
        );
    }
    if (dataCount === 0) {
        return <Typography>No Records Available</Typography>;
    }
    return data;
};
