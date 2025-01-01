// import { createTheme } from "@mui/material/styles";
import PropTypes from "prop-types";

import MUIDataTable from "mui-datatables";
import React, { useState, useEffect } from "react";
import { GetAccessToken, getRawIngestedFiles, getFormattedDatetime } from "views/api-configuration/default";
import RefreshIcon from "@mui/icons-material/Refresh";

// import { useSelector, useDispatch } from "store";
// import axios from "axios";
// import { Box, ListItemIcon, Typography, Button, IconButton, Tooltip, Grid } from "@mui/material";
import { Box, Typography, IconButton, Tooltip, Grid } from "@mui/material";

import CircularProgress from "@mui/material/CircularProgress";
import api from "views/api-configuration/api";

// assets

export function formatTimestamp(timestampString) {
    const dateObject = new Date(timestampString);
    const day = dateObject.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
    const hours = dateObject.getHours().toString().padStart(2, "0");
    const minutes = dateObject.getMinutes().toString().padStart(2, "0");
    const time = `${hours}:${minutes}`;
    return `${day} ${time}`;
}

// const theme = createTheme({
//     components: {
//         MuiTableCell: {
//             styleOverrides: {
//                 root: {
//                     fontSize: "12px",
//                     padding: "10px!important"
//                 }
//             }
//         }
//     }
// });

const RawIngestedFilesTable = ({ datasourceId, datasetId, tableId, formTitle, refreshDataTable }) => {
    // eslint-disable-next-line no-unused-vars
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

    const fetchData = async () => {
        try {
            setLoading(true);
            setTableDataState([]);
            setActionBtns(null);
            setTotalCount(null);

            api.get(getRawIngestedFiles(datasourceId, datasetId, tableId), {
                headers: GetAccessToken()
            })
                .then((response) => {
                    setLoading(false);

                    // const parsedData = response.data.result;
                    setTotalCount(response?.data.data_count);

                    if (response.data.result) {
                        setError(null);
                        const unprocessedData = response.data.result.unprocessed
                            .map((item) => {
                                const [filename, timestamp] = item.split(" | ");
                                const formattedString = getFormattedDatetime(timestamp);
                                return { filename, timestamp: formattedString, status: "unprocessed" };
                            })

                            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                        const processedData = response.data.result.processed
                            .map((item) => {
                                const [filename, timestamp] = item.split(" | ");
                                const formattedString = getFormattedDatetime(timestamp);

                                return { filename, timestamp: formattedString, status: "processed" };
                            })
                            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

                        const errorData = response.data.result.error
                            .map((item) => {
                                const [filename, timestamp] = item.split(" | ");
                                const formattedString = getFormattedDatetime(timestamp);

                                return { filename, timestamp: formattedString, status: "error" };
                            })
                            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

                        const combinedData = [...unprocessedData, ...processedData, ...errorData].sort(
                            (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
                        );

                        setTableDataState(combinedData);
                        /*eslint-disable*/
                        const newTableHeaderState = [
                            ...(combinedData[0]
                                ? Object.keys(combinedData[0]).map((item) => ({
                                      label: item.toUpperCase(),
                                      name: item,
                                      options: {
                                          filter: true,
                                          sort: true,
                                          // customBodyRender: (value, tableMeta, updateValue) => <div>{value}</div>
                                          customBodyRender: (value) => <div>{value}</div>
                                      }
                                  }))
                                : [])
                        ];
                        /*eslint-enable*/
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
            console.log(error.message);
            setLoading(false);
            setError("This Feature Not Available At The Moment");
        }
    };

    useEffect(() => {
        // setPageCount(0);
        fetchData();
    }, [datasourceId, tableId, datasetId, rowCount, pageCount, refreshDataTable]);

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
    }, [datasetId, tableId]);

    let noMatchContent;

    if (loading) {
        noMatchContent = (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <CircularProgress />
            </Box>
        );
    } else if (error) {
        noMatchContent = (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Typography color="error">{error}</Typography>
            </Box>
        );
    } else {
        noMatchContent = "No Records Available";
    }

    const handleReload = () => {
        fetchData();
    };

    const options = {
        tableBodyMaxHeight: "380px",
        selectableRows: "none",
        selectableRowsVisibleOnly: false,
        // responsive: 'stacked',
        filter: true,
        // confirmFilters: true,
        serverSide: true,
        // rowsPerPage: rowCount,
        // page: pageCount,
        onSearchChange: (searchText) => {
            if (!searchText) {
                setTableDataState(tableSearchDataState);
                return;
            }
            const filteredData = tableDataState.filter((row) =>
                Object.values(row).some((value) => value?.toString().toLowerCase().includes(searchText.toLowerCase()))
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
                <Tooltip title="Reload Grid">
                    <IconButton onClick={handleReload}>
                        <RefreshIcon />
                    </IconButton>
                </Tooltip>
            </>
        )
    };

    const titleStyles = {
        fontSize: "18px",
        fontWeight: 800
    };

    return (
        <>
            <div key={tableId} style={{ marginTop: "10px" }}>
                <Grid container spacing={4}>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                        <MUIDataTable
                            title={<Typography style={titleStyles}>{formTitle}</Typography>}
                            data={tableDataState}
                            columns={tableHeaderState}
                            options={options}
                        />
                    </Grid>
                </Grid>
            </div>
        </>
    );
};

RawIngestedFilesTable.propTypes = {
    datasourceId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    datasetId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    tableId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    formTitle: PropTypes.string,
    refreshDataTable: PropTypes.func
};
export default RawIngestedFilesTable;
