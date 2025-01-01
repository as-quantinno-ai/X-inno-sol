import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MUIDataTable from "mui-datatables";

import { Alert } from "@mui/material";
import { useSelector } from "react-redux";

import { useTheme } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";

import {
    GetAccessToken,
    delRoleResourcePermission,
    getTenantResourcePermissions,
    setRoleResoursePermission
} from "views/api-configuration/default";
import api from "views/api-configuration/api";
import AddAppRolePermissionForm from "./AppRoleAddPermission";
import { titleStyles } from "constants/tables";
import useDraggableColumns from "hooks/useDraggable";
import createColumns from "utils/createColumns";

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

const AddPermissionForm = () => {
    const classes = useStyles();
    const theme = useTheme();

    const { roleNamee, productClientDatasetId } = useParams();
    const { roleAddpermissions } = useSelector((state) => state.roleaddpermission);

    const [selectedCheckboxes, setSelectedCheckboxes] = useState({});
    const [loading, setLoading] = useState(true);
    const [showSelectedSuccessMessage, setShowSelectedSuccessMessage] = useState(false);
    const [showUnselectedSuccessMessage, setShowUnselectedSuccessMessage] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [updatedProcessedData, setUpdatedProcessedData] = useState([]);

    const { columnWidths, onResizeStart } = useDraggableColumns();

    function processData(permissions) {
        const unique = new Set();

        permissions.forEach((item) => {
            const nameParts = item.permissionResourceName.split("_");
            const resourceName = nameParts.slice(0, -1).join(" ");

            if (!unique.has(resourceName)) {
                unique.add(resourceName);
            }
        });

        const arr = [];
        unique.forEach((resourceName) => {
            arr.push({
                resourceName,
                create: resourceName,
                read: resourceName,
                update: resourceName,
                delete: resourceName,
                sidebarview: resourceName
            });
        });

        return arr;
    }

    async function fetchSelectedCheckboxes(productClientDatasetId, roleNamee, showLoading = true) {
        try {
            if (showLoading) {
                setLoading(true);
            }

            const response = await api.get(getTenantResourcePermissions(productClientDatasetId, roleNamee), {
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (response.status !== 200) {
                console.error("Failed to fetch checkbox state from server:", response.status);
                return;
            }

            const checkboxStateData = response.data.result;

            const updatedCheckboxes = {};

            checkboxStateData.forEach((item) => {
                const nameParts = item.permissionResourceName.split("_");
                const resourceName = nameParts.slice(0, -1).join(" ");
                const action = nameParts[nameParts.length - 1];
                const columnName = action.toLowerCase();

                if (!updatedCheckboxes[resourceName]) {
                    updatedCheckboxes[resourceName] = {
                        create: false,
                        read: false,
                        update: false,
                        delete: false,
                        sidebarview: false
                    };
                }

                updatedCheckboxes[resourceName][columnName] = true;
            });

            setSelectedCheckboxes(updatedCheckboxes);

            setLoading(false);
        } catch (error) {
            console.error("Error fetching data from the server:", error);
        }
    }

    useEffect(() => {
        fetchSelectedCheckboxes(productClientDatasetId, roleNamee);
    }, [productClientDatasetId, roleNamee]);

    useEffect(() => {
        if (roleAddpermissions && roleAddpermissions.length > 0) {
            const processedData = processData(roleAddpermissions);
            setUpdatedProcessedData(processedData);
        } else {
            setUpdatedProcessedData([]);
        }
    }, [roleAddpermissions]);

    const handleCheckboxClick = async (resourceName, columnName) => {
        const updatedCheckboxes = {
            ...selectedCheckboxes
        };
        if (!updatedCheckboxes[resourceName]) {
            updatedCheckboxes[resourceName] = {
                create: false,
                read: false,
                update: false,
                delete: false,
                sidebarview: false
            };
        }
        updatedCheckboxes[resourceName][columnName] = !updatedCheckboxes[resourceName][columnName];
        const permissionResourceName = `${resourceName.replace(/\s/g, "_")}_${columnName.toUpperCase()}`;
        const permissionResourceId = roleAddpermissions.find(
            (item) => item.permissionResourceName === permissionResourceName
        )?.permissionResourceId;

        if (updatedCheckboxes[resourceName][columnName]) {
            // Checkbox is checked, send a POST request to create the object
            const response = await api.post(
                setRoleResoursePermission,
                {
                    productClientDatasetsId: productClientDatasetId,
                    resourcePermission: {
                        permissionResourceId,
                        permissionResourceName
                    },
                    roleName: roleNamee
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        ...GetAccessToken()
                    }
                }
            );
            if (response.status === 200) {
                setShowSelectedSuccessMessage(true);
                setShowUnselectedSuccessMessage(false);
                setTimeout(() => {
                    setShowSelectedSuccessMessage(false);
                }, 1000);
                fetchSelectedCheckboxes(productClientDatasetId, roleNamee, false);
            } else {
                console.error("Error creating object:", response.status, response.data);
                setErrorMessage(`Error creating object: ${response.status} - ${response.data}`);
            }
        } else {
            const deletePayload = {
                productClientDatasetsId: productClientDatasetId,
                resourcePermission: {
                    permissionResourceId,
                    permissionResourceName
                },
                roleName: roleNamee
            };

            const deleteResponse = await api.delete(delRoleResourcePermission, {
                headers: {
                    "Content-Type": "application/json",
                    ...GetAccessToken()
                },
                data: deletePayload
            });

            if (deleteResponse.status === 200) {
                setShowSelectedSuccessMessage(false);
                setShowUnselectedSuccessMessage(true);
                setTimeout(() => {
                    setShowUnselectedSuccessMessage(false);
                }, 1000);
                fetchSelectedCheckboxes(productClientDatasetId, roleNamee, false);
            } else {
                console.error("Error deleting object:", deleteResponse.status, deleteResponse.data);
                setErrorMessage(`Error deleting object: ${deleteResponse.status} - ${deleteResponse.data}`);
            }
        }
    };

    const handleRowClick = async (rowData) => {
        const resourceName = rowData[0];
        const promises = [];
        ["create", "read", "update", "delete", "sidebarview"].forEach((columnName) => {
            const permissionResourceName = `${resourceName}_${columnName.toUpperCase()}`;
            const permissionResourceId = roleAddpermissions.find(
                (item) => item.permissionResourceName === permissionResourceName
            )?.permissionResourceId;

            if (
                !selectedCheckboxes[resourceName] || // all false
                !selectedCheckboxes[resourceName][columnName] // this column is false
            ) {
                promises.push(
                    api.post(
                        setRoleResoursePermission,
                        {
                            productClientDatasetsId: productClientDatasetId,
                            resourcePermission: {
                                permissionResourceId,
                                permissionResourceName
                            },
                            roleName: roleNamee
                        },
                        {
                            headers: {
                                "Content-Type": "application/json",
                                ...GetAccessToken()
                            }
                        }
                    )
                );
            }
        });

        try {
            const responses = await Promise.all(promises);
            let hasAnyFailed = false;
            responses.forEach((response) => {
                if (response.status !== 200) {
                    hasAnyFailed = true;
                }
            });
            if (hasAnyFailed) {
                console.error(`Error selected all of ${resourceName}`);
                setErrorMessage(`Error selected all of ${resourceName}`);
            } else {
                setShowSelectedSuccessMessage(true);
                setShowUnselectedSuccessMessage(false);
                setTimeout(() => {
                    setShowSelectedSuccessMessage(false);
                }, 1000);
                fetchSelectedCheckboxes(productClientDatasetId, roleNamee, false);
            }
        } catch (e) {
            console.error(`Error selected all of ${resourceName}:${e.message}`);
            setErrorMessage(`Error selected all of ${resourceName}`);
        }
    };

    const option = {
        selectableRows: "none",
        selectableRowsVisibleOnly: false,
        rowsPerPage: 100,
        onRowClick: handleRowClick
    };

    const checkboxStyle = {
        transform: "scale(1.5)",
        marginRight: "8px",
        accentColor: theme.palette.primary.dark
    };

    const columns = [
        {
            name: "resourceName",
            label: "Resource Name",
            width: 300,
            options: {
                filter: true,
                sort: true,
                wrap: true
            }
        },
        {
            name: "create",
            label: "Create",
            options: {
                customBodyRender: (value) => (
                    <input
                        type="checkbox"
                        style={checkboxStyle}
                        checked={selectedCheckboxes[value]?.create || false}
                        onChange={() => handleCheckboxClick(value, "create")}
                        onClick={(event) => event.stopPropagation()}
                    />
                )
            }
        },
        {
            name: "read",
            label: "Read",
            options: {
                customBodyRender: (value) => (
                    <input
                        type="checkbox"
                        style={checkboxStyle}
                        checked={selectedCheckboxes[value]?.read || false}
                        onChange={() => handleCheckboxClick(value, "read")}
                        onClick={(event) => event.stopPropagation()}
                    />
                )
            }
        },
        {
            name: "update",
            label: "Update",
            options: {
                customBodyRender: (value) => (
                    <input
                        type="checkbox"
                        style={checkboxStyle}
                        checked={selectedCheckboxes[value]?.update || false}
                        onChange={() => handleCheckboxClick(value, "update")}
                        onClick={(event) => event.stopPropagation()}
                    />
                )
            }
        },
        {
            name: "delete",
            label: "Delete",
            options: {
                customBodyRender: (value) => (
                    <input
                        type="checkbox"
                        style={checkboxStyle}
                        checked={selectedCheckboxes[value]?.delete || false}
                        onChange={() => handleCheckboxClick(value, "delete")}
                        onClick={(event) => event.stopPropagation()}
                    />
                )
            }
        },
        {
            name: "sidebarview",
            label: "Sidebar View",
            options: {
                customBodyRender: (value) => (
                    <input
                        type="checkbox"
                        style={checkboxStyle}
                        checked={selectedCheckboxes[value]?.sidebarview || false}
                        onChange={() => handleCheckboxClick(value, "sidebarview")}
                        onClick={(event) => event.stopPropagation()}
                    />
                )
            }
        }
    ];

    const columnsData = createColumns(columns, columnWidths, onResizeStart);

    return (
        <>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <>
                    <div
                        className="message-container"
                        style={{
                            height: "40px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-end",
                            marginBottom: "10px",
                            position: "fixed",
                            right: "20px",
                            top: "20px",
                            zIndex: 10000
                        }}
                    >
                        {showSelectedSuccessMessage && (
                            <Alert variant="filled" severity="success">
                                Checkbox selected successfully
                            </Alert>
                        )}
                        {showUnselectedSuccessMessage && (
                            <Alert variant="filled" severity="error">
                                Checkbox unselected successfully
                            </Alert>
                        )}
                        {errorMessage && (
                            <Alert variant="filled" severity="error">
                                {errorMessage}
                            </Alert>
                        )}
                    </div>

                    <div
                        className="datatable-container"
                        style={{ position: "relative", minHeight: "300px", overflow: "hidden", marginBottom: "20px" }}
                    >
                        <AddAppRolePermissionForm title="Add Permissions" />
                    </div>
                    <div className="datatable-container" style={{ position: "relative", minHeight: "300px", overflow: "hidden" }}>
                        <MUIDataTable
                            title={
                                <>
                                    <div style={titleStyles}>Role Permissions</div>
                                </>
                            }
                            data={updatedProcessedData}
                            columns={columnsData}
                            options={option}
                            className={classes.table}
                        />
                    </div>
                </>
            )}
        </>
    );
};

export default AddPermissionForm;
