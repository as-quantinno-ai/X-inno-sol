import { Typography, Paper, TableContainer, Box, Select, MenuItem } from "@mui/material";
import SubCard from "ui-component/cards/SubCard";
import React, { useState } from "react";
import PropTypes from "prop-types";

// project imports
import { useDispatch } from "store";
import { useSelector } from "react-redux";
import { updateSelectedCharts } from "store/slices/AppDashboardRawSha";
import MUIDataTable from "mui-datatables";
import CircularProgress from "@mui/material/CircularProgress";

// import { createTheme, ThemeProvider, useTheme } from "@mui/material/styles";
import { useTheme } from "@mui/material/styles";
import DynamicDashChart from "views/dash-charts/DynamicDashChart";

// function twoDigit(num) {
//     let numStr = num.toString();
//     if (numStr.length <= 1) numStr = `0${numStr}`;
//     return numStr;
// }
const quantitativeChartTypes = ["Bar Chart", "Line Chart", "Gauge Chart", "Semi Donut Chart"];
// const ChartTypes = [
//     "Line Chart",
//     "Bar Chart",
//     "Column Chart",
//     "Pie Chart",
//     "Doughnut Chart",
//     "Radial Chart",
//     "Area Chart",
//     "Polar Chart",
//     "Box Chart",
//     "Tree Chart",
//     "Semi Doughnut Chart",
//     "Gauge Chart"
// ];

// const ExpandableRowTable = ({ title, quantitative, columns, customRowData }) => {

const ExpandableRowTable = ({ quantitative, columns }) => {
    const [expandedRows, setExpandedRows] = useState([]);
    const theme = useTheme();
    // const { selectedFeaturedDataSource, columnDatadisList, selectedCharts } = useSelector((state) => state.dataCollection);
    const { selectedCharts } = useSelector((state) => state.dataCollection);
    // const [errorquantitative, setErrorquantitative] = useState(false);
    // eslint-disable-next-line no-unused-vars
    const [errorqualitative, setErrorqualitative] = useState(false);
    // eslint-disable-next-line no-unused-vars
    const [loading, setLoading] = useState(false);

    let noMatchquantitativeOptions;

    if (loading) {
        noMatchquantitativeOptions = (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <CircularProgress />
            </Box>
        );
    } else if (errorqualitative) {
        noMatchquantitativeOptions = (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Typography color="error">{errorqualitative}</Typography>
            </Box>
        );
    } else {
        noMatchquantitativeOptions = (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Typography color="primary"> No Records Available</Typography>
            </Box>
        );
    }

    const quantitativeoptions = {
        elevation: 0,
        textLabels: {
            body: {
                noMatch: noMatchquantitativeOptions
            }
        },

        selectableRows: "none",
        selectableRowsVisibleOnly: false,
        expandableRows: true,
        expandableRowsHeader: false,

        customToolbar: () => <></>,
        rowsExpanded: expandedRows,
        renderExpandableRow: (rowData, rowMeta) => {
            let component = <></>;
            // const isExpanded = expandedRows.includes(rowMeta.dataIndex);

            component = (
                <>
                    <tr>
                        <td style={{ paddingLeft: "15px", paddingRight: "15px" }} colSpan={14}>
                            <Box sx={{ margin: 1 }}>
                                <TableContainer component={Paper} style={{ boxShadow: "1px 2px 10px solid gray" }}>
                                    <SubCard
                                        title={selectedCharts[rowMeta.dataIndex]?.ct}
                                        sx={{
                                            backgroundColor:
                                                theme.palette.mode === "dark" ? theme.palette.dark.main : theme.palette.primary.light
                                        }}
                                    >
                                        <DynamicDashChart
                                            dsid={selectedCharts[rowMeta.dataIndex]?.dsid}
                                            taid={selectedCharts[rowMeta.dataIndex]?.taid}
                                            attid={selectedCharts[rowMeta.dataIndex]?.attid}
                                            ct={selectedCharts[rowMeta.dataIndex]?.ct}
                                        />
                                    </SubCard>
                                </TableContainer>
                            </Box>
                        </td>
                    </tr>
                </>
            );

            return component;
        },

        // onRowExpansionChange: (currentRowsExpanded, allRowsExpanded) => {
        onRowExpansionChange: (currentRowsExpanded) => {
            setExpandedRows((prevExpandedRows) => {
                const currentExpandedIndexes = currentRowsExpanded.map((row) => row.index);

                const filteredIndexes = prevExpandedRows.filter((index) => !currentExpandedIndexes.includes(index));

                let updatedExpandedRows;
                if (filteredIndexes.length === prevExpandedRows.length) {
                    updatedExpandedRows = [...prevExpandedRows, ...currentExpandedIndexes];
                } else {
                    updatedExpandedRows = filteredIndexes;
                }

                return updatedExpandedRows;
            });
        }
    };
    const titleStyles = {
        fontSize: "18px",
        fontWeight: 800
    };
    return (
        <MUIDataTable
            title={<div style={titleStyles}>QUANTITATIVE DATA</div>}
            data={quantitative}
            columns={columns}
            options={quantitativeoptions}
        />
    );
};

const QuantitativeData = () => {
    // const theme = useTheme();
    const dispatch = useDispatch();

    // const { rawDataSources, featuredDataSources } = useSelector((state) => state.dataCollection);
    const { rawDataSources } = useSelector((state) => state.dataCollection);
    const { selectedFeaturedDataSource, columnDatadisList } = useSelector((state) => state.dataCollection);
    // eslint-disable-next-line no-unused-vars
    const [loading, setLoading] = useState(false);
    const { selectedCharts } = useSelector((state) => state.dataCollection);
    // const { comparativeanalysisattribute } = useSelector((state) => state.dataCollection);
    // eslint-disable-next-line no-unused-vars
    const [customRowData, setCustomRowData] = useState([selectedCharts]);

    // const { selectedDataset } = useSelector((state) => state.userLogin);
    const onChartListChange = (e) => {
        setLoading(true);
        // charttype datasetId tableId attributeid attribName
        const chartInfo = e.target.value.split(",");
        let charts = selectedCharts;
        charts = charts.map((item) => {
            let chartData = item;
            if (item.dsid === Number(chartInfo[1]) && item.taid === Number(chartInfo[2]) && item.attid === Number(chartInfo[3])) {
                chartData = { ...item, active: true, ct: chartInfo[0] };
            }
            return chartData;
        });
        dispatch(updateSelectedCharts(charts));
    };
    const filteredColumnDataList = columnDatadisList && columnDatadisList.filter((attr) => attr.attributecategory === "QUANTITATIVE");

    const columns = [
        {
            name: "SelectChartType",
            label: "SELECT VISUAL",
            options: {
                customBodyRender: (value, tableMeta) => (
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Select Chart Type"
                        style={{ width: "100%", padding: "0px" }}
                        size="small"
                        onChange={onChartListChange}
                        defaultValue={`${quantitativeChartTypes[0]},${selectedFeaturedDataSource?.productclientdatasetsid},${
                            selectedFeaturedDataSource?.tableid
                        },${filteredColumnDataList[tableMeta.rowIndex]?.attributeid},${
                            filteredColumnDataList[tableMeta.rowIndex]?.attributename
                        }`}
                    >
                        {quantitativeChartTypes.map((ct, index) => (
                            <MenuItem
                                key={index}
                                value={`${ct},${selectedFeaturedDataSource?.productclientdatasetsid},${
                                    selectedFeaturedDataSource?.tableid
                                },${filteredColumnDataList[tableMeta.rowIndex]?.attributeid},${
                                    filteredColumnDataList[tableMeta.rowIndex]?.attributename
                                }`}
                            >
                                {ct}
                            </MenuItem>
                        ))}
                    </Select>
                )
            }
        },
        {
            name: "attributename",
            label: "VARIABLE NAME"
        },
        {
            name: "mean",
            label: "MEAN"
        },
        {
            name: "median",
            label: "MEDIAN"
        },
        {
            name: "sqrtroot",
            label: "S.Q.R DEVIATION"
        },
        {
            name: "quartile1",
            label: "QUARTILE 01"
        },
        {
            name: "quartile2",
            label: "QUARTILE 02"
        },
        {
            name: "quartile3",
            label: "QUARTILE 03"
        },
        {
            name: "min",
            label: "MIN"
        },
        {
            name: "max",
            label: "MAX"
        },
        {
            name: "mod",
            label: "MOD"
        },
        {
            name: "nullValueCount",
            label: "NULL VALUE COUNT"
        }
    ];

    /*eslint-disable*/
    const quantitative = columnDatadisList
        ? columnDatadisList
              .filter((attr) => attr.attributecategory === "QUANTITATIVE")
              .map((item) => ({
                  ...item,
                  SelectChartType: `${quantitativeChartTypes[0]},${selectedFeaturedDataSource?.productclientdatasetsid},${selectedFeaturedDataSource?.tableid},${item.attributeid},${item.attributename}`
              }))
        : [];
    /*eslint-enable*/
    return (
        <>
            {rawDataSources?.length ? (
                <ExpandableRowTable
                    title={
                        <Typography sx={{ fontSize: "1rem", fontWeight: 500, mr: 1, mt: 1.75, mb: 0.75 }}>Available Catalogs</Typography>
                    }
                    quantitative={quantitative}
                    columns={columns}
                    customRowData={customRowData}
                    updateCustomRowData={onChartListChange}
                />
            ) : (
                <></>
            )}
            {!rawDataSources && <div>Loading....</div>}
        </>
    );
};

ExpandableRowTable.propTypes = {
    quantitative: PropTypes.array,
    columns: PropTypes.array
};

export default QuantitativeData;
