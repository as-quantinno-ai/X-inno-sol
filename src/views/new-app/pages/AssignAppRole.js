import React, { useEffect, useState } from "react";
import MUIDataTable from "mui-datatables";
import { useSelector } from "react-redux";
import { dispatch } from "store";
import { Box } from "@mui/system";
import { CircularProgress, Typography } from "@mui/material";
import FormArea from "../components/FormArea";
import AssignAppRolesForm from "../components/basic/AssignAppRoleForm";
import { getAssignedAppRoles } from "store/slices/assignapprole";
import { selectBaseData } from "store/slices/initial-data";
import { makeStyles } from "@mui/styles";
import useDraggableColumns from "../../../hooks/useDraggable";
import createColumns from "../../../utils/createColumns";
import { getFormattedDatetime } from "views/api-configuration/default";
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

const AssignAppRoles = () => {
    const classes = useStyles();
    const { assignapprole } = useSelector((state) => state.userrole);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const baseData = useSelector(selectBaseData);
    const { roles } = baseData;
    const AssignAppRoles = baseData.roles ? baseData.roles.filter((role) => role.type === "USER@APP") : [];
    const { columnWidths, onResizeStart } = useDraggableColumns();

    const options = {
        selectableRows: "none",
        selectableRowsVisibleOnly: false,
        resizableColumns: true,
        customToolbar: () => (
            <>
                <FormArea form={<AssignAppRolesForm />} btnTitle="Assign New App Role" />
            </>
        )
    };

    /*eslint-disable*/
    const columns =
        assignapprole && assignapprole.length > 0
            ? Object.keys(assignapprole[0]).map((item, index) => ({
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
                                  {Object.keys(assignapprole[0]).length > 6 ? value : value}
                              </div>
                          );
                      }
                  }
              }))
            : [];
    /*eslint-enable*/
    const columnsData = createColumns(columns, columnWidths, onResizeStart);

    useEffect(() => {
        dispatch(getAssignedAppRoles(AssignAppRoles))
            .then(() => {
                setLoading(false);
            })
            .catch((error) => {
                setLoading(false);
                setError(error.message || "An error occurred while fetching data");
            });
    }, [roles]);

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
                    <div style={titleStyles}>Assigned App Roles</div>
                </>
            }
            data={assignapprole}
            columns={columnsData}
            options={options}
            className={classes.table}
        />
    );
};

export default AssignAppRoles;
