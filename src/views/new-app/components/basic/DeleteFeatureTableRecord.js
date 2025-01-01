import React, { useEffect, useState } from "react";

import { useDispatch } from "store";
import { openSnackbar } from "store/slices/snackbar";
import { getCustomFormsByFormId, updateCustomFormData, GetJWT } from "views/api-configuration/default";
import { Button, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import PropTypes from "prop-types";
import api from "views/api-configuration/api";

const DeleteFeatureTableRecord = ({
    dataIndex,
    index,
    id,
    dashTableId,
    dashDatasetId,
    recId,
    // handleUpdate,
    selectedRecord,
    handleCloseDrawer,
    handleReload
}) => {
    const dispatch = useDispatch();
    const [form, setForm] = useState(null);
    const [location, setLocation] = useState(null);
    const [formData, setFormData] = useState(new FormData());
    // eslint-disable-next-line no-unused-vars
    const [loadingRecordDialog, setLoadingRecordDialog] = useState({});
    const loadForm = async () => {
        try {
            const res = await api.get(getCustomFormsByFormId(id));
            setForm(res.data.result);
            setLocation(res.data.result.fileLocation);
        } catch (err) {
            console.error(err);
        }
    };

    // eslint-disable-next-line no-unused-vars
    const [multiChoiceData, setMultiChoiceData] = useState({});

    useEffect(() => {
        const formDataObj = new FormData();
        formDataObj.append("data", "{}");
        formDataObj.append("formid", id);
        formDataObj.append("status", "D");
        formDataObj.append("uuid", recId);
        formDataObj.append("files", null);
        formDataObj.append("file_location", location);
        setMultiChoiceData({});
        setMultiChoiceData({});
        setFormData(formDataObj);
    }, [id, location]);

    useEffect(() => {
        loadForm();
    }, [id]);

    const onFormSubmit = (e) => {
        e.preventDefault();
        const mergedData = {};

        JSON?.parse(form?.formfields)?.forEach((field) => {
            if (field.role === "sec") {
                return;
            }
            const fieldName = field.field_name;
            const fieldType = field.dtype;

            const selectedValue = selectedRecord && selectedRecord[0][fieldName];
            const updatedType = fieldType === "timestamp" ? "datetime" : fieldType;

            if (selectedValue !== undefined) {
                mergedData[fieldName] = {
                    value: selectedValue,
                    type: updatedType
                };
            }
        });

        formData.set("data", JSON.stringify(mergedData));

        const reqOptions = {
            url: updateCustomFormData(dashDatasetId, dashTableId),
            method: "PUT",
            headers: {
                Authorization: `Bearer ${GetJWT()}`
            },
            data: formData
            // uuid: recId,
            // status: 'u'
        };

        api.request(reqOptions)
            .then((res) => {
                setLoadingRecordDialog((prev) => ({
                    ...prev,
                    [`${dataIndex}${index}1`]: false
                }));
                if (res) {
                    dispatch(
                        openSnackbar({
                            open: true,
                            message: "Your Form Deleted Successfully",
                            variant: "alert",
                            alert: {
                                color: "success"
                            },
                            close: false
                        })
                    );
                    handleCloseDrawer();
                    handleReload();
                }
            })
            .catch((err) => {
                console.error("Error Deleting Form:", err);
                handleCloseDrawer();
                setLoadingRecordDialog((prev) => ({
                    ...prev,
                    [`${dataIndex}${index}1`]: true
                }));
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
                <DialogContentText id="alert-dialog-description">Are you sure you want to delete this record?</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseDrawer} color="primary">
                    Cancel
                </Button>
                <Button onClick={onFormSubmit} autoFocus color="primary">
                    Delete
                </Button>
            </DialogActions>
        </>
    );
};

DeleteFeatureTableRecord.propTypes = {
    dataIndex: PropTypes.number,
    index: PropTypes.number,
    id: PropTypes.string,
    dashTableId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    dashDatasetId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    recId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    // handleUpdate: PropTypes.func,
    selectedRecord: PropTypes.array,
    handleCloseDrawer: PropTypes.func,
    handleReload: PropTypes.func
};
export default DeleteFeatureTableRecord;
