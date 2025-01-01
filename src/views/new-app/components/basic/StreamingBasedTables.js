import React from "react";
// import { createTheme } from "@mui/material/styles";
import PropTypes from "prop-types";
import MUIDataTable from "mui-datatables";
import { useState, useEffect } from "react";
import { GetJWT } from "views/api-configuration/default";
import { getFilterData } from "views/api-configuration/socketsUrls";
import FormArea from "../FormArea";
import { useSelector, useDispatch } from "store";
import CircularProgress from "@mui/material/CircularProgress";
import FiltersForm from "./FiltersForm";
import RoleBasedHOC from "authorization-hocs/RoleBasedHOC";
import { openSnackbar } from "store/slices/snackbar";
import { makeStyles } from "@mui/styles";
import { Box } from "@mui/material";

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
            fontWeight: "bold"
        }
    },
    title: {
        fontWeight: "bold",
        fontSize: "1.5rem",
        color: "#333"
    }
}));
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

let chatSocket;

const StreamingBasedTables = ({ dashDatasetId, dashTableId, componentDataId, viewName }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const { selectedDataset } = useSelector((state) => state.userLogin);
    const [tableDataState, setTableDataState] = useState([]);
    const [tableHeaderState, setTableHeaderState] = useState([]);
    const [rowCount, setRowCount] = useState(10);
    const [pageCount, setPageCount] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const [noDataState, setNoDataState] = useState(<CircularProgress />);
    const [isConnected, setIsConnected] = useState(false);

    const options = {
        responsive: "standard",
        tableBodyMaxHeight: "380px",
        selectableRows: "none",
        selectableRowsVisibleOnly: false,
        elevation: 0,
        serverSide: true,
        textLabels: {
            body: {
                noMatch: noDataState
            }
        },
        pagination: true,
        count: totalCount,
        rowsPerPageOptions: [10, 50, 100],

        rowsPerPage: rowCount,
        page: pageCount,
        onTableChange: (action, tableState) => {
            setRowCount(tableState.rowsPerPage);
            setPageCount(tableState.page);
        },
        customToolbar: () => (
            <>
                <RoleBasedHOC allowedRoles={["TENANT_ADMIN"]}>
                    <FormArea
                        form={<FiltersForm componentDataId={componentDataId} datasetid={dashDatasetId} tableid={dashTableId} />}
                        btnTitle=""
                        icon="true"
                    />
                </RoleBasedHOC>
            </>
        )
    };

    useEffect(() => {
        if (isConnected === true) {
            chatSocket.close(1000);
            setIsConnected(false);
            setTableDataState([]);
            setTableHeaderState([]);
            setNoDataState(<CircularProgress />);
        }
    }, [dashTableId]);
    useEffect(() => {
        const connectWebSocket = () => {
            chatSocket = new WebSocket(getFilterData(viewName));
            chatSocket.onmessage = function (e) {
                setTableDataState([]);
                setTableHeaderState([]);
                const message = JSON.parse(e.data);
                const data = JSON.parse(message.data);
                setTotalCount(message.total_count);
                setTableHeaderState(Object.keys(data[0]));
                setTableDataState([...data]);
                dispatch(
                    openSnackbar({
                        open: true,
                        message: "Message Received Successfully!",
                        variant: "alert",
                        alert: {
                            color: "success"
                        },
                        close: false
                    })
                );
            };

            chatSocket.onopen = function () {
                setIsConnected(true);
                const dataToSend = {
                    message: {
                        from: "client",
                        token: GetJWT(),
                        componentdataid: componentDataId,
                        user: selectedDataset?.emailaddress,
                        anotherKey: "anotherValue",
                        limit: rowCount,
                        offset: rowCount * pageCount
                    }
                };

                chatSocket.send(JSON.stringify(dataToSend));
            };

            chatSocket.onclose = function () {
                console.error("Chat socket closed unexpectedly. Reconnecting...");
            };

            chatSocket.onerror = function (error) {
                console.error("WebSocket Error:", error);
                setNoDataState("Sorry Service is Unavailable at the moment...");
            };

            return () => {
                chatSocket.close();
            };
        };

        connectWebSocket();
    }, [componentDataId]);

    useEffect(() => {
        if (isConnected === true) {
            setTableDataState([]);
            setTableHeaderState([]);
            const dataToSend = {
                message: {
                    from: "client",
                    token: GetJWT(),
                    componentdataid: componentDataId,
                    user: selectedDataset?.emailaddress,
                    anotherKey: "anotherValue",
                    limit: rowCount,
                    offset: rowCount * pageCount
                }
            };

            chatSocket.send(JSON.stringify(dataToSend));
        }
    }, [pageCount, rowCount]);

    return (
        <Box className="_featured-table">
            <MUIDataTable data={tableDataState} columns={tableHeaderState} options={options} className={classes.table} />
        </Box>
    );
};

StreamingBasedTables.propTypes = {
    dashDatasetId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    dashTableId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    componentDataId: PropTypes.string,
    viewName: PropTypes.string
};

export default StreamingBasedTables;
