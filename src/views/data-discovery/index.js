// material-ui
import { Grid, FormControl, InputLabel, MenuItem, Select, Skeleton, Typography, useTheme, CircularProgress } from "@mui/material";
import { DragDropContext, Draggable } from "react-beautiful-dnd";
import useConfig from "hooks/useConfig";
// third-party
import React, { useState, useEffect } from "react";

// project imports
import { gridSpacing } from "store/constant";
import MainCard from "ui-component/cards/MainCard";
import { useDispatch, useSelector } from "store";

import LakeDataTable from "views/lake-house/LakeDataTable";
import TotalRevenueCard from "views/new-app/components/basic/TotalRevenueCard";
import DynamicDashChart from "views/dash-charts/DynamicDashChart";
import { featuredDataSourceSelection, columnsDataDisList, updatecolumnsDataDisList } from "store/slices/AppDashboardRawSha";
import MeanModeList from "../new-app/components/basic/MeanModeList ";

import QuantitativeData from "./QuantitativeData";
import { dataSource, getStage } from "constants/generic";
import { getDataDiscoveryDataDomain, getDataDiscoverySelectedLayer } from "store/slices/tables-user-selected-val";
import StrictModeDroppable from "./dropable";
import InfiniteScroll from "react-infinite-scroll-component";
import { Box } from "@mui/system";

const getDropWrapper = (isDraggingOver, theme, radius) => {
    const bgcolor = theme.palette.mode === "dark" ? "dark.900" : "secondary.light";

    return {
        background: isDraggingOver ? bgcolor : bgcolor,
        width: "auto",
        borderRadius: radius
    };
};

const getDragWrapper = (isDragging, draggableStyle, theme, radius) => {
    const bgcolor = theme.palette.mode === "dark" ? theme.palette.background.paper + 90 : theme.palette.grey[50];
    return {
        userSelect: "none",
        margin: `0 0 ${8}px 0`,
        padding: 16,
        border: "1px solid",
        borderColor: theme.palette.mode === "dark" ? theme.palette.background.default : theme.palette.primary[200] + 75,
        backgroundColor: isDragging ? bgcolor : theme.palette.background.paper,
        borderRadius: radius,
        ...draggableStyle
    };
};
// ==============================|| KANBAN - BOARD ||============================== //

const DataDiscovery = () => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const { featuredMetaDataList, columnDatadisList, selectedFeaturedDataSource } = useSelector((state) => state.dataCollection);

    const { dataDiscoveryDataDomain, dataDiscoverySelectedLayer } = useSelector((state) => state.selectedvalue);

    const { rawDataSources } = useSelector((state) => state.dataCollection);
    const { borderRadius } = useConfig();

    const itemsPerPage = 5;
    const [displayedItems, setDisplayedItems] = useState(columnDatadisList.slice(0, itemsPerPage));
    const [hasMore, setHasMore] = useState(true);
    // eslint-disable-next-line no-unused-vars
    const [page, setPage] = useState(1);

    useEffect(() => {
        if (dataDiscoveryDataDomain === "") {
            dispatch(getDataDiscoveryDataDomain(`${rawDataSources[0]?.productclientdatasetsid}-${rawDataSources[0]?.tableid}`));
        }
    }, []);

    useEffect(() => {
        if (dataDiscoveryDataDomain !== "" && dataDiscoverySelectedLayer !== "") {
            const datasetid = Number(dataDiscoveryDataDomain?.slice(0, dataDiscoveryDataDomain.toString().search("-")));
            const tableid = Number(
                dataDiscoveryDataDomain?.slice(dataDiscoveryDataDomain.toString().search("-") + 1, dataDiscoveryDataDomain.length)
            );
            dispatch(featuredDataSourceSelection(datasetid, tableid, dataDiscoverySelectedLayer));
            dispatch(columnsDataDisList(datasetid, tableid, dataDiscoverySelectedLayer));
        }
    }, [dataDiscoveryDataDomain, dataDiscoverySelectedLayer]);

    useEffect(() => {
        setDisplayedItems(columnDatadisList.slice(0, itemsPerPage));
    }, [columnDatadisList]);

    const DataLayerChangeHandler = (event) => {
        const value = event.target.value;
        dispatch(getDataDiscoverySelectedLayer(value));
    };

    const DataSourceChangeHandler = (event) => {
        const value = event.target.value;
        dispatch(getDataDiscoveryDataDomain(value));
    };

    const onDragEnd = (result) => {
        if (!result.destination) {
            return;
        }
        if (result.destination.droppableId === result.source.droppableId && result.destination.index === result.source.index) return;

        const items = Array.from(displayedItems);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        setDisplayedItems(items);
        dispatch(updatecolumnsDataDisList(items));
    };
    const fetchMoreData = () => {
        if (displayedItems.length >= columnDatadisList.length) {
            setHasMore(false);
            return;
        }

        setTimeout(() => {
            setDisplayedItems((prevItems) => [...prevItems, ...columnDatadisList.slice(prevItems.length, prevItems.length + 1)]);
            setPage((prevPage) => prevPage + 1);
        }, 500);
    };

    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={6} lg={6}>
                    <FormControl
                        sx={{ m: 1, minWidth: 120 }}
                        style={{
                            display: "block",
                            width: "100%",
                            marginBottom: "8px",
                            paddingLeft: "0px",
                            marginLeft: "0px"
                        }}
                    >
                        <InputLabel id="catalog-select">Select Data Domain</InputLabel>
                        <Select
                            labelId="catalog-select"
                            id="catalog"
                            name="catalog"
                            fullWidth
                            value={dataDiscoveryDataDomain}
                            onChange={(e) => {
                                DataSourceChangeHandler(e);
                            }}
                            label="Select Data Domain"
                        >
                            {rawDataSources?.map((menuItem) => (
                                <MenuItem
                                    key={`${menuItem?.productclientdatasetsid}-${menuItem?.tableid}`}
                                    value={`${menuItem?.productclientdatasetsid}-${menuItem?.tableid}`}
                                >
                                    {menuItem.tablename}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={6}>
                    <FormControl
                        sx={{ m: 1, minWidth: 120 }}
                        style={{
                            display: "block",
                            width: "100%",
                            marginTop: "0px",
                            marginBottom: "8px",
                            paddingLeft: "0px",
                            marginLeft: "0px"
                        }}
                    >
                        <InputLabel id="data-layer-select">Select Layer</InputLabel>
                        <Select
                            labelId="data-layer-select"
                            id="data-source"
                            name="selected-layer-source"
                            label="Select Data Layer"
                            fullWidth
                            value={dataDiscoverySelectedLayer}
                            onChange={DataLayerChangeHandler}
                        >
                            {dataSource.map((menuItem) => (
                                <MenuItem key={menuItem} value={menuItem.value}>
                                    {menuItem.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>

            <Grid container spacing={gridSpacing}>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                    <Grid container spacing={gridSpacing} sx={{ alignItems: "stretch", height: "100%" }}>
                        <Grid item xs={12} md={10} lg={10} style={{ display: "flex", flexDirection: "column" }}>
                            {dataDiscoveryDataDomain !== "" && dataDiscoverySelectedLayer !== "" && selectedFeaturedDataSource ? (
                                <LakeDataTable
                                    dashDatasetId={selectedFeaturedDataSource.productclientdatasetsid}
                                    dashTableId={selectedFeaturedDataSource.tableid}
                                    formTitle={getStage(dataDiscoverySelectedLayer)}
                                    deltaLakeLayer={dataDiscoverySelectedLayer}
                                />
                            ) : (
                                <Skeleton variant="rectangular" height={399} />
                            )}
                        </Grid>
                        <Grid item xs={12} sm={12} md={2} lg={2} style={{ display: "flex", flexDirection: "column" }}>
                            {selectedFeaturedDataSource && featuredMetaDataList ? (
                                <TotalRevenueCard title="Metadata" data={featuredMetaDataList} />
                            ) : (
                                <Skeleton variant="rectangular" height={399} />
                            )}
                        </Grid>
                    </Grid>
                </Grid>

                <>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                        {selectedFeaturedDataSource !== null ? (
                            <>
                                <Grid container spacing={1}>
                                    <Grid item xs={12} sm={12} md={12} lg={12}>
                                        <QuantitativeData />
                                    </Grid>
                                </Grid>
                            </>
                        ) : (
                            <>
                                <Grid container>
                                    <Grid item xs={12} sm={12} md={12} lg={12}>
                                        <Skeleton variant="rectangular" height={200} />
                                    </Grid>
                                </Grid>
                            </>
                        )}
                    </Grid>
                </>

                <Grid item xs={12} sm={12} md={12} lg={12}>
                    {selectedFeaturedDataSource !== null ? (
                        <Grid container spacing={gridSpacing}>
                            <Grid item xs={12} sm={12} md={12} lg={12}>
                                <>
                                    {!featuredMetaDataList && <div>Loading....</div>}
                                    <DragDropContext onDragEnd={onDragEnd}>
                                        <MainCard
                                            sx={{
                                                border: `1px solid ${theme.palette.primary.main}`,
                                                width: "auto",
                                                m: "2px auto",
                                                mr: "2px",
                                                ml: "2px",
                                                "&::-webkit-scrollbar": {
                                                    display: "none"
                                                },
                                                scrollbarWidth: "none",
                                                overflow: "auto"
                                            }}
                                            title={
                                                <Typography
                                                    className="headingText"
                                                    variant="h3"
                                                    component="div"
                                                    sx={{ color: theme.palette.grey[700], fontSize: "18px", fontWeight: "800" }}
                                                >
                                                    QUALITATIVE DATA
                                                </Typography>
                                            }
                                            border={false}
                                        >
                                            {displayedItems.length > 0 ? (
                                                <InfiniteScroll
                                                    dataLength={displayedItems.length}
                                                    next={fetchMoreData}
                                                    hasMore={hasMore}
                                                    style={{ overflow: "disabled" }}
                                                    loader={
                                                        <Box display="flex" justifyContent="center" alignItems="center">
                                                            <CircularProgress />
                                                        </Box>
                                                    }
                                                    endMessage={
                                                        <Grid
                                                            container
                                                            sx={{
                                                                height: "100%",
                                                                width: "100%"
                                                            }}
                                                            alignItems="center"
                                                            justifyContent="center"
                                                        >
                                                            <Typography variant="body1">Reached the End of the List</Typography>
                                                        </Grid>
                                                    }
                                                >
                                                    <StrictModeDroppable droppableId="dropabless" type="group">
                                                        {(providedDrop, snapshotDrop) => (
                                                            <div
                                                                key="dropabless"
                                                                ref={providedDrop.innerRef}
                                                                {...providedDrop.droppableProps}
                                                                style={getDropWrapper(
                                                                    snapshotDrop.isDraggingOver,
                                                                    theme,
                                                                    `${borderRadius}px`
                                                                )}
                                                            >
                                                                {displayedItems &&
                                                                    displayedItems?.map((columnData, index) => (
                                                                        <>
                                                                            {columnData.attributecategory === "QUALITATIVE" && (
                                                                                <Draggable
                                                                                    key={columnData.attributeid}
                                                                                    draggableId={columnData.attributeid.toString()}
                                                                                    index={index}
                                                                                >
                                                                                    {(provided, snapshot) => (
                                                                                        <div
                                                                                            ref={provided.innerRef}
                                                                                            {...provided.draggableProps}
                                                                                            {...provided.dragHandleProps}
                                                                                            style={getDragWrapper(
                                                                                                snapshot.isDragging,
                                                                                                provided.draggableProps.style,
                                                                                                theme,
                                                                                                `${borderRadius}px`
                                                                                            )}
                                                                                        >
                                                                                            <Grid container spacing={gridSpacing}>
                                                                                                <Grid
                                                                                                    item
                                                                                                    xs={12}
                                                                                                    sx={{ marginBottom: "10px" }}
                                                                                                >
                                                                                                    <Typography variant="h3">
                                                                                                        {columnData.attributename}
                                                                                                    </Typography>
                                                                                                </Grid>
                                                                                                <Grid
                                                                                                    container
                                                                                                    item
                                                                                                    spacing={gridSpacing}
                                                                                                    sx={{ justifyContent: "space-between" }}
                                                                                                >
                                                                                                    <Grid
                                                                                                        item
                                                                                                        xs={5}
                                                                                                        sm={5}
                                                                                                        md={5}
                                                                                                        lg={5}
                                                                                                        style={{
                                                                                                            marginTop: "20px",
                                                                                                            height: "280px",
                                                                                                            marginRight: "2px"
                                                                                                        }}
                                                                                                    >
                                                                                                        <MeanModeList obj={columnData} />
                                                                                                    </Grid>

                                                                                                    <Grid
                                                                                                        item
                                                                                                        xs={6}
                                                                                                        sm={6}
                                                                                                        md={6}
                                                                                                        lg={6}
                                                                                                        style={{
                                                                                                            marginLeft: "2px"
                                                                                                        }}
                                                                                                    >
                                                                                                        {selectedFeaturedDataSource ? (
                                                                                                            <>
                                                                                                                {selectedFeaturedDataSource && (
                                                                                                                    <DynamicDashChart
                                                                                                                        dsid={
                                                                                                                            selectedFeaturedDataSource.productclientdatasetsid
                                                                                                                        }
                                                                                                                        taid={
                                                                                                                            selectedFeaturedDataSource.tableid
                                                                                                                        }
                                                                                                                        attid={
                                                                                                                            columnData &&
                                                                                                                            columnData.attributeid
                                                                                                                        }
                                                                                                                        type="Doughnut Chart"
                                                                                                                        board="dataDiscovery"
                                                                                                                        functionname="RAW-DATA-DISCOVERY-SINGLEVARIABLE"
                                                                                                                    />
                                                                                                                )}
                                                                                                                {!selectedFeaturedDataSource && (
                                                                                                                    <div>Loading....</div>
                                                                                                                )}
                                                                                                            </>
                                                                                                        ) : (
                                                                                                            <Skeleton
                                                                                                                variant="rectangular"
                                                                                                                height="280px"
                                                                                                            />
                                                                                                        )}
                                                                                                    </Grid>
                                                                                                </Grid>
                                                                                            </Grid>
                                                                                        </div>
                                                                                    )}
                                                                                </Draggable>
                                                                            )}
                                                                        </>
                                                                    ))}
                                                                {providedDrop.placeholder}
                                                            </div>
                                                        )}
                                                    </StrictModeDroppable>
                                                </InfiniteScroll>
                                            ) : (
                                                <Grid
                                                    container
                                                    sx={{
                                                        height: "100%",
                                                        width: "100%"
                                                    }}
                                                    alignItems="center"
                                                    justifyContent="center"
                                                >
                                                    <Typography variant="body1">No Records Available</Typography>
                                                </Grid>
                                            )}
                                        </MainCard>
                                    </DragDropContext>
                                </>
                            </Grid>
                        </Grid>
                    ) : (
                        <Skeleton variant="rectangular" height="280px" />
                    )}
                </Grid>
            </Grid>
        </>
    );
};

export default DataDiscovery;
