import React, { useState } from "react";
import PropTypes from "prop-types";
// material-ui
import { IconButton, Tooltip, Button, Dialog } from "@mui/material";
import axios from "axios";
import { useDispatch } from "store";

import { openSnackbar } from "store/slices/snackbar";
import { retrieveCustomFormRecord, getCustomFormsByprodclidsidandTableIid } from "views/api-configuration/default";
// third-party

import DeleteIcon from "@mui/icons-material/DeleteOutline";
import CircularProgress from "@mui/material/CircularProgress";
import api from "views/api-configuration/api";

// ==============================|| LIVE CUSTOMIZATION ||============================== //

const DialogArea = ({ form, btnTitle, icon, actionType, reloadTable, dashDatasetId, dashTableId, recId, variant }) => {
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);
    // drawer on/off

    const fetchData = async () => {
        const apiUrl = retrieveCustomFormRecord();
        setLoading(true);
        try {
            const response = await api.get(getCustomFormsByprodclidsidandTableIid(dashDatasetId, dashTableId));
            const viewName = response.data.result[0].viewname;
            const RequestBody = {
                productclientdatasetsid: dashDatasetId,
                uuid: recId.toString(),
                viewname: viewName
            };

            RequestBody.viewname = viewName;

            if (viewName) {
                const recordResponse = await axios.post(apiUrl, RequestBody);
                const responseData = recordResponse.data.data;
                const parsedData = JSON.parse(responseData);
                setSelectedRecord(parsedData);
                setOpen(true);
                setLoading(false);
            }
        } catch (error) {
            setLoading(false);

            dispatch(
                openSnackbar({
                    open: true,
                    message: "Feature not available at the moment",
                    variant: "alert",
                    alert: {
                        color: "error"
                    },
                    close: false
                })
            );

            console.error("Error fetching data:", error.message);
        }
    };

    const handleToggle = () => {
        setOpen(!open);
    };

    /*eslint-disable*/
    const formWithDrawerControl = React.isValidElement(form)
        ? React.cloneElement(form, {
              handleCloseDrawer: handleToggle,
              reloads: reloadTable,
              selectedRecord
          })
        : null;
    /*eslint-enable*/
    return (
        <>
            {icon && actionType === "deleteFeatureTableRecord" && (
                <Tooltip title={btnTitle}>
                    <IconButton onClick={fetchData}>{loading ? <CircularProgress size={20} /> : <DeleteIcon color="error" />}</IconButton>{" "}
                </Tooltip>
            )}
            {actionType !== "deleteFeatureTableRecord" &&
                (icon ? (
                    <Tooltip title={btnTitle}>
                        <IconButton onClick={handleToggle}>
                            {loading ? <CircularProgress size={20} /> : <DeleteIcon color="error" />}
                        </IconButton>
                    </Tooltip>
                ) : (
                    <Button
                        variant={variant}
                        startIcon={<DeleteIcon />}
                        size="medium"
                        disableRipple
                        onClick={handleToggle}
                        color="error"
                        style={{ marginRight: "4px" }}
                    >
                        {btnTitle}
                    </Button>
                ))}

            <Dialog open={open} onClose={handleToggle} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                {formWithDrawerControl}
            </Dialog>
        </>
    );
};

DialogArea.propTypes = {
    form: PropTypes.node,
    btnTitle: PropTypes.string,
    icon: PropTypes.oneOfType([PropTypes.element, PropTypes.any, PropTypes.node]),
    actionType: PropTypes.string,
    reloadTable: PropTypes.bool,
    // update: PropTypes.bool,
    dashDatasetId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    dashTableId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    recId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    variant: PropTypes.string
};

export default DialogArea;
