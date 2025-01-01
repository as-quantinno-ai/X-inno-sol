import React, { useState } from "react";
import { Grid } from "@mui/material";

import DataCollectionTable from "../components/basic/DataCollectionTable";
import { gridSpacing } from "store/constant";

// =============================|| LANDING - FEATURE PAGE ||============================= //

const DataCollection = () => {
    const [submitted] = useState(false);
    return (
        <>
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12} lg={12}>
                    <DataCollectionTable submitted={submitted} />
                </Grid>
            </Grid>
        </>
    );
};

export default DataCollection;
