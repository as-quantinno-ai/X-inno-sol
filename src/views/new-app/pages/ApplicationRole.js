import { useTheme } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
// project imports
import { useDispatch } from "store";
import { useSelector } from "react-redux";
import MUIDataTable from "mui-datatables";
import FormArea from "../components/FormArea";
import RolesForm from "../components/basic/ApplicationUserRoleForm";
import { getAppRole } from "store/slices/approle";
import { selectBaseData } from "store/slices/initial-data";
import { getFormattedDatetime } from "views/api-configuration/default";
import useDraggableColumns from "../../../hooks/useDraggable";
import createColumns from "../../../utils/createColumns";
import { titleStyles } from "constants/tables";

const ApplicationRoles = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const { selectedDataset } = useSelector((state) => state.userLogin);
    const { approle } = useSelector((state) => state.approle);
    const [, setIsFormSubmitted] = useState(false);
    const { columnWidths, onResizeStart } = useDraggableColumns();

    const baseData = useSelector(selectBaseData);
    const userAppRoles = baseData.roles ? baseData.roles.filter((role) => role.type === "USER@APP") : [];

    const handleFormSubmit = () => {
        setIsFormSubmitted(true);
    };

    const options = {
        selectableRows: "none",
        selectableRowsVisibleOnly: false,
        customToolbar: () => (
            <>
                {" "}
                <FormArea form={<RolesForm onSubmit={handleFormSubmit} />} btnTitle="Application Role" />
            </>
        )
    };

    /*eslint-disable*/
    const columns =
        approle && approle.length > 0
            ? [
                  ...Object.keys(approle[0]).map((item, index) => ({
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
                                      {Object.keys(approle[0]).length > 6 ? value : value}
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
                              // const productClientDatasetId = tableMeta.rowData[0];
                              return (
                                  <Button
                                      variant="contained"
                                      color="success"
                                      align="center"
                                      sx={{ width: "150px", borderRadius: "16px", color: theme.palette.secondary.light }}
                                      component={Link}
                                      to={`/add-app-permissions/${roleNamee}/${selectedDataset.productclientdatasetsid}`}
                                  >
                                      Add permissions
                                  </Button>
                              );
                          }
                      }
                  }
              ]
            : [];
    const columnsData = createColumns(columns, columnWidths, onResizeStart);
    /* eslint-enable*/
    useEffect(() => {
        dispatch(getAppRole(userAppRoles));
    }, [userAppRoles]);

    return (
        <>
            {approle ? (
                <>
                    <MUIDataTable
                        title={
                            <>
                                <div style={titleStyles}>Application Roles</div>
                            </>
                        }
                        data={approle}
                        columns={columnsData}
                        options={options}
                    />
                </>
            ) : (
                <div>Loading...</div>
            )}
        </>
    );
};

export default ApplicationRoles;
