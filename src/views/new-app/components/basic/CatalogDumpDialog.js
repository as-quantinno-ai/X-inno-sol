import React from "react";
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText } from "@mui/material";
import { useDispatch } from "store";
import { openSnackbar } from "store/slices/snackbar";
import {
    truncateProcessedDataUrl,
    truncateUnprocessedDataUrl,
    deleteCertainRecordsUrl,
    catalogDumpUrl,
    GetAccessToken
} from "views/api-configuration/default";
import api from "views/api-configuration/api";
import PropTypes from "prop-types";
const CatalogDumpDelete = ({ dialogOpen, datasetid, tableid, tablename, handleDialogClose, type }) => {
    const dispatch = useDispatch();

    const url = () => {
        /*eslint-disable*/
        switch (type) {
            case "processed":
                return truncateProcessedDataUrl(datasetid, tableid);

            case "unprocessed":
                return truncateUnprocessedDataUrl(datasetid, tableid);

            case "Records":
                return deleteCertainRecordsUrl(datasetid, tableid);

            case "Catalog":
                return catalogDumpUrl(datasetid, tableid);
            default:
                return null;
        }
        /*eslint-enable*/
    };

    const handleConfirmDelete = () => {
        api.delete(`${url()}`, {
            headers: GetAccessToken()
        })
            // eslint-disable-next-line no-unused-vars
            .then((res) => {
                dispatch(
                    openSnackbar({
                        open: true,
                        message: " Data Cleared Successfully",
                        variant: "alert",
                        alert: {
                            color: "success"
                        },
                        close: false
                    })
                );
            })
            .catch((err) => {
                console.log("catalogDumpDialog", err);

                dispatch(
                    openSnackbar({
                        open: true,
                        message: "Error Deleting Data",
                        variant: "alert",
                        alert: {
                            color: "error"
                        },
                        close: false
                    })
                );
            });

        handleDialogClose();
    };

    handleConfirmDelete.propTypes = {
        type: PropTypes.string.isRequired
    };
    return (
        <Dialog open={dialogOpen} onClose={handleDialogClose}>
            <DialogTitle color="secondary">Delete Confirmation</DialogTitle>
            <DialogContent dividers>
                <DialogContentText>Are you sure you want to delete the catalog: {tablename} ?</DialogContentText>
            </DialogContent>

            <DialogActions>
                <Button onClick={handleDialogClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={() => handleConfirmDelete(type)} color="primary">
                    Confirm Delete
                </Button>
            </DialogActions>
        </Dialog>
    );
};

CatalogDumpDelete.propTypes = {
    dialogOpen: PropTypes.bool,
    datasetid: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    tableid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    catalogsid: PropTypes.string,
    tablename: PropTypes.string,
    handleDialogClose: PropTypes.func,
    type: PropTypes.string
};
export default CatalogDumpDelete;
