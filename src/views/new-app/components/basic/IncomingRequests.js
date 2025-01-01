import React from "react";
import { Divider, List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import PropTypes from "prop-types";
// third party
import PerfectScrollbar from "react-perfect-scrollbar";

// assets
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

// =========================|| DATA WIDGET - INCOMING REQUESTS CARD ||========================= //

function setJobStatusColor(status) {
    let color = "error.main";
    if (status === "FINISHED") {
        color = "success.main";
    } else if (status === "SUBMITTED") {
        color = "warning.main";
    }
    return color;
}

const IncomingRequests = ({ data }) => (
    <PerfectScrollbar style={{ height: 290 }}>
        <List component="nav" aria-label="main mailbox folders">
            {data ? (
                data.map((job, indx) => (
                    <>
                        <ListItemButton key={indx}>
                            <ListItemIcon>
                                <FiberManualRecordIcon
                                    sx={{
                                        color: setJobStatusColor(job.status)
                                    }}
                                />
                            </ListItemIcon>
                            <ListItemText primary={job.job_type_name} />
                        </ListItemButton>
                        <Divider />
                    </>
                ))
            ) : (
                <></>
            )}
            {/* <ListItemButton>
                <ListItemIcon>
                    <FiberManualRecordIcon sx={{ color: 'error.main' }} />
                </ListItemIcon>
                <ListItemText primary="You have 2 pending requests.." />
            </ListItemButton>
            <Divider />
            <ListItemButton>
                <ListItemIcon>
                    <FiberManualRecordIcon sx={{ color: 'warning.main' }} />
                </ListItemIcon>
                <ListItemText primary="You have 3 pending tasks" />
            </ListItemButton>
            <Divider />
            <ListItemButton>
                <ListItemIcon>
                    <FiberManualRecordIcon sx={{ color: 'primary.main' }} />
                </ListItemIcon>
                <ListItemText primary="New order received" />
            </ListItemButton>
            <Divider />
            <ListItemButton>
                <ListItemIcon>
                    <FiberManualRecordIcon sx={{ color: 'success.main' }} />
                </ListItemIcon>
                <ListItemText primary="Incoming requests" />
            </ListItemButton>
            <Divider />
            <ListItemButton>
                <ListItemIcon>
                    <FiberManualRecordIcon sx={{ color: 'error.main' }} />
                </ListItemIcon>
                <ListItemText primary="You have 2 pending requests.." />
            </ListItemButton>
            <Divider />
            <ListItemButton>
                <ListItemIcon>
                    <FiberManualRecordIcon sx={{ color: 'warning.main' }} />
                </ListItemIcon>
                <ListItemText primary="You have 3 pending tasks" />
            </ListItemButton>
            <Divider />
            <ListItemButton>
                <ListItemIcon>
                    <FiberManualRecordIcon sx={{ color: 'primary.main' }} />
                </ListItemIcon>
                <ListItemText primary="New order received" />
            </ListItemButton> */}
        </List>
    </PerfectScrollbar>
);

IncomingRequests.propTypes = {
    data: PropTypes.arrayOf(PropTypes.object)
};

export default IncomingRequests;
