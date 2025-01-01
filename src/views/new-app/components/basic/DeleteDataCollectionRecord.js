import React from "react";
import { useDispatch } from "store";
import { openSnackbar } from "store/slices/snackbar";
import { deleteDataSources, deleteCatalog, GetJWT } from "views/api-configuration/default";
import { Button, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { getConfigurations } from "store/slices/datasource-configuration";
import { baseApi } from "store/slices/initial-data";
import api from "views/api-configuration/api";
import PropTypes from "prop-types";
const DeleteDataCollectionRecord = ({
    // dataIndex,
    // index,
    datasourceId,
    catalogsid,
    // id,
    // tableid,
    // dashTableId,
    // dashDatasetId,
    // recId,
    // handleUpdate,
    handleCloseDrawer,
    // selectedRecord,
    // reloads,
    type
}) => {
    const dispatch = useDispatch();
    // const [form, setForm] = useState(null);

    const onFormSubmit = (e) => {
        e.preventDefault();
        if (type === "datasource") {
            api.delete(deleteDataSources(datasourceId), {
                headers: {
                    Authorization: `Bearer ${GetJWT()}`,
                    "Content-Type": "application/json"
                }
            })
                .then((res) => {
                    if (res) {
                        dispatch(getConfigurations(catalogsid));

                        dispatch(
                            openSnackbar({
                                open: true,
                                message: "Record Deleted Successfully",
                                variant: "alert",
                                alert: {
                                    color: "success"
                                },
                                close: false
                            })
                        );
                        handleCloseDrawer();
                    }
                })
                .catch((err) => {
                    console.error("Error Deleting Record:", err);
                    handleCloseDrawer();

                    console.error("Error setting up the request:", err.message);
                    dispatch(
                        openSnackbar({
                            open: true,
                            message: `Error: ${err.message}`,
                            variant: "alert",
                            alert: {
                                color: "error"
                            },
                            close: false
                        })
                    );
                });
        } else if (type === "catalog") {
            api.delete(deleteCatalog(catalogsid), {
                headers: {
                    Authorization: `Bearer ${GetJWT()}`,
                    "Content-Type": "application/json"
                }
            })
                .then((res) => {
                    if (res) {
                        dispatch(baseApi());

                        dispatch(
                            openSnackbar({
                                open: true,
                                message: "Record Deleted Successfully",
                                variant: "alert",
                                alert: {
                                    color: "success"
                                },
                                close: false
                            })
                        );
                        handleCloseDrawer();
                    }
                })
                .catch((err) => {
                    console.error("Error Deleting Record:", err);
                    handleCloseDrawer();

                    console.error("Error setting up the request:", err.message);
                    dispatch(
                        openSnackbar({
                            open: true,
                            message: `Error: ${err.message}`,
                            variant: "alert",
                            alert: {
                                color: "error"
                            },
                            close: false
                        })
                    );
                });
        }
    };

    return (
        <>
            <DialogTitle id="alert-dialog-title" color="secondary">
                Delete Record
            </DialogTitle>
            <DialogContent dividers>
                <DialogContentText id="alert-dialog-description">
                    {datasourceId
                        ? `Are you sure you want to delete datasource ${datasourceId} record?`
                        : `Are you sure you want to delete catalog ${catalogsid} record?`}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseDrawer} color="primary">
                    Cancel
                </Button>
                <Button onClick={onFormSubmit} autoFocus color="primary">
                    Delete
                </Button>
            </DialogActions>
            {/* </Dialog> */}
        </>
    );
};

DeleteDataCollectionRecord.propTypes = {
    datasourceId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    catalogsid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    handleCloseDrawer: PropTypes.func,
    type: PropTypes.string
};
export default DeleteDataCollectionRecord;
