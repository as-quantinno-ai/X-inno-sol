import MUIDataTable from "mui-datatables";
import React, { useState, useEffect, useRef } from "react";
import { getDataLakePipelineLayersDetailsByDatasetidandTableid, getFormattedDatetime } from "views/api-configuration/default";
import RefreshIcon from "@mui/icons-material/Refresh";
import PropTypes from "prop-types";
import PublishToDashboardForm from "../new-app/components/basic/PublishToDashboardForm";
import FormArea from "../new-app/components/FormArea";
import { useSelector } from "store";

import { Box, Typography, IconButton, Tooltip, useTheme } from "@mui/material";

import CircularProgress from "@mui/material/CircularProgress";
import FiltersForm from "../new-app/components/basic/FiltersForm";
import api from "views/api-configuration/api";
import { IconArrowUp, IconArrowDown } from "@tabler/icons";
import { makeStyles } from "@mui/styles";
import { filterKeys, formatKey } from "constants/generic";

// assets
// const useStyles = makeStyles((theme) => ({
const useStyles = makeStyles(() => ({
    table: {
        "& .MuiTableCell-root": {
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "200px"
        },
        "& .MuiTableCell-head": {
            fontSize: "10px",
            fontWeight: "bold",
            resize: "horizontal"
        }
    },
    title: {
        fontWeight: "bold",
        fontSize: "1.5rem",
        color: "#333"
    }
}));

const GridPublishTypeNEvents = ({ deltaLakeLayer, referenceid, tableid, onDashboard }) => {
    let elem = <></>;

    elem = (
        <>
            {onDashboard ? (
                <></>
            ) : (
                <FormArea
                    form={
                        <PublishToDashboardForm
                            functionname="RAW-DATA-GRID"
                            referenceid={referenceid}
                            tableid={tableid}
                            stage={deltaLakeLayer}
                            componentDisplayType="GRID"
                        />
                    }
                    btnTitle="Publish"
                />
            )}
        </>
    );

    return elem;
};

GridPublishTypeNEvents.propTypes = {
    onDashboard: PropTypes.bool,
    deltaLakeLayer: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    referenceid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    tableid: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};
const LakeDataTable = ({
    // data,
    type,
    mlmodelRefId,
    dashDatasetId,
    dashTableId,
    onDashboard,
    componentDataId,
    id,
    formTitle,
    deltaLakeLayer,
    refreshDataTable,
    datasource
}) => {
    const classes = useStyles();
    const theme = useTheme();
    const { selectedFeaturedDataSource } = useSelector((state) => state.dataCollection);
    const { selectedRawDataSource } = useSelector((state) => state.dataCollection);

    const [actionBtns, setActionBtns] = useState(null);
    const [tableDataState, setTableDataState] = useState([]);
    // eslint-disable-next-line no-unused-vars
    const [tableSearchDataState, setSearchTableDataState] = useState([]);

    const [tableHeaderState, setTableHeaderState] = useState([]);
    const [rowCount, setRowCount] = useState(10);
    const [pageCount, setPageCount] = useState(0);
    const [totalCount, setTotalCount] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [columnWidths, setColumnWidths] = useState({});

    const fetchData = async () => {
        try {
            setLoading(true);
            setTableDataState([]);
            setActionBtns(null);
            setTotalCount(null);

            api.get(
                getDataLakePipelineLayersDetailsByDatasetidandTableid(
                    dashDatasetId,
                    dashTableId,
                    deltaLakeLayer,
                    datasource || 0,
                    rowCount,
                    pageCount * rowCount
                )
            )
                .then((response) => {
                    setLoading(false);
                    const parsedData = JSON.parse(response.data.data);
                    setTotalCount(response?.data.data_count);
                    const dataTypes = response?.data?.data_types;
                    if (parsedData.length > 0) {
                        setTableDataState(parsedData);
                        setTotalCount(response?.data.data_count);
                        setError(null);
                        /*eslint-disable */
                        const newTableHeaderState = parsedData[0]
                            ? filterKeys(Object.keys(parsedData[0]).slice(1, Object.keys(parsedData[0]).length)).map((item) => ({
                                  label: formatKey(item),
                                  name: item,
                                  options: {
                                      filter: true,
                                      sort: true,
                                      wrap: true,
                                      customBodyRender: (value, index) => {
                                          const isTimestamp = dataTypes[item] === "timestamp";
                                          return (
                                              <div
                                                  style={{
                                                      whiteSpace: "nowrap",
                                                      overflow: "hidden",
                                                      textOverflow: "ellipsis",
                                                      maxWidth: columnWidths[index] || "auto"
                                                  }}
                                              >
                                                  {isTimestamp ? getFormattedDatetime(value) : value}
                                              </div>
                                          );
                                      }
                                  }
                              }))
                            : [];
                        setTableHeaderState(newTableHeaderState);
                    } else {
                        setLoading(false);
                        setTotalCount(response?.data.data_count);
                        setTableHeaderState([]);
                    }
                })
                .catch((error) => {
                    setLoading(false);
                    setError("This Feature Not Available At The Moment");
                    console.error("Errorrr fetching data:", error);
                });
        } catch (error) {
            setLoading(false);
            setError("This Feature Not Available At The Moment");
        }
    };
    /*eslint-enable */
    useEffect(() => {
        fetchData();
    }, [dashDatasetId, dashTableId, deltaLakeLayer, rowCount, pageCount, refreshDataTable]);

    useEffect(() => {
        setTotalCount(null);
        setError(null);
        setTableHeaderState([]);
        setPageCount(0);
    }, []);

    useEffect(() => {
        if (pageCount !== 0) {
            setPageCount(0);
        }
    }, [dashDatasetId, dashTableId]);

    let noMatchContent;

    if (loading) {
        noMatchContent = (
            <Box sx={{ display: "flex", justifyContent: "center", marginTop: "207px", marginBottom: "207px", alignItems: "center" }}>
                <CircularProgress />
            </Box>
        );
    } else if (error) {
        noMatchContent = (
            <Box sx={{ display: "flex", justifyContent: "center", marginTop: "207px", marginBottom: "207px", alignItems: "center" }}>
                <Typography color="error">{error}</Typography>
            </Box>
        );
    } else {
        noMatchContent = "No Records Available";
    }

    const handleReload = () => {
        fetchData();
    };

    const resizingColumnIndex = useRef(null);
    const startX = useRef(null);
    const startWidth = useRef(null);

    const onResize = (e) => {
        if (resizingColumnIndex.current !== null) {
            const deltaX = e.clientX - startX.current;
            const newWidth = Math.max(40, startWidth.current + deltaX);
            setColumnWidths((prevWidths) => ({
                ...prevWidths,
                [resizingColumnIndex.current]: newWidth
            }));
        }
    };

    const onResizeEnd = () => {
        resizingColumnIndex.current = null;
        document.removeEventListener("mousemove", onResize);
        document.removeEventListener("mouseup", onResizeEnd);
    };

    const onResizeStart = (e, index) => {
        e.preventDefault();
        resizingColumnIndex.current = index;
        startX.current = e.clientX;
        startWidth.current = e.target.parentElement.clientWidth;
        document.addEventListener("mousemove", onResize);
        document.addEventListener("mouseup", onResizeEnd);
    };

    const [sortConfig, setSortConfig] = useState({ key: "asc", direction: "asc" });

    const handleSort = (columnName) => {
        const isAsc = sortConfig.key === columnName && sortConfig.direction === "asc";
        const direction = isAsc ? "desc" : "asc";

        const sortedData = [...tableDataState].sort((a, b) => {
            if (typeof a[columnName] === "number" && typeof b[columnName] === "number") {
                return direction === "asc" ? a[columnName] - b[columnName] : b[columnName] - a[columnName];
            } else {
                const strA = a[columnName] ? a[columnName].toString() : "";
                const strB = b[columnName] ? b[columnName].toString() : "";
                return direction === "asc" ? strA.localeCompare(strB) : strB.localeCompare(strA);
            }
        });

        setSortConfig({ key: columnName, direction });
        setTableDataState(sortedData);
    };

    const columns = tableHeaderState.map((header, index) => ({
        ...header,
        options: {
            ...header.options,
            filter: true,
            sort: true,
            customHeadRender: (columnMeta) => (
                <th
                    key={index}
                    style={{
                        width: columnWidths[columnMeta.index] || "auto",
                        minWidth: "40px",
                        maxWidth: columnWidths[columnMeta.index] || "auto",
                        position: "sticky",
                        top: 0,
                        left: 0,
                        background: theme.palette.background.paper,
                        zIndex: 1020,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        paddingLeft: "10px",
                        paddingRight: "20px",
                        textAlign: "start",
                        cursor: "pointer"
                    }}
                    onClick={() => handleSort(header.name)}
                    className="custom-header"
                >
                    <p
                        style={{
                            width: columnWidths[columnMeta.index] || "auto",
                            minWidth: "40px",
                            maxWidth: columnWidths[columnMeta.index] || "auto",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            paddingLeft: "10px",
                            paddingRight: "20px",
                            textAlign: "start",
                            display: "inline-block",
                            margin: 0,
                            padding: 0
                        }}
                    >
                        {header.label}
                        {sortConfig.key === header.name &&
                            (sortConfig.direction === "asc" ? (
                                <IconArrowUp size={16} style={{ marginLeft: "8px" }} />
                            ) : (
                                <IconArrowDown size={16} style={{ marginLeft: "8px" }} />
                            ))}
                    </p>
                    <div
                        className="resize-handle"
                        style={{
                            position: "absolute",
                            right: 0,
                            top: 0,
                            bottom: 0,
                            width: "5px",
                            cursor: "col-resize",
                            backgroundColor: "transparent"
                        }}
                        onMouseDown={(e) => onResizeStart(e, index)}
                    >
                        I
                    </div>
                </th>
            )
        }
    }));

    const options = {
        tableBodyMaxHeight: "458px",
        selectableRows: "none",
        selectableRowsVisibleOnly: false,
        elevation: 0,
        filter: true,
        serverSide: true,
        onSearchChange: (searchText) => {
            if (!searchText) {
                setTableDataState(tableSearchDataState);
                return;
            }
            const filteredData = tableDataState.filter((row) =>
                Object.values(row).some((value) => value && value.toString().toLowerCase().includes(searchText.toLowerCase()))
            );

            setTableDataState(filteredData);
        },
        rowsPerPageOptions: [10, 50, 100],

        rowsPerPage: rowCount,
        count: totalCount,
        page: pageCount,
        textLabels: {
            body: {
                noMatch: noMatchContent
            }
        },
        onTableChange: (action, tableState) => {
            setRowCount(tableState.rowsPerPage);
            setPageCount(tableState.page);
        },
        customToolbar: () => (
            <>
                {["BRONZE", "SILVER", "GOLD"].includes(deltaLakeLayer) ? (
                    <GridPublishTypeNEvents
                        type={type}
                        mlmodelRefId={mlmodelRefId}
                        actionButtons={actionBtns}
                        referenceid={id}
                        tableid={dashTableId || selectedRawDataSource?.tableid || selectedFeaturedDataSource?.tableid}
                        onDashboard={onDashboard}
                    />
                ) : (
                    <></>
                )}
                <>
                    <Tooltip title="Reload Grid">
                        <IconButton onClick={handleReload}>
                            <RefreshIcon />
                        </IconButton>
                    </Tooltip>
                </>

                {onDashboard ? (
                    <FormArea
                        form={
                            <FiltersForm
                                componentDataId={componentDataId}
                                datasetid={
                                    dashDatasetId ||
                                    selectedRawDataSource?.productclientdatasetsid ||
                                    selectedFeaturedDataSource?.productclientdatasetsid
                                }
                                tableid={dashTableId || selectedRawDataSource?.tableid || selectedFeaturedDataSource?.tableid}
                            />
                        }
                        btnTitle=""
                        icon="true"
                    />
                ) : (
                    <></>
                )}
            </>
        )
    };

    const titleStyles = {
        fontSize: "18px",
        fontWeight: 800
    };

    return (
        <>
            <>
                <>
                    <div key={dashTableId} style={{ marginBottom: "20px" }}>
                        <MUIDataTable
                            title={<div style={titleStyles}>{formTitle}</div>}
                            data={tableDataState}
                            columns={columns}
                            options={options}
                            className={classes.table}
                        />
                    </div>
                </>
            </>
        </>
    );
};

LakeDataTable.propTypes = {
    data: PropTypes.array,
    type: PropTypes.string,
    mlmodelRefId: PropTypes.string,
    dashDatasetId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    dashTableId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onDashboard: PropTypes.bool,
    componentDataId: PropTypes.string,
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    formTitle: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    deltaLakeLayer: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    refreshDataTable: PropTypes.func,
    datasource: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};
export default LakeDataTable;
