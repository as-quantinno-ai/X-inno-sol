import React, { useEffect, useState } from "react";
import MUIDataTable from "mui-datatables";
import { useSelector } from "react-redux";
import { dispatch } from "store";
import { Box } from "@mui/system";
import { CircularProgress, Typography } from "@mui/material";
import FormArea from "../components/FormArea";
import AssignResRolesForm from "../components/basic/AssignResRoleForm";
import { setAssignedResRoles } from "store/slices/assignresrole";
import { selectBaseData } from "store/slices/initial-data";
import { getFormattedDatetime } from "views/api-configuration/default";
import createColumns from "../../../utils/createColumns";
import useDraggableColumns from "../../../hooks/useDraggable";
import { makeStyles } from "@mui/styles";
import { titleStyles } from "constants/tables";

const useStyles = makeStyles(() => ({
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
    title: {
        fontWeight: "bold",
        fontSize: "1.5rem",
        color: "#333"
    }
}));

const AssignResRoles = () => {
    const classes = useStyles();

    const { assignresrole } = useSelector((state) => state.userresrole);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const baseData = useSelector(selectBaseData);
    const userTrRoles = baseData.roles ? baseData.roles.filter((role) => role.type === "USER@TR") : [];
    const { columnWidths, onResizeStart } = useDraggableColumns();

    const options = {
        selectableRows: "none",
        selectableRowsVisibleOnly: false,
        resizableColumns: true,
        customToolbar: () => (
            <>
                <FormArea form={<AssignResRolesForm />} btnTitle="Assign New Resource Role" />
            </>
        )
    };

    /*eslint-disable*/
    const columns =
        assignresrole && assignresrole.length > 0
            ? Object.keys(assignresrole[0]).map((item, index) => ({
                  label: item
                      .replace(/([A-Z])(?=[a-z])|\w(?=\d)/g, " $1")
                      .replace("createdatetime", "Created Date Time")
                      .replace("productclientdatasetsid", "Product Client Dataset ID")

                      .replace("updatedatetime", "Updated Date Time")
                      .toUpperCase(),
                  name: item,
                  options: {
                      customBodyRender: (value) => {
                          if (item === "createdatetime" || item === "updatedatetime") {
                              return (
                                  <div
                                      style={{
                                          whiteSpace: "nowrap",
                                          overflow: "hidden",
                                          textOverflow: "ellipsis",
                                          maxWidth: columnWidths[index] || "auto"
                                      }}
                                  >
                                      {getFormattedDatetime(value)}
                                  </div>
                              );
                          }
                          return (
                              <div
                                  style={{
                                      whiteSpace: "nowrap",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      maxWidth: columnWidths[index] || "auto"
                                  }}
                              >
                                  {Object.keys(assignresrole[0]).length > 6 ? value : value}
                              </div>
                          );
                      }
                  }
              }))
            : [];
    /*eslint-enable*/
    const columnsData = createColumns(columns, columnWidths, onResizeStart);

    useEffect(() => {
        dispatch(setAssignedResRoles(userTrRoles))
            .then(() => {
                setLoading(false);
            })
            .catch((error) => {
                setLoading(false);
                setError(error.message || "An error occurred while fetching data");
            });
    }, [userTrRoles]);

    if (loading) {
        return (
            <Box
                sx={{
                    margin: 0,
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)"
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box
                sx={{
                    margin: 0,
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    textAlign: "center"
                }}
            >
                <Typography variant="h6" color="error">
                    {error} - Api Fetching Error
                </Typography>
            </Box>
        );
    }

    return (
        <MUIDataTable
            title={
                <>
                    <div style={titleStyles}>Assigned Resource Roles</div>
                </>
            }
            data={assignresrole}
            columns={columnsData}
            options={options}
            className={classes.table}
        />
    );
};

export default AssignResRoles;
