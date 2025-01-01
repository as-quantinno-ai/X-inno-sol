// material-ui
import { Grid, FormControl, InputLabel, MenuItem, Select, Box } from "@mui/material";

// third-party
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import React, { useEffect } from "react";

// project imports
import Columns from "./Columns";
import ItemDetails from "./ItemDetails";
import MainCard from "ui-component/cards/MainCard";
import { useDispatch, useSelector } from "store";
import { getColumns, getItems } from "store/slices/kanban";
import { getConfigurations } from "store/slices/datasource-configuration";
import { getDataCurationDataDomain } from "store/slices/tables-user-selected-val";

const getDragWrapper = (isDraggingOver) => ({
    p: 1,
    bgcolor: isDraggingOver ? "primary.200" : "transparent",
    display: "flex",
    overflow: "auto"
});

// ==============================|| KANBAN - BOARD ||============================== //

const Board = () => {
    const dispatch = useDispatch();
    const { columns } = useSelector((state) => state.kanban);
    const { rawDataSources } = useSelector((state) => state.dataCollection);
    // const { dataCurationDataDomain, dataDiscoverySelectedLayer } = useSelector((state) => state.selectedvalue);
    const { dataCurationDataDomain } = useSelector((state) => state.selectedvalue);

    useEffect(() => {
        if (dataCurationDataDomain === "" && rawDataSources) {
            dispatch(getDataCurationDataDomain(`${rawDataSources[0].productclientdatasetsid}-${rawDataSources[0].tableid}`));
        }
    }, []);

    useEffect(() => {
        if (dataCurationDataDomain !== null) {
            const datasetid = Number(dataCurationDataDomain?.slice(0, dataCurationDataDomain.toString().search("-")));
            const tableid = Number(
                dataCurationDataDomain?.slice(dataCurationDataDomain.toString().search("-") + 1, dataCurationDataDomain.length)
            );

            dispatch(getColumns(datasetid, tableid, dispatch));
            dispatch(getConfigurations(tableid));
            dispatch(getItems(datasetid, tableid));
        }
    }, [dataCurationDataDomain]);

    const DataSourceChangeHandler = (event) => {
        const value = event.target.value;
        dispatch(getDataCurationDataDomain(value));
    };

    return (
        <>
            <Grid item xs={12} sm={12} md={12} lg={12}>
                <FormControl
                    sx={{ m: 1, minWidth: 120 }}
                    style={{
                        display: "block",
                        width: "100%",
                        marginTop: "0px",
                        paddingLeft: "0px",
                        marginLeft: "0px"
                    }}
                >
                    <InputLabel id="data-source-select">Select Data Domain</InputLabel>
                    <Select
                        labelId="data-source-select"
                        id="data-source"
                        name="age"
                        fullWidth
                        value={dataCurationDataDomain}
                        onChange={DataSourceChangeHandler}
                        label="Select Data Source"
                    >
                        {rawDataSources?.map((menuItem) => {
                            let tag = <></>;
                            if (MenuItem) {
                                tag = (
                                    <MenuItem value={`${menuItem.productclientdatasetsid}-${menuItem.tableid}`}>
                                        {menuItem.tablename}
                                    </MenuItem>
                                );
                            }
                            return tag;
                        })}
                    </Select>
                </FormControl>
            </Grid>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    overflowX: "auto",
                    overflowY: "hidden",
                    width: "100%",
                    height: "auto",
                    padding: "20px",
                    borderRadius: "8px",
                    backgroundColor: "background.paper"
                    // boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
            >
                {columns && dataCurationDataDomain && (
                    <DragDropContext>
                        <Droppable droppableId="columns" direction="horizontal" type="column">
                            {(provided, snapshot) => (
                                <MainCard
                                    border={false}
                                    ref={provided.innerRef}
                                    contentSX={getDragWrapper(snapshot.isDraggingOver)}
                                    {...provided.droppableProps}
                                >
                                    {columns &&
                                        columns
                                            .filter((layer) => layer.stage !== "PRE_BRONZE")
                                            .map((layer, index) => (
                                                <Columns
                                                    key={layer?.deltalakelayerid || index}
                                                    column={layer}
                                                    index={index}
                                                    selectedValue={dataCurationDataDomain}
                                                />
                                            ))}
                                    {provided.placeholder}
                                </MainCard>
                            )}
                        </Droppable>
                    </DragDropContext>
                )}
                <ItemDetails />
            </Box>
        </>
    );
};

export default Board;
