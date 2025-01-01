import React from "react";
import { createTheme } from "@mui/material/styles";
import PropTypes from "prop-types";
import MUIDataTable from "mui-datatables";
import { useState, useEffect, useRef } from "react";
import { getCatalogButtons, getFormattedDatetime, queryBasedFilterData } from "views/api-configuration/default";
import FormArea from "../FormArea";
import { useSelector } from "store";
import { Box, Typography, IconButton, Tooltip, Chip, Button, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import RefreshIcon from "@mui/icons-material/Refresh";
import QueryBasedFilterForm from "../QueryFilter/QueryBasedFilterForm";

import { IconArrowUp, IconArrowDown, IconChevronUp, IconChevronDown } from "@tabler/icons";

import api from "views/api-configuration/api";
import FEATURE_RESOURCE, { TOOLTIP_TITLE } from "constants/tables";
import { makeStyles } from "@mui/styles";
import ButtonEvent from "./ButtonEvent";
import FiltersForm from "./FiltersForm";
import RoleBasedHOC from "authorization-hocs/RoleBasedHOC";
import { formatKey, filterKeys } from "constants/generic";
import { useTheme } from "@emotion/react";
import { DeleteOutline } from "@mui/icons-material";
import ButtonsForm from "./ButtonsForm";
import QueryBasedCustomForm from "../QueryBasedCustomForm";

const useStyles = makeStyles((theme) => ({
    table: {
        "& .MuiTableCell-root": {
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "200px"
            // marginRight: '40px'
        },
        "& .MuiTableCell-head": {
            fontSize: "10px",
            fontWeight: "bold"
        }
    },
    noTitleTable: {
        "& .MuiToolbar-root": {
            backgroundColor: theme.palette.mode === "dark" ? theme.palette.dark.main : theme.palette.primary.light
        },
        "& .MuiPaper-rounded": {
            backgroundColor: theme.palette.mode === "dark" ? theme.palette.dark.main : theme.palette.primary.light
        },
        "& .MUIDataTable": {
            backgroundColor: theme.palette.mode === "dark" ? theme.palette.dark.main : theme.palette.primary.light
        },

        "& .MuiPaper-root": {
            backgroundColor: theme.palette.mode === "dark" ? theme.palette.dark.main : theme.palette.primary.light
        },
        "& .MuiPaper-elevation": {
            backgroundColor: theme.palette.mode === "dark" ? theme.palette.dark.main : theme.palette.primary.light
        },
        "& .MuiTableCell-root": {
            backgroundColor: theme.palette.mode === "dark" ? theme.palette.dark.main : theme.palette.primary.light,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis"
            // marginRight: '40px'
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
const theme = createTheme({
    components: {
        MuiTableCell: {
            styleOverrides: {
                root: {
                    fontSize: "12px"
                    // padding: '10px!important'
                }
            }
        }
    }
});

const ExpandableRowTable = ({
    initialdata,
    title,
    rowCount,
    pageCount,
    totalCount,
    formTitle,
    componentDataId,
    dashTableId,
    dashDatasetId,
    refrenceId,
    fetchData,
    formData,
    setFormData,
    addEventData,
    loading,
    handleReload,
    error,
    data,
    columns,
    height,
    handleCount
}) => {
    const [expanded, setExpanded] = useState([]);
    const [expandedRow, setExpandedRow] = useState([]);

    const classes = useStyles();
    const theme = useTheme();

    const handleAccordionChange = (id) => () => {
        setExpanded((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
    };

    // const toggleExpandedRow = (index) => {
    //     setExpandedRow(expandedRow === index ? null : index);
    // };

    const openAll = () => {
        setExpanded(initialdata.offspring.map((_, index) => `datasources-${index}`));
    };

    const closeAll = () => {
        setExpanded([]);
    };

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

    const options = {
        responsive: "standard",
        expandableRowsHeader: false,

        tableBodyMaxHeight: `calc(${height} - 140px)`,
        expandableRows: (initialdata && initialdata?.hasOffspring) || false,
        selectableRows: "none",
        selectableRowsVisibleOnly: false,
        elevation: 0,
        serverSide: true,
        filter: false,
        viewColumns: false,
        rowsPerPageOptions: [10, 50, 100],
        rowsPerPage: rowCount,
        count: totalCount,
        page: pageCount,
        textLabels: {
            body: {
                noMatch: noMatchContent
            }
        },

        renderExpandableRow: (rowData, rowMeta) => {
            if (!initialdata.offspring || !initialdata.offspring.length) {
                return null;
            }

            let component = <></>;
            if (rowMeta.dataIndex === expandedRow) {
                component = (
                    <>
                        <tr>
                            <td style={{ padding: "20px 30px" }} colSpan={14}>
                                <Box>
                                    <Button variant="contained" color="primary" onClick={openAll} sx={{ width: "90px" }}>
                                        Open All
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={closeAll}
                                        width="200px"
                                        sx={{ width: "90px", marginLeft: "10px" }}
                                    >
                                        Close All
                                    </Button>
                                </Box>
                            </td>
                        </tr>
                        <tr key={rowMeta.dataIndex}>
                            <td style={{ paddingLeft: "15px", paddingRight: "15px" }} colSpan={14}>
                                {initialdata.offspring.map((item, index) => (
                                    <Accordion
                                        key={index}
                                        expanded={expanded.includes(`datasources-${index}`)}
                                        onChange={handleAccordionChange(`datasources-${index}`)}
                                    >
                                        <AccordionSummary aria-controls={`datasources-${index}-content`} id={`datasources-${index}-header`}>
                                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                                {expanded.includes(`datasources-${index}`) ? <IconChevronDown /> : <IconChevronUp />}
                                                <Typography sx={{ fontWeight: 600, fontSize: "16px", ml: 1 }}>
                                                    {item.sectiontitle}
                                                </Typography>
                                            </Box>
                                        </AccordionSummary>
                                        <AccordionDetails
                                            sx={{
                                                backgroundColor:
                                                    theme.palette.mode === "dark" ? theme.palette.dark.main : theme.palette.primary.light
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    height: "100%",
                                                    "&:hover .role-based-hoc": {
                                                        opacity: 1,
                                                        transform: "translateY(0)",
                                                        transition: "opacity 0.3s ease, transform 0.3s ease"
                                                    },
                                                    backgroundColor:
                                                        theme.palette.mode === "dark"
                                                            ? theme.palette.dark.main
                                                            : theme.palette.primary.light
                                                }}
                                            >
                                                <RoleBasedHOC allowedRoles={["TENANT_ADMIN"]}>
                                                    <Box
                                                        className="role-based-hoc"
                                                        display="flex"
                                                        justifyContent="center"
                                                        alignItems="center"
                                                        sx={{
                                                            position: "absolute",
                                                            left: "40%",
                                                            width: "150px",
                                                            height: "8%",
                                                            borderRadius: "8px",
                                                            alignItems: "center",
                                                            opacity: 0,
                                                            transform: "translateY(20px)",
                                                            transition: "opacity 0.3s ease, transform 0.3s ease",
                                                            display: "flex",
                                                            justifyContent: "center",
                                                            backgroundColor: theme.palette.secondary.light,
                                                            zIndex: 50,
                                                            overflow: "visible"
                                                        }}
                                                    >
                                                        <Box
                                                            display="flex"
                                                            justifyContent="center"
                                                            alignItems="center"
                                                            sx={{
                                                                width: "10%",
                                                                padding: "5px",
                                                                borderRadius: "8px"
                                                            }}
                                                        >
                                                            <FormArea
                                                                form={<QueryBasedCustomForm componentDataId={componentDataId} />}
                                                                icon="true"
                                                                actionType="FormatListBulletedOutlined"
                                                                btnTitle="Attach Form"
                                                            />

                                                            <FormArea
                                                                form={
                                                                    <ButtonsForm
                                                                        datasetid={dashDatasetId}
                                                                        componentdataid={componentDataId}
                                                                        tableid={dashTableId}
                                                                        tablename={formTitle}
                                                                    />
                                                                }
                                                                btnTitle="Add Custom Button"
                                                                icon="true"
                                                                actionType="AddCircleOutlined"
                                                            />

                                                            <Tooltip title="Delete">
                                                                <IconButton onClick={() => console.log("Delete action")}>
                                                                    <DeleteOutline />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </Box>
                                                    </Box>
                                                </RoleBasedHOC>
                                                <QueryBasedTables
                                                    dashDatasetId={item.productclientdatasetsid}
                                                    dashTableId={item.tableid}
                                                    componentDataId={item.componentdataid}
                                                    // formTitle={item.sectiontitle}
                                                    refrenceId={item.referenceid}
                                                    uuid={data[rowMeta.dataIndex].uuid_identifier_da_an_v1}
                                                />
                                            </Box>
                                        </AccordionDetails>
                                    </Accordion>
                                ))}
                            </td>
                        </tr>
                    </>
                );
            }

            return <>{component}</>;
        },
        onTableChange: (action, tableState) => {
            handleCount(tableState.rowsPerPage, tableState.page);
        },
        customToolbar: () => (
            <>
                <RoleBasedHOC allowedRoles={["TENANT_ADMIN"]}>
                    <FormArea
                        form={<FiltersForm componentDataId={componentDataId} datasetid={dashDatasetId} tableid={dashTableId} />}
                        btnTitle="Add query"
                        icon="true"
                    />
                </RoleBasedHOC>
                <FormArea
                    form={
                        <QueryBasedFilterForm
                            key={dashDatasetId}
                            dashDatasetId={dashDatasetId}
                            dashTableId={dashTableId}
                            refrenceId={refrenceId}
                            finalData={formData}
                            setFinalData={setFormData}
                            totalCount={totalCount}
                            handleApi={fetchData}
                            componentDataId={componentDataId}
                        />
                    }
                    icon="true"
                    actionType="filter"
                    btnTitle="Filter"
                />
                {addEventData &&
                    addEventData.length > 0 &&
                    addEventData.map((eventData, index) => (
                        <ButtonEvent
                            key={eventData.event.eventId}
                            dataIndex={eventData.event.eventId}
                            index={index}
                            selectedRecord={null}
                            productclientdatasetsid={dashDatasetId}
                            tableid={dashTableId}
                            event={eventData}
                            dashboard="Y"
                            handleReload={handleReload}
                        />
                    ))}

                <Tooltip title={TOOLTIP_TITLE.RELOAD_GRID}>
                    <IconButton onClick={handleReload}>
                        <RefreshIcon sx={{ fontSize: 20 }} />
                    </IconButton>
                </Tooltip>
            </>
        ),
        onRowExpansionChange: (currentRowsExpanded) => {
            const rowIndex = currentRowsExpanded[0];

            if (rowIndex !== undefined && rowIndex !== expandedRow) {
                setExpandedRow(rowIndex.index);
                closeAll();
            } else {
                setExpandedRow(null);
            }
        }
    };

    return (
        <MUIDataTable
            title={title}
            data={data}
            columns={columns}
            options={options}
            className={!formTitle ? classes.noTitleTable : classes.table}
        />
    );
};

ExpandableRowTable.propTypes = {
    initialdata: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    rowCount: PropTypes.number,
    pageCount: PropTypes.number,
    totalCount: PropTypes.number,
    formTitle: PropTypes.string,
    componentDataId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    data: PropTypes.array,
    dashDatasetId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    dashTableId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    refrenceId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    uuid: PropTypes.string,
    handleReload: PropTypes.func,
    addEventData: PropTypes.array,
    theme: PropTypes.object,
    handleCount: PropTypes.func,
    fetchData: PropTypes.func,
    fetchFormData: PropTypes.func,
    formData: PropTypes.array,
    setFormData: PropTypes.func,
    loading: PropTypes.bool,
    error: PropTypes.string,
    columns: PropTypes.array
};

const getBackgroundColor = (formTitle, theme) => {
    if (!formTitle) {
        return "#ebeef0";
    }
    return theme.palette.background.paper;
};

const QueryBasedTables = ({ data, dashDatasetId, dashTableId, height, componentDataId, formTitle, refrenceId, uuid }) => {
    const classes = useStyles();
    const [tableDataState, setTableDataState] = useState([]);
    const [tableHeaderState, setTableHeaderState] = useState([]);
    const [rowCount, setRowCount] = useState(10);
    const [pageCount, setPageCount] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState([]);
    const { userHistory } = useSelector((state) => state.userLogin);
    const [filterOpen, setFilterOpen] = useState(false);
    const [columnWidths, setColumnWidths] = useState({});
    const [addEventData, setAddEventData] = useState(null);

    const handleCloseFilter = () => {
        setFilterOpen(!filterOpen);
    };

    const fetchData = (updatedFilters) => {
        setLoading(true);
        setError(null);
        setTableDataState([]);
        setFormData(updatedFilters || []);
        const cleanedFilters = updatedFilters ? updatedFilters.filter((filter) => filter.value !== "") : null;
        const updatedFormData = updatedFilters ? { filters: cleanedFilters } : { filters: [] };

        api.get(`${getCatalogButtons(dashDatasetId, dashTableId)}`)
            .then((res) => {
                const addEvent = res.data.result.filter((obj) => obj.event && obj.button.buttonType === "TABLE");
                if (addEvent) {
                    setAddEventData(addEvent);
                }
                const hasRecordButton = res.data.result?.some((obj) => obj.button.buttonType === "RECORD");

                api.post(
                    queryBasedFilterData(
                        uuid,
                        dashDatasetId,
                        dashTableId,
                        componentDataId,
                        rowCount,
                        pageCount * rowCount,
                        FEATURE_RESOURCE.ALL,
                        userHistory?.emailAddress
                    ),
                    updatedFormData
                )
                    .then((response) => {
                        const parsedData = JSON.parse(response?.data.data);
                        const dataTypes = response?.data.data_types;
                        /*eslint-disable*/
                        if (parsedData) {
                            setTableDataState(parsedData);
                            if (parsedData.length > 0) {
                                const newTableHeaderState = [
                                    hasRecordButton
                                        ? {
                                              name: "rec_actions_n_events",
                                              label: "ACTIONS",
                                              options: {
                                                  filter: false,
                                                  sort: false,
                                                  empty: true,
                                                  width: 250,
                                                  customBodyRenderLite: (dataIndex, index) => (
                                                      <>
                                                          <div style={{ whiteSpace: "nowrap" }}>
                                                              {res.data.result
                                                                  ?.filter((obj) => obj.button.buttonType === "RECORD" && obj.event)
                                                                  .map((obj, index) => (
                                                                      <ButtonEvent
                                                                          key={index + 1}
                                                                          dataIndex={dataIndex}
                                                                          index={index}
                                                                          selectedRecord={null}
                                                                          productclientdatasetsid={dashDatasetId}
                                                                          tableid={dashTableId}
                                                                          recid={parsedData[dataIndex]?.uuid_identifier_da_an_v1}
                                                                          event={obj}
                                                                          dashboard="Y"
                                                                          handleReload={() => fetchData()}
                                                                      />
                                                                  ))}
                                                          </div>
                                                      </>
                                                  )
                                              }
                                          }
                                        : null,

                                    ...(parsedData[0]
                                        ? filterKeys(Object.keys(parsedData[0]))?.map((item, index) => ({
                                              label: formatKey(item),
                                              name: item,
                                              options: {
                                                  customBodyRender: (value, tableMeta, updateValue) => {
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
                                        : [])
                                ].filter(Boolean);
                                setTableHeaderState(newTableHeaderState);
                            }
                            setTotalCount(response?.data.data_count);
                            setLoading(false);
                            setError(null);
                            handleCloseFilter();
                        } else {
                            setLoading(false);
                            setError(null);
                        }
                    })
                    .catch((err) => {
                        setLoading(false);
                        setError("This Feature Not Available at the moment");
                    });
            })
            .catch((err) => {
                console.log("Error Query Based Table : " + err);
                setLoading(false);
                setError("Event Not Available at the moment");
            });
    };
    /*eslint-enable*/
    const handleReload = () => {
        fetchData();
    };

    const resizingColumnIndex = useRef(null);
    const startX = useRef(null);
    const startWidth = useRef(null);

    const onResize = (e) => {
        if (resizingColumnIndex.current !== null) {
            const deltaX = e.clientX - startX.current;
            const newWidth = Math.max(20, startWidth.current + deltaX); // Set a minimum width of 60px
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
                        minWidth: "30px",
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
                        cursor: "pointer",
                        backgroundColor: getBackgroundColor(formTitle, theme)
                    }}
                    onClick={() => handleSort(header.name)}
                    className="custom-header"
                >
                    <p
                        style={{
                            width: columnWidths[columnMeta.index] || "auto",
                            minWidth: "30px",
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
                            top: data ? 10 : 0,
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

    const removeFilter = (attribName) => {
        const updatedFilters = formData.filter((filter) => filter.attrib_name !== attribName);
        setFormData(updatedFilters);

        fetchData(updatedFilters);
    };
    const titleStyles = {
        fontSize: "18px",
        fontWeight: 800
    };

    useEffect(() => {
        setTableDataState([]);
        setError(null);

        fetchData(formData);
    }, [dashDatasetId, dashTableId, rowCount, pageCount]);

    useEffect(() => {
        setPageCount(0);
        setError(null);
    }, [dashDatasetId, dashTableId]);

    useEffect(() => {
        setFormData([]);
        setTableHeaderState([]);
    }, [dashDatasetId, dashTableId]);
    const getFormattedMinMaxDatetime = (datetime) => {
        const [min, max] = datetime.split(",");
        const localMin = new Date(min).toLocaleString();
        const localMax = new Date(max).toLocaleString();
        return `${localMin} - ${localMax}`;
    };
    const handleCount = (row, page) => {
        setRowCount(row);
        setPageCount(page);
    };

    return (
        <Box key={dashTableId} className="_query-table">
            <ExpandableRowTable
                initialdata={data}
                title={
                    <>
                        <div style={titleStyles}>{formTitle}</div>
                        <div style={{ marginBottom: "10px", marginTop: "10px" }}>
                            {formData.map((filter, index) => (
                                <Chip
                                    key={index}
                                    label={`${filter.attrib_name.replace(/^[^.]*\./, "")}:  ${
                                        filter.attrib_type === "timestamp"
                                            ? getFormattedMinMaxDatetime(filter.value)
                                            : filter.value.replace(/`|`/g, " ")
                                    }`}
                                    onDelete={() => removeFilter(filter.attrib_name)}
                                    color="primary"
                                    variant="outlined"
                                    style={{ marginRight: "5px" }}
                                />
                            ))}
                        </div>
                    </>
                }
                rowCount={rowCount}
                pageCount={pageCount}
                totalCount={totalCount}
                handleCount={handleCount}
                handleReload={handleReload}
                dashDatasetId={dashDatasetId}
                dashTableId={dashTableId}
                componentDataId={componentDataId}
                formTitle={formTitle}
                refrenceId={refrenceId}
                height={height}
                formData={formData}
                setFormData={setFormData}
                data={tableDataState}
                columns={columns}
                fetchData={fetchData}
                loading={loading}
                error={error}
                addEventData={addEventData}
                className={classes.table}
            />
        </Box>
    );
};

QueryBasedTables.propTypes = {
    data: PropTypes.oneOfType([PropTypes.object, PropTypes.arrayOf(PropTypes.object)]),
    dashDatasetId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    dashTableId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    componentDataId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    formTitle: PropTypes.string,
    refrenceId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    height: PropTypes.string,
    uuid: PropTypes.string
};

export default QueryBasedTables;
