import React, { useEffect } from "react";

// project imports
import { useDispatch } from "store";
import { useSelector } from "react-redux";
import { getAllCatalogs } from "store/slices/AppDashboardRawSha";
import MUIDataTable from "mui-datatables";
import FormArea from "../components/FormArea";
import ApplicationUserForm from "../components/basic/AppUserForm";
import { getAllAppUser } from "store/slices/appuser";
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

const ApplicationUser = () => {
    const dispatch = useDispatch();
    const classes = useStyles();
    const { appuser } = useSelector((state) => state.appuser);
    const baseData = useSelector(selectBaseData);
    const { userApp, catalogs } = baseData;
    const { columnWidths, onResizeStart } = useDraggableColumns();

    const options = {
        selectableRows: "none",
        selectableRowsVisibleOnly: false,
        customToolbar: () => (
            <>
                <FormArea form={<ApplicationUserForm />} btnTitle="Application User" />
            </>
        )
    };
    /*eslint-disable*/
    const columns =
        appuser && appuser.length > 0
            ? Object.keys(appuser[0]).map((item, index) => ({
                  label: item
                      .replace(/([A-Z])(?=[a-z])|\w(?=\d)/g, " $1")
                      .replace("createdatetime", "Created Date Time")
                      .replace("productclientdatasetid", "Product Client Dataset ID")

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
                                  {Object.keys(appuser[0]).length > 6 ? value : value}
                              </div>
                          );
                      }
                  }
              }))
            : [];
    const columnsData = createColumns(columns, columnWidths, onResizeStart);
    /*eslint-enable*/
    useEffect(() => {
        dispatch(getAllAppUser(userApp));
    }, [userApp]);

    useEffect(() => {
        if (catalogs) {
            dispatch(getAllCatalogs(catalogs));
        }
    }, [catalogs]);

    return (
        <>
            {appuser ? (
                <MUIDataTable
                    title={
                        <>
                            <div style={titleStyles}>Applcation User</div>
                        </>
                    }
                    data={appuser}
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
export default ApplicationUser;
