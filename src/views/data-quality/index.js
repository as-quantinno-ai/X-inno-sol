import SubCard from "ui-component/cards/SubCard";
import MUIDataTable from "mui-datatables";
import React, { useState, useEffect } from "react";
// import { createTheme, useTheme } from "@mui/material/styles";
import { useTheme } from "@mui/material/styles";
import {
    Grid,
    FormControl,
    Select,
    MenuItem,
    Typography,
    Table,
    Paper,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Box,
    Chip,
    IconButton,
    Tooltip,
    InputLabel
} from "@mui/material";
import { makeStyles } from "@mui/styles";

import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { useSelector, dispatch } from "store";
import ObservabilityChartsCard from "views/DataSourceConfiguration/Observability/ObservabilityChartsCard";
import api from "views/api-configuration/api";
import HandymanIcon from "@mui/icons-material/Handyman";
import { getDataQualityManagerWithViewNameProductidandTableid, retrieveLowQualityRecord } from "views/api-configuration/default";
import { getDataQuality } from "store/slices/tables-user-selected-val";
import { setQualityData } from "store/slices/quality-controller";
import { titleStyles } from "constants/tables";
import AddQualityRuleForm from "./AddQualityRuleForm";
import FormArea from "views/new-app/components/FormArea";
import PropTypes from "prop-types";
// const useStyles = makeStyles((theme) => ({
const useStyles = makeStyles(() => ({
    table: {
        "& .MuiTableCell-root": {
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "250px"
        },
        "& .MuiTableCell-head": {
            fontSize: "10px",
            fontWeight: "bold"
        }
    },
    title: {
        fontWeight: "bold",
        fontSize: "1.5rem",
        color: "#333"
    }
}));

const chartData = {
    type: "line",
    height: 30,
    options: {
        chart: {
            id: "user-analytics-chart",
            sparkline: {
                enabled: true
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: "straight",
            width: 2
        },
        yaxis: {
            min: -2,
            max: 5,
            labels: {
                show: false
            }
        },
        tooltip: {
            fixed: {
                enabled: false
            },
            x: {
                show: false
            },
            y: {
                title: {
                    formatter: () => "Analytics "
                }
            },
            marker: {
                show: false
            }
        }
    },
    series: [
        {
            data: [2, 1, 2, 1, 1, 3, 0]
        }
    ]
};

const ExpandableRowTable = ({
    title,
    data,
    columns,
    expansiondata,
    error,
    loading,
    totalCount,
    fetch,
    selectedDatasetId,
    selectedTableId,
    viewname,
    handleSelectedDataset,
    rules
}) => {
    const theme = useTheme();
    const classes = useStyles();

    const [expandedRow, setExpandedRow] = useState(null);
    // eslint-disable-next-line no-unused-vars
    const [dataExpansion, setDataExpansion] = useState(null);
    const [rowCount, setRowCount] = useState(10);
    const [pageCount, setPageCount] = useState(0);

    const { rawDataSources } = useSelector((state) => state.dataCollection);
    const { dataQuality } = useSelector((state) => state.selectedvalue);

    const DataSourceChangeHandler = (event) => {
        const value = event.target.value;
        dispatch(getDataQuality(value));
    };
    const navigate = useNavigate();

    const handleNavigation = (
        selectedDatasetId,
        selectedTableId,
        viewName,
        SEARCHVAL,
        attribName,
        refTableId,
        dqRuleId,
        refAttribName,
        refViewName
    ) => {
        dispatch(
            setQualityData({
                selectedDatasetId,
                selectedTableId,
                viewName,
                attribName,
                searchValue: SEARCHVAL,
                refTableId,
                dqRuleId,
                refAttribName,
                refViewName
            })
        );

        navigate(`/quality-controller/${selectedDatasetId}/${selectedTableId}`);
    };

    useEffect(() => {
        if (rawDataSources) {
            dispatch(getDataQuality(`${rawDataSources[0].productclientdatasetsid}-${rawDataSources[0].tableid}`));
        }
    }, [rawDataSources]);

    useEffect(() => {
        if (dataQuality.length > 0) {
            const datasetid = Number(dataQuality?.slice(0, dataQuality.toString().search("-")));
            const tableid = Number(dataQuality?.slice(dataQuality.toString().search("-") + 1, dataQuality.length));

            handleSelectedDataset(datasetid, tableid);
            fetch(rowCount, pageCount, datasetid, tableid);
        }
    }, [dataQuality]);

    let noMatchContent;

    if (error) {
        noMatchContent = (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Typography color="error">{error}</Typography>
            </Box>
        );
    } else if (loading) {
        noMatchContent = (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <CircularProgress />
            </Box>
        );
    } else {
        noMatchContent = "No Records Available";
    }

    const options = {
        selectableRows: "none",
        selectableRowsVisibleOnly: false,
        expandableRows: true,
        expandableRowsHeader: false,
        tableBodyMaxHeight: "380px",
        elevation: 0,
        // responsive: 'scrollFullHeight',
        responsive: "simple",
        filter: true,
        download: false,
        sort: false,
        print: false,
        rowsPerPageOptions: [10, 50, 100],
        rowsPerPage: rowCount,
        count: totalCount,
        page: pageCount,
        pagination: true,
        // confirmFilters: true,
        serverSide: true,
        textLabels: {
            body: {
                noMatch: noMatchContent
            }
        },

        onTableChange: (action, tableState) => {
            if (action === "changePage" || action === "changeRowsPerPage") {
                const newPageCount = action === "changePage" ? tableState.page : 0;
                setPageCount(newPageCount);
                setRowCount(tableState.rowsPerPage);
                fetch(tableState.rowsPerPage, newPageCount * tableState.rowsPerPage, selectedDatasetId, selectedTableId);
            }
        },

        customToolbar: () => (
            <>
                <FormArea form={<AddQualityRuleForm />} icon="true" actionType="Add" btnTitle="Add Quality Rule" />

                <FormControl
                    id="catalog-select"
                    style={{
                        marginBottom: "8px",
                        paddingLeft: "0px",
                        marginLeft: "0px"
                    }}
                >
                    <InputLabel id="catalog">Select Catalog</InputLabel>

                    <Select
                        labelId="catalog-select"
                        id="catalog"
                        name="catalog"
                        defaultValue={dataQuality}
                        value={dataQuality}
                        onChange={(e) => {
                            DataSourceChangeHandler(e);
                        }}
                        label="Select Catalog"
                    >
                        {rawDataSources?.map((menuItem) => (
                            <MenuItem
                                key={`${menuItem.productclientdatasetsid}-${menuItem.tableid}`}
                                value={`${menuItem.productclientdatasetsid}-${menuItem.tableid}`}
                            >
                                {menuItem.tablename}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </>
        ),
        renderExpandableRow: (rowData, rowMeta) => {
            let component = <></>;
            if (rowMeta.dataIndex === expandedRow) {
                const matchingExpansionData = expansiondata.find((item) => item.uuid === data[rowMeta.dataIndex].uuid_identifier_da_an_v1);
                const attribVal = data[rowMeta?.dataIndex];
                component = (
                    <>
                        <tr>
                            <td style={{ paddingLeft: "15px", paddingRight: "15px" }} colSpan={14}>
                                <Box sx={{ margin: 1 }}>
                                    <TableContainer component={Paper} style={{ boxShadow: "1px 2px 10px solid gray" }}>
                                        <SubCard
                                            title="Failed Rule Details"
                                            sx={{
                                                backgroundColor:
                                                    theme.palette.mode === "dark" ? theme.palette.dark.main : theme.palette.primary.light
                                            }}
                                        >
                                            <Table style={{ margin: "5px", minWidth: "100%", width: "90%" }} aria-label="simple table">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell style={{ padding: "4px" }} align="left">
                                                            Actions
                                                        </TableCell>
                                                        <TableCell style={{ padding: "4px" }} align="left">
                                                            Rule id
                                                        </TableCell>
                                                        <TableCell style={{ padding: "4px" }} align="left">
                                                            Rule Type
                                                        </TableCell>
                                                        <TableCell style={{ padding: "4px" }} align="left">
                                                            Rule Details
                                                        </TableCell>
                                                        <TableCell style={{ padding: "4px" }} align="left">
                                                            Chunk Processed Date Time
                                                        </TableCell>
                                                        <TableCell style={{ padding: "4px" }} align="left">
                                                            Status
                                                        </TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {/* eslint-disable */}
                                                    {matchingExpansionData && matchingExpansionData.failedrulerundetails.length > 0 ? (
                                                        matchingExpansionData.failedrulerundetails.map((item, index) => (
                                                            <TableRow key={index}>
                                                                <TableCell style={{ padding: "4px" }} align="left">
                                                                    <Tooltip title="Fix Issues">
                                                                        <IconButton
                                                                            onClick={() => {
                                                                                handleNavigation(
                                                                                    selectedDatasetId,
                                                                                    selectedTableId,
                                                                                    viewname,
                                                                                    attribVal[rules[0].facilities.df_attrib_name],
                                                                                    rules[0].facilities.df_attrib_name,

                                                                                    rules[0].facilities.ref_tableid,
                                                                                    item.ruleId,

                                                                                    rules[0].facilities.ref_attrib_name,
                                                                                    rules[0].facilities.ref_viewname
                                                                                );
                                                                            }}
                                                                            disabled={item.status !== "INITIATED"}
                                                                        >
                                                                            <HandymanIcon />
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                </TableCell>
                                                                <TableCell style={{ padding: "4px" }} component="th" scope="row">
                                                                    {item.ruleId}
                                                                </TableCell>
                                                                <TableCell style={{ padding: "4px" }} align="left">
                                                                    {item.ruleType}
                                                                </TableCell>
                                                                <TableCell style={{ padding: "4px" }} align="left">
                                                                    {item.ruleDetails}
                                                                </TableCell>
                                                                <TableCell style={{ padding: "4px" }} align="left">
                                                                    {item.latesttimestamp}
                                                                </TableCell>
                                                                <TableCell style={{ padding: "4px" }} align="left">
                                                                    {item.status}
                                                                </TableCell>
                                                            </TableRow>
                                                        ))
                                                    ) : (
                                                        <TableRow>
                                                            <TableCell colSpan={6} style={{ padding: "8px" }}>
                                                                <Typography sx={{ alignContent: "center", alignItems: "center" }}>
                                                                    No record Available
                                                                </Typography>
                                                            </TableCell>
                                                        </TableRow>
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </SubCard>
                                    </TableContainer>
                                </Box>
                                <Box sx={{ margin: 1 }} />
                            </td>
                        </tr>
                    </>
                );
            }
            return component;
        },
        onRowExpansionChange: (currentRowsExpanded) => {
            const rowIndex = currentRowsExpanded[0];
            if (rowIndex !== undefined && rowIndex !== expandedRow) {
                setExpandedRow(rowIndex.index);
                setDataExpansion(data[rowIndex.index].uuid_identifier_da_an_v1);
            } else {
                setExpandedRow(null);
            }
        }
    };

    return (
        <Box className="_data-quality-table">
            <MUIDataTable
                title={
                    <>
                        <div style={titleStyles}>{title}</div>
                    </>
                }
                data={data}
                columns={columns}
                options={options}
                className={classes.table}
                sx={{
                    "& .MuiTableCell-root": {
                        backgroundColor: "white",
                        fontSize: "12px"
                    }
                }}
            />
        </Box>
    );
};

ExpandableRowTable.propTypes = {
    title: PropTypes.string,
    data: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    columns: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    expansiondata: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    error: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    loading: PropTypes.bool,
    totalCount: PropTypes.number,
    fetch: PropTypes.func,
    selectedDatasetId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    selectedTableId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    viewname: PropTypes.string,
    handleSelectedDataset: PropTypes.func,
    rules: PropTypes.oneOfType([PropTypes.object, PropTypes.array])
};

const DataQuality = () => {
    const [datasetId, setDatasetId] = useState(null);

    const [tableId, setTableId] = useState(null);

    const [tableData, setTableData] = useState([]);
    const [error, setError] = useState("");
    // const [offset, setOffset] = useState(10);

    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [rules, setRules] = useState(null);

    const [viewName, setViewName] = useState(null);
    const [tableHeader, setTableHeader] = useState([]);
    const [failedRuleDetails, setFailedRuleDetails] = useState("");

    const handleSelectedDataset = (datasetId, tableId) => {
        setDatasetId(datasetId);
        setTableId(tableId);
    };
    const fetchData = async (limit, offset, datasetid, tableid) => {
        setLoading(true);
        setTableData([]);

        try {
            setLoading(true);
            const response = await api.get(getDataQualityManagerWithViewNameProductidandTableid(limit, offset, datasetid, tableid));
            const data = await response.data.result;
            const uuids = data.trackers.map((tracker) => tracker.uuid);
            const datapipelinelayerid = data.manager.dataPipeLineLayerId;
            const productclientdatasetsid = data.manager.productClientDatasetsId;
            const viewname = data.manager.viewName;
            // const atrrib = data.manager;
            setViewName(viewname);
            const trackers = data.trackers;

            const rulesData = data.rules;

            setFailedRuleDetails(trackers);
            setRules(rulesData);
            const requestBody = {
                productclientdatasetsid,
                datapipelinelayerid,
                viewname,
                uuids
            };

            const responses = await api.post(retrieveLowQualityRecord(), requestBody);

            const lowQualityData = JSON.parse(responses.data.data);
            const limitedLowQualityData = lowQualityData.slice(0, 10);
            setTableData(limitedLowQualityData);
            setTotalCount(data.totaltrackers);
            if (lowQualityData.length > 0) {
                setLoading(false);
                setTableData(lowQualityData);

                const newTableHeaderState = [
                    {
                        name: "Rules_Status",
                        label: "RULES STATUS",
                        options: {
                            filter: true,
                            setCellProps: () => ({
                                style: {
                                    whiteSpace: "nowrap",
                                    position: "sticky",
                                    left: 40,
                                    background: "white",
                                    zIndex: 100,
                                    width: 20 * 7
                                }
                            }),
                            setCellHeaderProps: () => ({
                                style: {
                                    whiteSpace: "nowrap",
                                    width: 20 * 7,
                                    position: "sticky",
                                    left: 40,
                                    background: "white",
                                    zIndex: 101
                                }
                            }),
                            customBodyRender: (dataIndex, value, tableMeta) => {
                                const rowIndex = value.rowIndex;
                                const failedData = trackers[rowIndex];

                                // const failedRuleIds = new Set(failedData?.failedrulerundetails?.map((rule) => rule.ruleId));

                                return (
                                    <div style={{ overflowX: "visible" }}>
                                        {failedData?.failedrulerundetails?.map((rule, index) => (
                                            <Chip
                                                key={index}
                                                label={rule.ruleId}
                                                variant="contained"
                                                color={rule.status === "FINISHED" ? "success" : "error"}
                                                sx={{
                                                    color: "white",
                                                    borderRadius: "5px"
                                                }}
                                                style={{ margin: "-4px" }}
                                            />
                                        ))}
                                    </div>
                                );
                            }
                        }
                    },

                    ...(lowQualityData
                        ? Object.keys(lowQualityData[0])
                              .slice(1, Object.keys(lowQualityData).length)

                              .map((item, index) => ({
                                  label: item.toUpperCase(),
                                  name: item,
                                  options: {
                                      filter: true,
                                      sort: true,
                                      wrap: true,

                                      customBodyRender: (value, tableMeta, updateValue) => (
                                          <div
                                              style={{
                                                  whiteSpace: "nowrap",
                                                  textOverflow: "ellipsis",
                                                  padding: "20px"
                                              }}
                                          >
                                              {value}
                                          </div>
                                      )
                                  }
                              }))
                        : [])
                ];
                setTableHeader(newTableHeaderState);
            } else {
                setTableHeader([]);
            }
        } catch (error) {
            setLoading(false);
            setError("Feture Not Available At The Moment");
            console.error("Error fetching data:", error);
        }
    };

    return (
        <>
            <div key={tableId} style={{ marginTop: "10px" }}>
                <Grid container spacing={3} alignItems="center">
                    <Grid item xs={12} sm={6} md={4} lg={2}>
                        <ObservabilityChartsCard type={1} chartData={chartData} value={798} title="Users" />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={2}>
                        <ObservabilityChartsCard type={1} chartData={chartData} value={486} title="Timeout" />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={2}>
                        <ObservabilityChartsCard type={1} chartData={chartData} value="9, 454" title="Views" />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={2}>
                        <ObservabilityChartsCard type={1} chartData={chartData} value={7.15} title="Session" />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={2}>
                        <ObservabilityChartsCard type={1} chartData={chartData} value="04:30" title="Avg. Session" />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={2}>
                        <ObservabilityChartsCard type={1} chartData={chartData} value="1.55%" title="Bounce Rate" />
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12} sx={{ marginTop: "10px" }}>
                    {/* <FeaturedDataTable datasetId="14" tableId="35" formTitle="Data Quality" /> */}
                </Grid>
            </div>

            <div style={{ marginBottom: "20px" }}>
                <Box key={tableId} className="_data-quality-table">
                    <ExpandableRowTable
                        title={<div style={titleStyles}>Data Quality</div>}
                        data={tableData}
                        columns={tableHeader}
                        expansiondata={failedRuleDetails}
                        error={error}
                        loading={loading}
                        totalCount={totalCount}
                        fetch={fetchData}
                        rules={rules}
                        selectedDatasetId={datasetId}
                        selectedTableId={tableId}
                        handleSelectedDataset={handleSelectedDataset}
                        viewname={viewName}
                    />
                </Box>
            </div>
        </>
    );
};

export default DataQuality;
