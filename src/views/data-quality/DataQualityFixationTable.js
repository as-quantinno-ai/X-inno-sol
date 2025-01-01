import MUIDataTable from "mui-datatables";
import React, { useEffect, useState } from "react";
import { FormControl, Select, MenuItem, Grid, Button, InputLabel, CircularProgress, Box, Typography } from "@mui/material";
import api from "views/api-configuration/api";
import { useTheme } from "@mui/material/styles";

import {
    getDataByMatchingValue,
    // getcolumnDataDisByStage,
    updateFailedRule,
    getFormattedDatetime,
    queryBasedGetRefColumnData
} from "views/api-configuration/default";
// import { useParams } from "react-router-dom";
import { useSelector, dispatch } from "store";
import { openSnackbar } from "store/slices/snackbar";
import { getNoMatchContent } from "constants/tables";
// import PropTypes from "prop-types";
const DataQualityFixation = () => {
    const {
        selectedDatasetId,
        selectedTableId,
        viewName,
        searchValue,
        // attribVal,
        attribName,
        // refTableId,
        dqRuleId,
        refAttribName,
        refViewName
    } = useSelector((state) => state.qualitycontroller);
    const [selectedColumn, setSelectedColumn] = useState("");
    const [tableHeader, setTableHeader] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [columnDis, setColumnDis] = useState(null);

    const [error, setError] = useState(null);
    const [uuids, setuuids] = useState([]);
    const [selectedUuids, setSelectedUuids] = useState(null);
    const [rowCount, setRowCount] = useState(10);
    const [pageCount, setPageCount] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    // eslint-disable-next-line no-unused-vars
    const [refDataRowsCount, setRefCloumnDataRowsCount] = useState(100);
    const [refDataOffsetCount, setRefDataOffsetCount] = useState(0);

    const [selectedRefColumn, setSelectedRefColumn] = useState(null);
    const [correctDataTotalCount, setCorrectDataTotalCount] = useState(null);

    const [loadingMore, setLoadingMore] = useState(false);

    const [loading, setLoading] = useState(false);
    const [loadingApplyForAll, setLoadingApplyForAll] = useState(false);

    const handleSelectedDistinctValue = (e) => {
        const selectedItem = columnDis.find((item) => item.uuid_identifier_da_an_v1 === e.target.value);

        setSelectedColumn(selectedItem.COUNTRY);
        setSelectedRefColumn(selectedItem.uuid_identifier_da_an_v1);
    };

    const onRowSelectionChange = (currentRowsSelected, allRowsSelected, rowsSelected) => {
        const ids = rowsSelected.map((index) => tableData[index].uuid_identifier_da_an_v1);
        setSelectedUuids(ids);
    };

    const fetchCorrectData = async () => {
        const colmnDataDis = await api.get(queryBasedGetRefColumnData(refViewName, refAttribName, refDataRowsCount, refDataOffsetCount));
        setRefDataOffsetCount(refDataOffsetCount + refDataRowsCount);
        setLoadingMore(true);
        if (colmnDataDis.data && colmnDataDis.data.data && colmnDataDis.data.data[0]) {
            try {
                const resp = colmnDataDis.data.data;
                const totalCount = colmnDataDis.data.data_count;
                setCorrectDataTotalCount(totalCount);
                if (columnDis !== null) {
                    setColumnDis((prevColumnDis) => [...prevColumnDis, ...JSON.parse(resp)]);
                } else {
                    setColumnDis(JSON.parse(resp));
                }
            } catch (e) {
                console.error("Error parsing distinctValues:", e);
            } finally {
                setLoadingMore(false);
            }
        }
    };

    const fetchData = async (limit, offset) => {
        setLoading(true);

        try {
            const response = await api.post(getDataByMatchingValue(selectedDatasetId, selectedTableId, limit, offset), {
                viewname: viewName,
                column: attribName,
                value_to_search: searchValue
            });
            if (response.data && response.data.data_count > 0) {
                const parsedData = response.data.data.map((item) => {
                    try {
                        return JSON.parse(item);
                    } catch (e) {
                        setError("Error in data format." + e.message);
                        return {};
                    }
                });

                const dataLength = response.data.data_count;
                const uuidsArray = response.data.uuids;

                setuuids(uuidsArray);
                setTableData(parsedData);
                setTotalCount(dataLength);

                let tableColumns = [];
                try {
                    const parsedFirstItem = JSON.parse(response.data.data[0]);
                    tableColumns = Object.keys(parsedFirstItem)
                        .filter((key) => key !== "uuid_identifier_da_an_v1" && key !== "partition_xan")
                        .map((key) => ({
                            name: key,
                            label: key
                                .replace(/_xan/g, "")
                                .replace(/timestamp_identifier_da_an_v1/g, "Timestamp")
                                .replace(/([_])/g, " ")
                                .replace(/^./, (str) => str.toUpperCase()),
                            options: {
                                filter: true,
                                sort: true,
                                wrap: true,
                                width: 300,
                                // customBodyRender: (value, tableMeta, updateValue) => {
                                customBodyRender: (value) => {
                                    if (key === "timestamp_identifier_da_an_v1") {
                                        return <div style={{ width: 80 * 4 }}>{getFormattedDatetime(value)}</div>;
                                    }
                                    return <div style={{ width: 80 * 4 }}>{value}</div>;
                                }
                            }
                        }));

                    setTableHeader(tableColumns);
                } catch (e) {
                    console.error("Error parsing first item:", e);
                    setError("Feature Not Available At The Moment");
                }
            } else {
                setTotalCount(0);
                setTableHeader([]);
                setError(null);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            setError("Feature Not Available At The Moment");
        } finally {
            setLoading(false);
        }
    };

    const handleScroll = (event) => {
        const { scrollHeight, scrollTop, clientHeight } = event.target;
        const threshold = 5;
        const isAtBottom = Math.abs(scrollHeight - scrollTop - clientHeight) <= threshold;

        if (isAtBottom && !loadingMore && columnDis.length < correctDataTotalCount) {
            fetchCorrectData();
        }
    };

    useEffect(() => {
        fetchCorrectData();
    }, [selectedDatasetId, attribName]);

    const noMatchContent = getNoMatchContent(error, loading, totalCount);

    const options = {
        serverSide: true,
        selectableRowsVisibleOnly: false,
        onRowSelectionChange,
        tableBodyMaxHeight: "380px",
        elevation: 0,
        responsive: "standard",
        // responsive: 'stacked',
        filter: true,
        download: false,
        sort: false,
        print: false,
        selectableRows: "multiple",
        textLabels: {
            body: {
                noMatch: noMatchContent
            }
        },
        pagination: true,
        rowsPerPageOptions: [10, 50, 100],

        rowsPerPage: rowCount,

        count: totalCount,
        page: pageCount,

        onTableChange: (action, tableState) => {
            if (action === "changePage" || action === "changeRowsPerPage") {
                const newPageCount = action === "changePage" ? tableState.page : 0;
                setPageCount(newPageCount);
                setRowCount(tableState.rowsPerPage);
            }
        }

        // confirmFilters: true,
    };

    useEffect(() => {
        setTableData([]);
        if (selectedDatasetId) {
            fetchData(rowCount, pageCount * rowCount);
        }
    }, [selectedDatasetId, pageCount, rowCount]);

    const titleStyles = {
        fontSize: "18px",
        fontWeight: 800
    };

    const handleApplyForAll = async () => {
        setLoadingApplyForAll(true);

        try {
            const getAllUuids = await api.post(getDataByMatchingValue(selectedDatasetId, selectedTableId, totalCount, 0), {
                viewname: viewName,
                column: attribName,
                value_to_search: searchValue
            });
            const uuidsArray = await getAllUuids.data.uuids;

            const payload = {
                failedattributevalue: searchValue,
                existingattributevalue: selectedColumn,
                refuuid: selectedRefColumn,
                ruleid: dqRuleId,
                uuids: uuidsArray
            };
            const resp = await api.put(updateFailedRule, payload);
            if (resp) {
                setLoadingApplyForAll(false);

                dispatch(
                    openSnackbar({
                        open: true,
                        message: "Applied For All",
                        variant: "alert",
                        alert: {
                            color: "success"
                        },
                        close: false
                    })
                );
            }
        } catch {
            setLoadingApplyForAll(false);

            dispatch(
                openSnackbar({
                    open: true,
                    message: "Error Applying Filter",
                    variant: "alert",
                    alert: {
                        color: "error"
                    },
                    close: false
                })
            );
        }
    };

    const handleApply = async () => {
        try {
            const payload = {
                failedattributevalue: searchValue,
                existingattributevalue: selectedColumn,
                refuuid: selectedRefColumn,
                ruleid: dqRuleId,
                uuids: selectedUuids
            };

            const response = await api.put(updateFailedRule, payload);
            if (response) {
                dispatch(
                    openSnackbar({
                        open: true,
                        message: "Applied For All",
                        variant: "alert",
                        alert: {
                            color: "success"
                        },
                        close: false
                    })
                );
            }
        } catch {
            dispatch(
                openSnackbar({
                    open: true,
                    message: "Error Applying Filter",
                    variant: "alert",
                    alert: {
                        color: "error"
                    },
                    close: false
                })
            );
        }
    };

    const theme = useTheme();

    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={5}>
                    <div
                        style={{
                            backgroundColor: "white",
                            padding: "15px",
                            borderRadius: "8px",
                            borderColor: theme.palette.mode === "dark" ? theme.palette.dark.main : theme.palette.primary.light,
                            border: "1px solid"
                        }}
                    >
                        <Typography> Incorrect Data: {searchValue}</Typography>
                    </div>
                </Grid>
                <Grid item xs={5}>
                    <FormControl
                        sx={{ m: 1, minWidth: 200 }}
                        style={{
                            display: "block",
                            width: "100%",
                            marginBottom: "8px",
                            paddingLeft: "0px",
                            marginLeft: "0px"
                        }}
                    >
                        <InputLabel id="select-correct-data">Select Correct Data</InputLabel>

                        <Select
                            labelId="select-correct-data"
                            id="select-correct-datat"
                            name="select-correct-data"
                            label="Select Correct Data"
                            value={selectedRefColumn}
                            fullWidth
                            onChange={handleSelectedDistinctValue}
                            onScroll={handleScroll}
                            MenuProps={{
                                PaperProps: {
                                    style: {
                                        maxHeight: 300,
                                        marginTop: 10
                                    },
                                    onScroll: (event) => {
                                        handleScroll(event);
                                    }
                                }
                            }}
                        >
                            {columnDis?.map((menuItem) => (
                                <MenuItem key={`${menuItem.uuid_identifier_da_an_v1}`} value={`${menuItem.uuid_identifier_da_an_v1}`}>
                                    {menuItem[refAttribName]}
                                </MenuItem>
                            ))}
                            {loadingMore && (
                                <MenuItem disabled>
                                    <Box display="flex" alignItems="center" justifyContent="center" width="100%" height="100%">
                                        <CircularProgress size={20} sx={{ alignSelf: "center" }} />
                                    </Box>
                                </MenuItem>
                            )}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={1}>
                    <Button
                        variant="contained"
                        size="small"
                        sx={{ width: 100, marginTop: 2 }}
                        disabled={selectedUuids === null || selectedColumn === ""}
                        onClick={handleApply}
                    >
                        Apply
                    </Button>
                </Grid>
                <Grid item xs={1}>
                    <Button
                        variant="contained"
                        size="small"
                        sx={{ width: 100, marginTop: 2 }}
                        disabled={uuids === null || selectedColumn === "" || loadingApplyForAll}
                        onClick={handleApplyForAll}
                    >
                        {loadingApplyForAll ? <CircularProgress size={20} /> : "Apply For All"}
                    </Button>
                </Grid>
            </Grid>
            <MUIDataTable
                title={
                    <>
                        <div style={titleStyles}>Quality Controller</div>
                    </>
                }
                data={tableData}
                columns={tableHeader}
                options={options}
            />
            ;
        </>
    );
};

export default DataQualityFixation;
