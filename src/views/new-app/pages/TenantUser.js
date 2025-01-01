import React, { useEffect } from "react";

// project imports
import { useDispatch } from "store";
import { useSelector } from "react-redux";
import { getAllCatalogs } from "store/slices/AppDashboardRawSha";
import MUIDataTable from "mui-datatables";
import FormArea from "../components/FormArea";
import TenantUserForm from "../components/basic/TenantUserForm";
import { getAllUserTenant } from "store/slices/tenantuser";
import { selectBaseData } from "store/slices/initial-data";
import { makeStyles } from "@mui/styles";
import useDraggableColumns from "../../../hooks/useDraggable";
import createColumns from "../../../utils/createColumns";
import { getFormattedDatetime } from "views/api-configuration/default";
import { Box } from "@mui/system";
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

const TenantUser = () => {
    const dispatch = useDispatch();
    const classes = useStyles();
    const { tenantuser } = useSelector((state) => state.tenantuser);
    const baseData = useSelector(selectBaseData);
    const { userTr, catalogs } = baseData;
    const { columnWidths, onResizeStart } = useDraggableColumns();

    const options = {
        selectableRows: "none",
        selectableRowsVisibleOnly: false,
        customToolbar: () => (
            <>
                <FormArea form={<TenantUserForm />} btnTitle="Tenant User" />
            </>
        )
    };

    /*eslint-disable*/
    const columns =
        tenantuser && tenantuser.length > 0
            ? Object.keys(tenantuser[0])?.map((item, index) => ({
                  label: item
                      .replace("createDateTime", "Created Date Time")
                      .replace("updatedDateTime", "Updated Date Time")
                      .replace("productclientdatasetsid", "Product Client ID")
                      .replace(/([A-Z])(?=[a-z])|\w(?=\d)/g, " $1")

                      .replace(/_/g, " ")
                      .toUpperCase(),
                  name: item,
                  options: {
                      customBodyRender: (value) => {
                          if (item === "createDateTime" || item === "updatedDateTime") {
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
                                  {Object.keys(tenantuser[0]).length > 6 ? value : value}
                              </div>
                          );
                      }
                  }
              }))
            : [];

    /*eslint-enable*/
    const columnsData = createColumns(columns, columnWidths, onResizeStart);

    useEffect(() => {
        dispatch(getAllUserTenant(userTr));
    }, [userTr, dispatch]);

    useEffect(() => {
        if (catalogs) {
            dispatch(getAllCatalogs(catalogs));
        }
    }, [catalogs, dispatch]);

    return (
        <>
            {tenantuser ? (
                <Box className="_query-table">
                    <MUIDataTable
                        title={
                            <>
                                <div style={titleStyles}>Resource User</div>
                            </>
                        }
                        data={tenantuser}
                        columns={columnsData}
                        options={options}
                        className={classes.table}
                    />
                </Box>
            ) : (
                <div>Loading...</div>
            )}
        </>
    );
};
export default TenantUser;
