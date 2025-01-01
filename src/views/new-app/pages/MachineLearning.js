import React from "react";
import { Grid } from "@mui/material";

import MachineLearningExpansionTable from "../components/basic/MachineLearningExpansionTable";
import { gridSpacing } from "store/constant";

// =============================|| LANDING - FEATURE PAGE ||============================= //

const MachineLearning = () => (
    <>
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12} lg={12}>
                <MachineLearningExpansionTable />
            </Grid>
        </Grid>
    </>
);

export default MachineLearning;
