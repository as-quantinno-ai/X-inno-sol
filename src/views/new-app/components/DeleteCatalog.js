import React from "react";
import PropTypes from "prop-types";
import { useDispatch } from "store";
import { openSnackbar } from "store/slices/snackbar";
import { deleteDataSources, GetJWT } from "views/api-configuration/default";
import { Button, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { getConfigurations } from "store/slices/datasource-configuration";
import api from "views/api-configuration/api";

const DeleteCatalog = ({ datasourceId, catalogsId, handleCloseDrawer }) => {
    const dispatch = useDispatch();

    const onFormSubmit = (e) => {
        e.preventDefault();

        api.delete(deleteDataSources(datasourceId), {
            headers: {
                Authorization: `Bearer ${GetJWT()}`,
                "Content-Type": "application/json"
            }
        })
            .then((res) => {
                if (res) {
                    dispatch(getConfigurations(catalogsId));

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
                        : `Are you sure you want to delete catalog : ${catalogsId} record?`}
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

DeleteCatalog.propTypes = {
    datasourceId: PropTypes.oneOfType[(PropTypes.string, PropTypes.number)],
    catalogsId: PropTypes.oneOfType[(PropTypes.string, PropTypes.number)],
    handleCloseDrawer: PropTypes.func
};
export default DeleteCatalog;
