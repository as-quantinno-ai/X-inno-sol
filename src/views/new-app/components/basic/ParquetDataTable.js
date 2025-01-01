// import { useTheme, createTheme, ThemeProvider } from "@mui/material/styles";
import PropTypes from "prop-types";
import MUIDataTable from "mui-datatables";
import React, { useState, useEffect } from "react";
import { truncateText, loadParquetData, GetAccessToken } from "views/api-configuration/default";
import PublishToDashboardForm from "./PublishToDashboardForm";
import FormArea from "../FormArea";
import { setButtons } from "store/slices/app-globe";
import { useSelector, useDispatch } from "store";
import { setRecordDetails } from "store/slices/trigger";
import { useNavigate } from "react-router-dom";
import { ListItemIcon } from "@mui/material";

// assets
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import api from "views/api-configuration/api";

const GridPublishTypeNEvents = ({ type, mlmodelRefId, actionButtons, onDashboard }) => {
    const { selectedFeaturedDataSource } = useSelector((state) => state.dataCollection);
    const { selectedRawDataSource } = useSelector((state) => state.dataCollection);

    let elem = <></>;

    if (type === "raw") {
        elem = (
            <>
                {" "}
                {selectedRawDataSource ? (
                    <>
                        {actionButtons
                            ?.filter((obj) => obj.button.buttonType === "TABLE")
                            .map((obj, indx1) => (
                                <button key={indx1} type="submit">
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
    } else if (type === "feature") {
        elem = (
            <>
                {" "}
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
        <>
            {" "}
            {selectedFeaturedDataSource ? (
                <FormArea
                    form={
                        <PublishToDashboardForm
                            functionname="PREDICTIONS-DATA-GRID"
                            referenceid={mlmodelRefId}
                            tableid={selectedFeaturedDataSource.tableid}
                            componentDisplayType="GRID"
                        />
                    }
                    btnTitle="Publish"
                />
            ) : (
                <></>
            )}
        </>;
    }
    return elem;
};

GridPublishTypeNEvents.propTypes = {
    type: PropTypes.string,
    mlmodelRefId: PropTypes.string,
    actionButtons: PropTypes.array,
    onDashboard: PropTypes.bool
};
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

const ParquetDataTable = ({ type, mlmodelRefId, dashDatasetId, dashTableId, onDashboard }) => {
    const { selectedFeaturedDataSource } = useSelector((state) => state.dataCollection);
    const { selectedRawDataSource } = useSelector((state) => state.dataCollection);
    const successSX = { color: "success.dark" };
    const errorSX = { color: "error.main" };

    const navigate = useNavigate();
    const [tableDataState, setTableDataState] = useState([]);
    const [tableHeaderState, setTableHeaderState] = useState([]);
    const [rowCount, setRowCount] = useState(0);
    const [pageCount, setPageCount] = useState(10);

    const { actionButtons } = useSelector((state) => state.globe);

    const dispatch = useDispatch();

    function eventTrigger(productclientdatasetsid, tableid, recid, event) {
        /*eslint-disable*/
        switch (event.eventType) {
            case "details":
                dispatch(setRecordDetails(event.eventApi, productclientdatasetsid, tableid, recid));
                navigate("/details");
                break;
            default:
                break;
        }
        /*eslint-enable*/
    }

    useEffect(() => {
        if (type === "raw" && selectedRawDataSource) {
            dispatch(
                setButtons(dashDatasetId || selectedRawDataSource.productclientdatasetsid, dashTableId || selectedRawDataSource.tableid)
            );
        } else if (type === "feature" && selectedFeaturedDataSource) {
            dispatch(
                setButtons(
                    dashDatasetId || selectedFeaturedDataSource.productclientdatasetsid,
                    dashTableId || selectedFeaturedDataSource.tableid
                )
            );
        }
    }, [selectedRawDataSource, selectedFeaturedDataSource]);

    useEffect(() => {
        const fetchResource = (type) => {
            /* eslint-disable*/
            switch (type) {
                case "raw":
                    return loadParquetData(
                        dashDatasetId || selectedRawDataSource.productclientdatasetsid,
                        dashTableId || selectedRawDataSource.tableid,
                        rowCount,
                        pageCount,
                        "all"
                    );
                case "feature":
                    return loadParquetData(
                        dashDatasetId || selectedFeaturedDataSource.productclientdatasetsid,
                        dashTableId || selectedFeaturedDataSource.tableid,
                        rowCount,
                        pageCount,
                        "all"
                    );
                default:
                    return loadParquetData(
                        dashDatasetId || selectedRawDataSource.productclientdatasetsid,
                        dashTableId || selectedRawDataSource.tableid,
                        rowCount,
                        pageCount,
                        "all"
                    );
            }
            /*eslint-enable*/
        };
        const fetchData = () => {
            api.get(fetchResource(type), { headers: GetAccessToken() }).then((response) => {
                const parsedData = JSON.parse(response.data.data);
                setTableDataState(parsedData);
                setTableHeaderState([
                    {
                        name: "DATA_STATUS",
                        label: "DATA_STATUS",
                        options: {
                            customBodyRender: (value) => (
                                <ListItemIcon>
                                    {value === "P" ? <ArrowDropUpIcon sx={successSX} /> : <ArrowDropDownIcon sx={errorSX} />}
                                </ListItemIcon>
                            ) // Use the custom cell renderer
                        }
                    },
                    /* eslint-disable*/
                    ...(parsedData[0]
                        ? Object.keys(parsedData[0])
                              .slice(1, Object.keys(parsedData[0]).length)
                              .map((item) => ({
                                  label: item.toUpperCase(),
                                  name: item,
                                  options: {
                                      filter: true,
                                      sort: true,
                                      wrap: true,
                                      customBodyRender: (value) => <div style={{ width: 20 * 7 }}>{truncateText(value, 20)}</div>
                                  }
                              }))
                        : []),
                    /* eslint-enable*/
                    {
                        name: "rec_actions_n_events",
                        label: "ACTIONS",
                        options: {
                            filter: false,
                            sort: false,
                            empty: true,
                            customBodyRenderLite: () => {
                                // const rowData = rawDataSources[dataIndex];
                                return (
                                    <>
                                        {actionButtons
                                            ?.filter((obj) => obj.button.buttonType === "REC")
                                            .map((obj, indx) => (
                                                <button key={indx} type="submit" onClick={() => eventTrigger(1, 5, 0, obj.event)}>
                                                    {obj.button.buttonName}
                                                </button>
                                            ))}
                                    </>
                                );
                            }
                        }
                    }
                ]);
            });
        };

        fetchData();
    }, [
        rowCount,
        pageCount,
        type,
        mlmodelRefId,
        dashDatasetId,
        dashTableId,
        onDashboard,
        selectedRawDataSource,
        selectedFeaturedDataSource
    ]);

    const options = {
        responsive: true,
        tableBodyMaxHeight: "380px",
        selectableRows: "none",
        selectableRowsVisibleOnly: false,
        elevation: 0,
        serverSide: true,
        rowsPerPageOptions: [10, 50, 100],

        onTableChange: (action, tableState) => {
            setRowCount(tableState.rowsPerPage);
            setPageCount(tableState.page);
        },
        customToolbar: () => (
            <GridPublishTypeNEvents type={type} mlmodelRefId={mlmodelRefId} actionButtons={actionButtons} onDashboard={onDashboard} />
        )
    };

    return <MUIDataTable data={tableDataState} columns={tableHeaderState} options={options} />;
};

ParquetDataTable.propTypes = {
    type: PropTypes.string,
    mlmodelRefId: PropTypes.string,
    dashDatasetId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    dashTableId: PropTypes.string,
    onDashboard: PropTypes.bool
};
export default ParquetDataTable;
