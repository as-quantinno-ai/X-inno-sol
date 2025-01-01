import React, { useState } from "react";
import { dispatch } from "store";
import { useNavigate } from "react-router-dom";
import { Drawer, IconButton, Tooltip, Dialog, Grid } from "@mui/material";
import IconResolver from "./IconResolver";
import { openSnackbar } from "store/slices/snackbar";
import CircularProgress from "@mui/material/CircularProgress";
import ButtonDetailsDrawer from "./ButtonDetailsDrawer";
import api from "views/api-configuration/api";
import EditFeatureTableRecord from "../EditFeatureTableRecord";
import DeleteFeatureTableRecord from "./DeleteFeatureTableRecord";
import { getCustomFormsByFormId, retrieveCustomFormRecord } from "views/api-configuration/default";
import DataEntry from "views/form-builder/UpdatedDataEntry";
import FormHeader from "../formHeader";
import { gridSpacing } from "store/constant";
import PerfectScrollbar from "react-perfect-scrollbar";
import PropTypes from "prop-types";

const ButtonEvent = ({ dataIndex, index, productclientdatasetsid, tableid, recid, event, dashboard, handleReload }) => {
    const [loadingEvent, setLoadingEvent] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [buttonLoadingStates, setButtonLoadingStates] = useState({});
    const [showTooltip, setShowTooltip] = useState(false);
    const navigate = useNavigate();
    const [editFormVisible, setEditFormVisible] = useState(false);
    const [editFormProps, setEditFormProps] = useState({});
    const [selectedRecord, setSelectedRecord] = useState(null);

    // eslint-disable-next-line no-unused-vars
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const navigateToScreens = (screenid) => navigate(`/show-dashboard/${screenid}`, { replace: true });
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [openAddForm, setOpenAddForm] = useState(false);

    const handleLoadingState = () => {
        setButtonLoadingStates((prev) => ({
            ...prev,
            [`${dataIndex}${index}`]: false
        }));
    };
    const handleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    };

    const fetchData = async () => {
        const apiUrl = retrieveCustomFormRecord();
        setLoading(true);

        try {
            // const response = await api.get(getCustomFormsByFormId(event.event.referenceId));
            const response = await api.get(getCustomFormsByFormId(event.referenceId));
            const viewName = response?.data?.result?.viewname;

            if (viewName) {
                const RequestBody = {
                    productclientdatasetsid,
                    uuid: recid.toString(),
                    viewname: viewName
                };

                const recordResponse = await api.post(apiUrl, RequestBody);
                const responseData = recordResponse?.data?.data;
                const parsedData = JSON.parse(responseData);
                setLoadingEvent(false);
                setButtonLoadingStates((prev) => ({
                    ...prev,
                    [`${dataIndex}${index}`]: false
                }));
                setSelectedRecord(parsedData);
                setOpen(true);
                setOpenDeleteDialog(true);
            }
        } catch (error) {
            console.error("Error fetching data:", error.message);

            dispatch(
                openSnackbar({
                    open: true,
                    message: "Failed to load data, please try again later",
                    variant: "alert",
                    alert: {
                        color: "error"
                    },
                    close: false
                })
            );
        } finally {
            setLoading(false);
        }
    };

    function eventTrigger(dataIndex, index, productclientdatasetsid, tableid, recid, event) {
        setLoadingEvent(true);

        // alert(recid);

        const EventObj = {
            productclientdatasetsid,
            tableid,
            recid
        };
        /*eslint-disable*/
        switch (event.eventType) {
            case "SHOW DETAILS":
                setDrawerOpen(true);
                setLoadingEvent(false);
                setShowTooltip(false);
                break;
            case "REDIRECT TO DASHBOARD":
                setShowTooltip(false);

                api.post(`${event.eventApi}`, EventObj)
                    .then((res) => {
                        dispatch(
                            openSnackbar({
                                open: true,
                                message: `${res.data.message}`,
                                variant: "alert",
                                alert: {
                                    color: "success"
                                },
                                close: false
                            })
                        );
                        setButtonLoadingStates((prev) => ({
                            ...prev,
                            [`${dataIndex}${index}`]: false
                        }));
                        navigateToScreens(event.referenceId);
                        setLoadingEvent(false);
                    })
                    .catch((err) => {
                        dispatch(
                            openSnackbar({
                                open: true,
                                message: `${err}`,
                                variant: "alert",
                                alert: {
                                    color: "error"
                                },
                                close: false
                            })
                        );
                        setShowTooltip(false);
                        setButtonLoadingStates((prev) => ({
                            ...prev,
                            [`${dataIndex}${index}`]: false
                        }));
                        setLoadingEvent(false);
                    });
                break;
            case "EXECUTE API - SHOW DETAILS":
                api.post(`${event.eventApi}`, EventObj)
                    .then((res) => {
                        setButtonLoadingStates((prev) => ({
                            ...prev,
                            [`${dataIndex}${index}`]: false
                        }));
                        setDrawerOpen(true);
                        setShowTooltip(false);
                        setLoadingEvent(false);
                    })
                    .catch(
                        (err) =>
                            setButtonLoadingStates((prev) => ({
                                ...prev,
                                [`${dataIndex}${index}`]: false
                            })),
                        setLoadingEvent(false)
                    );
                break;
            case "EDIT":
                setEditFormProps({
                    id: event.recid,
                    dashDatasetId: productclientdatasetsid,
                    dashTableId: tableid,
                    recId: recid
                });
                setEditFormVisible(true);
                setButtonLoadingStates((prev) => ({
                    ...prev,
                    [`${dataIndex}${index}`]: false
                }));
                setShowTooltip(false);
                setOpen(true);
                setLoadingEvent(false);
                break;

            case "DELETE":
                setShowTooltip(false);

                fetchData();
                setLoadingEvent(false);

                break;
            case "ADD":
                setOpenAddForm(true);
                setButtonLoadingStates((prev) => ({
                    ...prev,
                    [`${dataIndex}${index}`]: false
                }));
                setShowTooltip(false);
                break;
            default:
                break;
        }
    }
    let buttonStyle = {};
    try {
        buttonStyle = JSON.parse(event?.button?.buttonStyle);
    } catch (error) {
        console.error("Error parsing button style:", error);
    }

    const icon = buttonStyle.icon;
    const handleMouseEnter = () => setShowTooltip(true);
    const handleMouseLeave = () => setShowTooltip(false);
    const handleToggle = () => {
        setOpen(!open);
        setOpenDeleteDialog(false);
        setOpenAddForm(false);
    };

    return (
        <>
            <Tooltip
                key={`${dataIndex}${index}`}
                placement="top"
                title={event?.button?.buttonName}
                open={showTooltip}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <IconButton
                    key={`${dataIndex}${index}`}
                    type="button"
                    variant="text"
                    sx={{
                        minWidth: buttonLoadingStates[`${dataIndex}${index}`] ? "20px" : "20px",
                        width: buttonLoadingStates[`${dataIndex}${index}`] ? "auto" : "auto",
                        height: 32,
                        p: 0.2,
                        marginLeft: 0.2,
                        color: event?.button?.buttonType === "TABLE" ? "grey" : "secondary"
                    }}
                    color={loadingEvent ? "error" : "secondary"}
                    disabled={buttonLoadingStates[`${dataIndex}${index}`]}
                    onClick={() => {
                        setButtonLoadingStates((prev) => ({
                            ...prev,
                            [`${dataIndex}${index}`]: true
                        }));

                        eventTrigger(dataIndex, index, productclientdatasetsid, tableid, recid, event.event);
                    }}
                >
                    {buttonLoadingStates[`${dataIndex}${index}`] ? (
                        <CircularProgress color="primary" size={18} />
                    ) : (
                        <IconResolver iconName={icon} fontSize="medium" />
                    )}
                </IconButton>
            </Tooltip>

            {drawerOpen && (
                <ButtonDetailsDrawer
                    handleLoadingState={handleLoadingState}
                    handleDrawer={handleDrawer}
                    productclientdatasetsid={productclientdatasetsid}
                    tableid={tableid}
                    recid={recid}
                    referenceid={event.event.referenceId}
                    isopen={drawerOpen}
                    dashboard={dashboard}
                />
            )}
            {editFormVisible && (
                <Drawer
                    anchor="right"
                    onClose={handleToggle}
                    open={open}
                    PaperProps={{
                        sx: {
                            width: 700
                        }
                    }}
                >
                    {open && (
                        <EditFeatureTableRecord
                            id={event.event.referenceId}
                            dashDatasetId={editFormProps.dashDatasetId}
                            dashTableId={editFormProps.dashTableId}
                            recId={editFormProps.recId}
                            handleCloseDrawer={handleToggle}
                            handleReload={handleReload}
                        />
                    )}
                </Drawer>
            )}

            {openDeleteDialog && (
                <Dialog
                    open={openDeleteDialog}
                    onClose={handleToggle}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DeleteFeatureTableRecord
                        dataIndex={dataIndex}
                        index={index}
                        id={event.event.referenceId}
                        dashDatasetId={productclientdatasetsid}
                        dashTableId={tableid}
                        recId={recid}
                        selectedRecord={selectedRecord}
                        handleReload={handleReload}
                        handleCloseDrawer={handleToggle}
                    />
                </Dialog>
            )}
            {openAddForm && (
                <Drawer
                    anchor="right"
                    onClose={handleToggle}
                    open={openAddForm}
                    PaperProps={{
                        sx: {
                            width: 700
                        }
                    }}
                >
                    <PerfectScrollbar component="div">
                        <Grid container spacing={gridSpacing} sx={{ p: 3 }}>
                            <Grid item xs={12}>
                                <FormHeader onCancel={handleToggle} />
                                <DataEntry
                                    key={event.event.eventId}
                                    formId={event.event.referenceId}
                                    handleCloseDrawer={handleToggle}
                                    reload={handleReload}
                                />{" "}
                            </Grid>
                        </Grid>
                    </PerfectScrollbar>
                </Drawer>
            )}
        </>
    );
};

/*eslint-enable*/
ButtonEvent.propTypes = {
    dataIndex: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    index: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    productclientdatasetsid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    tableid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    recid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    event: PropTypes.object,
    dashboard: PropTypes.string,
    handleReload: PropTypes.func
};
export default ButtonEvent;
