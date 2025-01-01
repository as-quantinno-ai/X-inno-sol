import React, { useEffect } from "react";

// material-ui
import { Box, Grid } from "@mui/material";

// project imports
import { useDispatch } from "store";
import { openDrawer } from "store/slices/menu";
import MainCard from "ui-component/cards/MainCard";
import Board from "./Board";

// ==============================|| APPLICATION - KANBAN ||============================== //

export default function KanbanPage() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(openDrawer(true));
    }, []);

    return (
        <Box sx={{ display: "flex" }}>
            <Grid container>
                <Grid item xs={12}>
                    <MainCard contentSX={{ p: 2 }} title="Data Curation">
                        <Board />
                    </MainCard>
                </Grid>
            </Grid>
        </Box>
    );
}
