import { useTheme } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import MUIDataTable from "mui-datatables";
import FormArea from "../components/FormArea";
import RolesForm from "../components/basic/ResourceUserRoleForm";
import { getResRole } from "store/slices/resrole";
import { selectBaseData } from "store/slices/initial-data";
import useDraggableColumns from "../../../hooks/useDraggable";
import createColumns from "../../../utils/createColumns";
import { makeStyles } from "@mui/styles";
import { getFormattedDatetime } from "views/api-configuration/default";
import { titleStyles } from "constants/tables";

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
const Roles = () => {
    const theme = useTheme();
    const classes = useStyles();
    const dispatch = useDispatch();
    const { selectedDataset } = useSelector((state) => state.userLogin);
    const { resrole } = useSelector((state) => state.resrole);
    const [, setIsFormSubmitted] = useState(false);

    const baseData = useSelector(selectBaseData);
    const { roles } = baseData;
    const userTrRoles = roles ? roles.filter((role) => role.type === "USER@TR") : [];
    const { columnWidths, onResizeStart } = useDraggableColumns();

    const handleFormSubmit = () => {
        setIsFormSubmitted(true);
    };

    const options = {
        selectableRows: "none",
        selectableRowsVisibleOnly: false,
        customToolbar: () => <FormArea form={<RolesForm onSubmit={handleFormSubmit} />} btnTitle="Add New Role" />
    };

    /*eslint-disable*/
    const columns =
        resrole && resrole.length > 0
            ? [
                  ...Object.keys(resrole[0])?.map((item, index) => ({
                      label: item
                          .replace(/([A-Z])(?=[a-z])|\w(?=\d)/g, " $1")
                          .replace("createdatetime", "Created Date Time")
                          .replace("productclientdatasetsid", "Product Client Dataset ID")

                          .replace("updatedatetime", "Updated Date Time")
                          .toUpperCase(),
                      name: item,
                      options: {
                          customBodyRender: (value, tableMeta, updateValue) => {
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
                                      {Object.keys(resrole[0]).length > 6 ? value : value}
                                  </div>
                              );
                          }
                      }
                  })),
                  {
                      name: "ADD PERMISSIONS",
                      cellStyle: {
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis"
                      },
                      options: {
                          filter: true,
                          sort: false,
                          empty: true,
                          customBodyRender: (value, tableMeta) => {
                              const roleNamee = tableMeta.rowData[2];
                              return (
                                  <Button
                                      variant="contained"
                                      color="success"
                                      align="center"
                                      sx={{ width: "150px", borderRadius: "16px", color: theme.palette.secondary.light }}
                                      component={Link}
                                      to={`/add-permissions/${roleNamee}/${selectedDataset.productclientdatasetsid}`}
                                  >
                                      Add permissions
                                  </Button>
                              );
                          }
                      }
                  }
              ]
            : [];
    /*eslint-enable*/
    const columnsData = createColumns(columns, columnWidths, onResizeStart);

    useEffect(() => {
        dispatch(getResRole(userTrRoles));
    }, [userTrRoles, dispatch]);

    return (
        <>
            {resrole ? (
                <MUIDataTable
                    title={
                        <>
                            <div style={titleStyles}>Resource Role</div>
                        </>
                    }
                    data={resrole}
                    columns={columnsData}
                    options={options}
                    className={classes.table}
                />
            ) : (
                <div>Loading...</div>
            )}
        </>
    );
};

export default Roles;
