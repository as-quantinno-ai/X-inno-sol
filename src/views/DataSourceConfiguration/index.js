import React from "react";
// material-ui
// import { useTheme } from "@mui/material/styles";
import { Grid } from "@mui/material";
import { gridSpacing } from "store/constant";
import MainCard from "views/new-app/components/basic/cards/MainCard";

import ConfigurationTabs from "./ConfigurationTabs";

const DataSourceConfiguration = () => {
    // const theme = useTheme();

    return (
        <MainCard title="Data Source Configuration">
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12} md={12}>
                    <ConfigurationTabs />
                </Grid>
            </Grid>
        </MainCard>
    );
};

export default DataSourceConfiguration;
