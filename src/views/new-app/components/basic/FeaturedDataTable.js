import MUIDataTable from "mui-datatables";
import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import {
    // truncateText,
    loadParquetData,
    getCatalogButtons,
    loadMlModelParquetData,
    createCustomFormRefreshBronzeView,
    getFormattedDatetime
} from "views/api-configuration/default";
import RefreshIcon from "@mui/icons-material/Refresh";
import PublishToDashboardForm from "./PublishToDashboardForm";
import FormArea from "../FormArea";
import { useSelector } from "store";
import axios from "axios";
import { Box, ListItemIcon, Typography, IconButton, Tooltip, Chip, useTheme } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
// assets
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import EditFeatureTableRecord from "../EditFeatureTableRecord";
import DeleteFeatureTableRecord from "./DeleteFeatureTableRecord";
import DetailsForm from "./DetailsForm";
import DialogArea from "../DialogArea";
import ButtonEvent from "./ButtonEvent";
import api from "views/api-configuration/api";
import { makeStyles } from "@mui/styles";
import FEATURE_RESOURCE from "constants/tables";
import { filterKeys, formatKey, LOCAL_STORAGE_KEYS, USER_ROLES } from "constants/generic";
import ConfigFilterForm from "./ConfigFilterForm";
import { IconArrowUp, IconArrowDown } from "@tabler/icons";

const useStyles = makeStyles(() => ({
    table: {
        "& .MuiTableCell-root": {
            whiteSpace: "nowrap",
            overflow: "hidden",
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

const GridPublishTypeNEvents = ({ type, mlmodelRefId, actionButtons, onDashboard }) => {
    const { selectedFeaturedDataSource } = useSelector((state) => state.dataCollection);
    const { selectedRawDataSource } = useSelector((state) => state.dataCollection);

    let elem = <></>;
    if (type === FEATURE_RESOURCE.RAW) {
        elem = (
            <>
                {" "}
                {selectedRawDataSource ? (
                    <>
                        {actionButtons
                            ?.filter((obj) => obj.button.buttonType === "TABLE")
                            .map((obj, indx) => (
                                <button key={indx} type="submit">
                                    {obj.button.buttonName}
                                </button>
                            ))}
                        {onDashboard ? (
                            <></>
                        ) : (
                            <FormArea
                                form={
                                    <PublishToDashboardForm
                                        functionname="RAW-DATA-GRID"
                                        referenceid={selectedRawDataSource.tableid}
                                        tableid={selectedRawDataSource.tableid}
                                        componentDisplayType="GRID"
                                    />
                                }
                                btnTitle="Publish"
                            />
                        )}
                    </>
                ) : (
                    <></>
                )}
            </>
        );
    } else if (type === FEATURE_RESOURCE.FEATURE) {
        elem = (
            <>
                {selectedFeaturedDataSource ? (
                    <FormArea
                        form={
                            <PublishToDashboardForm
                                functionname="RAW-DATA-GRID"
                                referenceid={selectedFeaturedDataSource.tableid}
                                tableid={selectedFeaturedDataSource.tableid}
                                componentDisplayType="GRID"
                            />
                        }
                        btnTitle="Publish"
                    />
                ) : (
                    <></>
                )}
            </>
        );
    } else {
        elem = (
            <>
                {onDashboard ? (
                    <></>
                ) : (
                    <FormArea
                        form={
                            <PublishToDashboardForm
                                functionname="PREDICTIONS-DATA-GRID"
                                referenceid={mlmodelRefId}
                                componentDisplayType="GRID"
                            />
                        }
                        btnTitle="Publish"
                    />
                )}
            </>
        );
    }
    return elem;
};

GridPublishTypeNEvents.propTypes = {
    type: PropTypes.string,
    mlmodelRefId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    actionButtons: PropTypes.array,
    onDashboard: PropTypes.bool
};
const FeaturedDataTable = ({
    type,
    mlmodelRefId,
    dashDatasetId,
    dashTableId,
    onDashboard,
    componentDataId,
    id,
    formTitle,
    refreshDataTable,
    dashColumns
}) => {
    const classes = useStyles();
    const theme = useTheme();
    const selectedData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.SELECTED_DATASETS));
    const selectedDataset = selectedData.payload;
    const { selectedFeaturedDataSource } = useSelector((state) => state.dataCollection);
    const { selectedRawDataSource } = useSelector((state) => state.dataCollection);
    const successSX = { color: "success.dark" };
    const errorSX = { color: "error.main" };
    const [actionBtns, setActionBtns] = useState(null);
    const [tableDataState, setTableDataState] = useState([]);
    const [tableSearchDataState, setSearchTableDataState] = useState([]);
    const [tableHeaderState, setTableHeaderState] = useState([]);
    const [rowCount, setRowCount] = useState(10);
    const [pageCount, setPageCount] = useState(0);
    const [totalCount, setTotalCount] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState([]);
    const [columnWidths, setColumnWidths] = useState({});
    // eslint-disable-next-line no-unused-vars
    const [recId, setRecId] = useState(null);
    // eslint-disable-next-line no-unused-vars
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [detailsOpen, setDetailsOpen] = useState(false);

    let currentDatasetId;
    /*eslint-disable*/
    switch (type) {
        case FEATURE_RESOURCE.RAW:
            currentDatasetId = dashDatasetId || selectedRawDataSource?.productclientdatasetsid;
            break;
        case FEATURE_RESOURCE.FEATURE:
            currentDatasetId = dashDatasetId || selectedFeaturedDataSource?.productclientdatasetsid;
            break;
        case FEATURE_RESOURCE.ML_MODEL:
            currentDatasetId = dashDatasetId || selectedRawDataSource?.productclientdatasetsid;
            break;
        default:
            currentDatasetId = dashDatasetId || selectedRawDataSource?.productclientdatasetsid;
    }

    const fetchResource = (type, attribs, values) => {
        switch (type) {
            case FEATURE_RESOURCE.RAW:
                return [
                    loadParquetData(
                        dashDatasetId || selectedRawDataSource?.productclientdatasetsid,
                        dashTableId || selectedRawDataSource?.tableid,
                        rowCount,
                        pageCount * rowCount,
                        FEATURE_RESOURCE.ALL,
                        selectedDataset?.emailaddress,
                        selectedDataset.keycloakrole === USER_ROLES.TENANT_ADMIN && onDashboard === "yes" ? "N" : "Y",
                        componentDataId,
                        attribs,
                        values
                    ),
                    getCatalogButtons(
                        dashDatasetId || selectedRawDataSource?.productclientdatasetsid,
                        dashTableId || selectedRawDataSource?.tableid
                    )
                ];
            case FEATURE_RESOURCE.FEATURE:
                return [
                    loadParquetData(
                        dashDatasetId || selectedFeaturedDataSource?.productclientdatasetsid,
                        dashTableId || selectedFeaturedDataSource?.tableid,
                        rowCount,
                        pageCount * rowCount,
                        FEATURE_RESOURCE.ALL,
                        selectedDataset?.emailaddress,
                        selectedDataset.keycloakrole === USER_ROLES.TENANT_ADMIN && onDashboard === "yes" ? "N" : "Y",
                        componentDataId,
                        attribs,
                        values
                    ),
                    getCatalogButtons(
                        dashDatasetId || selectedFeaturedDataSource?.productclientdatasetsid,
                        dashTableId || selectedFeaturedDataSource?.tableid
                    )
                ];
            case FEATURE_RESOURCE.ML_MODEL:
                return [loadMlModelParquetData(mlmodelRefId, rowCount, pageCount * rowCount, FEATURE_RESOURCE.ALL), []];
            default:
                return [
                    loadParquetData(
                        dashDatasetId || selectedRawDataSource?.productclientdatasetsid,
                        dashTableId || selectedRawDataSource?.tableid,
                        rowCount,
                        pageCount * rowCount,
                        FEATURE_RESOURCE.ALL,
                        selectedDataset?.emailaddress,
                        selectedDataset.keycloakrole === USER_ROLES.TENANT_ADMIN && onDashboard === "yes" ? "N" : "Y",
                        componentDataId,
                        attribs,
                        values
                    ),
                    getCatalogButtons(dashDatasetId, dashTableId)
                ];
        }
    };
    /*eslint-enable*/
    const handleCloseDetailForm = () => {
        setDetailsOpen(false);
    };

    const fetchData = async (text, formattedValues) => {
        try {
            setLoading(true);
            setTableDataState([]);
            setActionBtns(null);
            setTotalCount(null);
            if (type !== "mlmodel") {
                api.put(`${createCustomFormRefreshBronzeView(dashDatasetId, dashTableId)}`).then(() => {});
                api.get(`${fetchResource(type, text, formattedValues)[1]}`).then((res) => {
                    setActionBtns(res.data.result);
                    api.get(fetchResource(type, text, formattedValues)[0])
                        .then((response) => {
                            setLoading(false);

                            if (response?.data?.data?.length) {
                                const parsedData = JSON.parse(response?.data?.data);
                                setTotalCount(response?.data.data_count);
                                const dataTypes = response.data.data_types;

                                if (parsedData.length > 0) {
                                    setTableDataState(parsedData);
                                    setSearchTableDataState(parsedData);

                                    const firstItemKeys = Object.keys(parsedData[0]);
                                    const customSort = (a, b) => {
                                        const numA = parseInt(a, 10);
                                        const numB = parseInt(b, 10);

                                        if (!Number.isNaN(numA) && !Number.isNaN(numB)) {
                                            return numA - numB;
                                        }

                                        if (!Number.isNaN(numA) && Number.isNaN(numB)) {
                                            return 1;
                                        }

                                        if (Number.isNaN(numA) && !Number.isNaN(numB)) {
                                            return -1;
                                        }

                                        return 0;
                                    };

                                    const sortedKeys = firstItemKeys.sort(customSort);
                                    /*eslint-disable*/
                                    const newTableHeaderState = [
                                        type !== FEATURE_RESOURCE.RAW && type !== FEATURE_RESOURCE.FEATURE
                                            ? {
                                                  name: "rec_actions_n_events",
                                                  label: "ACTIONS",
                                                  options: {
                                                      filter: false,
                                                      sort: false,
                                                      empty: true,
                                                      width: 200,
                                                      customBodyRenderLite: (dataIndex, index) => {
                                                          return (
                                                              <>
                                                                  <div style={{ whiteSpace: "nowrap" }}>
                                                                      {type !== FEATURE_RESOURCE.RAW &&
                                                                          type !== FEATURE_RESOURCE.FEATURE &&
                                                                          parsedData[dataIndex] && (
                                                                              <>
                                                                                  <DialogArea
                                                                                      form={
                                                                                          <DeleteFeatureTableRecord
                                                                                              dataIndex={dataIndex}
                                                                                              index={index}
                                                                                              selectedRecords={selectedRecord}
                                                                                              id={id}
                                                                                              dashDatasetId={dashDatasetId}
                                                                                              dashTableId={dashTableId}
                                                                                              recId={
                                                                                                  parsedData[dataIndex]
                                                                                                      .uuid_identifier_da_an_v1
                                                                                              }
                                                                                          />
                                                                                      }
                                                                                      btnTitle="Delete"
                                                                                      icon
                                                                                      actionType="deleteFeatureTableRecord"
                                                                                      dashDatasetId={dashDatasetId}
                                                                                      dashTableId={dashTableId}
                                                                                      recId={parsedData[dataIndex].uuid_identifier_da_an_v1}
                                                                                      reloadTable={() => fetchData()}
                                                                                  />

                                                                                  <FormArea
                                                                                      form={
                                                                                          <EditFeatureTableRecord
                                                                                              id={id}
                                                                                              dashDatasetId={dashDatasetId}
                                                                                              dashTableId={dashTableId}
                                                                                              recId={
                                                                                                  parsedData[dataIndex]
                                                                                                      .uuid_identifier_da_an_v1
                                                                                              }
                                                                                              handleReload={() => fetchData()}
                                                                                          />
                                                                                      }
                                                                                      actionType="edit"
                                                                                      btnTitle="Edit"
                                                                                      icon="true"
                                                                                      dashDatasetId={dashDatasetId}
                                                                                      dashTableId={dashTableId}
                                                                                      recId={parsedData[dataIndex].uuid_identifier_da_an_v1}
                                                                                  />
                                                                              </>
                                                                          )}

                                                                      {res.data.result
                                                                          ?.filter((obj) => obj.button.buttonType === "RECORD" && obj.event)
                                                                          .map((obj, index) => (
                                                                              <ButtonEvent
                                                                                  key={index}
                                                                                  dataIndex={dataIndex}
                                                                                  index={index}
                                                                                  productclientdatasetsid={dashDatasetId}
                                                                                  tableid={dashTableId}
                                                                                  recid={parsedData[dataIndex]?.uuid_identifier_da_an_v1}
                                                                                  event={obj}
                                                                                  handleReload={() => fetchData()}
                                                                              />
                                                                          ))}
                                                                  </div>
                                                              </>
                                                          );
                                                      }
                                                  }
                                              }
                                            : "",
                                        {
                                            name: "DATA_STATUS",
                                            label: "DATA STATUS",
                                            options: {
                                                customBodyRender: (value) => (
                                                    <ListItemIcon>
                                                        {value === "P" ? (
                                                            <ArrowDropUpIcon sx={successSX} />
                                                        ) : (
                                                            <ArrowDropDownIcon sx={errorSX} />
                                                        )}
                                                    </ListItemIcon>
                                                )
                                            }
                                        },

                                        ...(parsedData[0]
                                            ? sortedKeys
                                                  .filter((key) => filterKeys([key]).length > 0)

                                                  .map((item, index) => ({
                                                      label: item
                                                          .replace("_identifier_da_an_v1", "")
                                                          .replace("_xan", "")
                                                          .replace(/_/g, " ")
                                                          .toUpperCase(),
                                                      name: item,
                                                      options: {
                                                          filter: true,
                                                          sort: true,
                                                          wrap: true,
                                                          customBodyRender: (value) => {
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
                                                                      {/* truncateText(value, 30) */}
                                                                      {isTimestamp ? getFormattedDatetime(value) : value}
                                                                  </div>
                                                              );
                                                          }
                                                      }
                                                  }))
                                            : [])
                                    ];
                                    setTableHeaderState(newTableHeaderState);
                                }
                            } else {
                                setTableHeaderState([]);
                                setLoading(false);
                                setError(null);
                                setTotalCount(response?.data.data_count);
                            }
                        })
                        .catch((error) => {
                            setLoading(false);
                            setError("This Feature Not Available at the moment");
                            console.error("Errorrr fetching data:", error);
                        });
                });
            } else axios.put(`${createCustomFormRefreshBronzeView(dashDatasetId, dashTableId)}`).then(() => {});
            api.get(fetchResource(type, text, formattedValues)[0])
                .then((response) => {
                    setLoading(false);

                    setTotalCount(response?.data.data_count);

                    const parsedData = JSON.parse(response.data.data);
                    if (parsedData.length > 0) {
                        setTableDataState(parsedData);
                        setTotalCount(response?.data.data_count);
                        setError(null);
                        const dataTypes = response.data.data_types;
                        const newTableHeaderState = [
                            ...(parsedData[0]
                                ? Object.keys(parsedData[0])
                                      ?.slice(1, Object.keys(parsedData[0]).length)
                                      .filter((key) => filterKeys([key]).length > 0)
                                      ?.map((item, index) => ({
                                          label: formatKey(item),
                                          name: item,
                                          options: {
                                              filter: true,
                                              sort: true,
                                              wrap: true,
                                              customBodyRender: (value) => {
                                                  // truncateText(value, 30)
                                                  const isTimestamp = dataTypes[item] === "timestamp";

                                                  return (
                                                      <div
                                                          style={{
                                                              //   width: columnWidths[index] || 'auto',
                                                              //   minWidth: '40px',
                                                              whiteSpace: "nowrap",
                                                              overflow: "hidden",
                                                              textOverflow: "ellipsis",
                                                              maxWidth: columnWidths[index] || "auto"
                                                          }}
                                                      >
                                                          {/* truncateText(value, 30) */}
                                                          {isTimestamp ? getFormattedDatetime(value) : value}
                                                      </div>
                                                  );
                                              }
                                          }
                                      }))
                                : [])
                        ];
                        setTableHeaderState(newTableHeaderState);
                    } else {
                        setLoading(false);
                        setTotalCount(response?.data.data_count);
                        setTableHeaderState([]);
                        setError(null);
                    }
                })
                .catch((error) => {
                    setError("Service Unavailable");
                    setLoading(false);
                    console.error("Errorrr fetching data:", error);
                });
        } catch (error) {
            console.log(error.message);
            setError("This Feature Not Available At The Moment");
            setLoading(false);
        }
    };
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
            const newWidth = Math.max(40, startWidth.current + deltaX); // Set a minimum width of 60px
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
    const columns = tableHeaderState?.map((header, index) => ({
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
                            overflow: "hidden", // Ensuring text does not overflow visibly
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
        responsive: "standard",
        tableBodyMaxHeight: "380px",
        selectableRows: "none",
        selectableRowsVisibleOnly: false,
        elevation: 0,
        filter: !dashColumns?.parquetSchema,
        serverSide: true,
        onSearchChange: (searchText) => {
            if (!searchText) {
                setTableDataState(tableSearchDataState);
                return;
            }
            const filteredData = tableDataState.filter((row) => {
                return Object.values(row).some((value) => {
                    return value && value.toString().toLowerCase().includes(searchText.toLowerCase());
                });
            });

            setTableDataState(filteredData);
            fetchData(searchText);

            // setTableDataState(filteredData);
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
                <GridPublishTypeNEvents type={type} mlmodelRefId={mlmodelRefId} actionButtons={actionBtns} onDashboard={onDashboard} />
                {onDashboard ? (
                    <>
                        {/* <Tooltip title="Filter">
                            <IconButton onClick={handleFilter}>
                                <FilterListIcon />
                            </IconButton>
                        </Tooltip> */}
                        <Tooltip title="Reload Grid">
                            <IconButton onClick={handleReload}>
                                <RefreshIcon sx={{ fontSize: 20 }} />
                            </IconButton>
                        </Tooltip>
                    </>
                ) : (
                    <></>
                )}
                {!dashColumns?.parquetSchema ? (
                    <></>
                ) : (
                    <FormArea
                        form={
                            <ConfigFilterForm
                                dashDatasetId={dashDatasetId}
                                dashTableId={dashTableId}
                                handleApi={fetchData}
                                columns={dashColumns}
                                setFinalData={setFormData}
                                totalCount={totalCount}
                            />
                        }
                        icon="true"
                        actionType="filter"
                        btnTitle="Filter"
                    />
                )}
            </>
        )
    };
    const titleStyles = {
        fontSize: "18px",
        fontWeight: 800
    };

    const columnData = tableHeaderState[0] === "" ? columns.slice(1) : columns;
    const removeFilter = (attribName) => {
        const updatedFilters = formData.filter((filter) => filter.attrib_name !== attribName);
        setFormData(updatedFilters);
        setPageCount(0);
        fetchData(updatedFilters);
    };
    useEffect(() => {
        const filteredValues = formData.map((name) => name.value);
        const formattedColumns = formData.map((name) => name.attrib_name);
        const formattedValues = `${filteredValues.join(",")}`;
        fetchData(formattedColumns, formattedValues);
    }, [dashDatasetId, dashTableId, rowCount, pageCount, refreshDataTable]);

    useEffect(() => {
        return () => {
            setColumnWidths({});
        };
    }, [id, dashTableId]);

    useEffect(() => {
        return () => {
            setTotalCount(null);
            setError(null);
            setTableHeaderState([]);
            setPageCount(0);
        };
    }, [id, dashTableId]);

    useEffect(() => {
        if (pageCount !== 0) {
            setPageCount(0);
        }
    }, [dashDatasetId, dashTableId]);
    return (
        <>
            <>
                <>
                    <Box key={dashTableId} className="_featured-table" style={{ marginBottom: "20px" }}>
                        <MUIDataTable
                            title={
                                <>
                                    <div style={titleStyles}>{formTitle}</div>{" "}
                                    <div style={{ marginBottom: "10px", marginTop: "10px" }}>
                                        {formData.map((filter, index) => (
                                            <Chip
                                                key={index}
                                                label={`${filter.attrib_name}: ${filter.value}`}
                                                onDelete={() => removeFilter(filter.attrib_name)}
                                                color="primary"
                                                variant="outlined"
                                                style={{ marginRight: "5px" }}
                                            />
                                        ))}
                                    </div>
                                </>
                            }
                            data={tableDataState}
                            columns={columnData}
                            options={options}
                            className={classes.table}
                        />
                        {detailsOpen && (
                            <DetailsForm
                                open={detailsOpen}
                                onClose={handleCloseDetailForm}
                                selectedRecord={selectedRecord}
                                id={id}
                                dashDatasetId={dashDatasetId}
                                dashTableId={dashTableId}
                                recId={recId}
                            />
                        )}
                    </Box>
                </>
            </>
        </>
    );
};

FeaturedDataTable.propTypes = {
    type: PropTypes.string,
    mlmodelRefId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    dashDatasetId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    dashTableId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onDashboard: PropTypes.func,
    componentDataId: PropTypes.string,
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    formTitle: PropTypes.string,
    refreshDataTable: PropTypes.func,
    dashColumns: PropTypes.oneOfType([PropTypes.array, PropTypes.object])
};

export default FeaturedDataTable;
