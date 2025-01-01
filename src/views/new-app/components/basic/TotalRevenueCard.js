import PropTypes from "prop-types";

// material-ui
import { Divider, List, ListItemButton, ListItemIcon, ListItemText, Stack, Typography } from "@mui/material";

// third party
import PerfectScrollbar from "react-perfect-scrollbar";

// project imports
import MainCard from "./cards/MainCard";

// assets
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import React from "react";

// ===========================|| DASHBOARD ANALYTICS - TOTAL REVENUE CARD ||=========================== //

const TotalRevenueCard = ({ title, data }) => {
    const successSX = { color: "success.dark" };
    const errorSX = { color: "error.main" };
    return (
        <MainCard title={title} content={false} sx={{ height: "540px", minHeight: "50px" }}>
            <PerfectScrollbar style={{ maxHeight: "470px" }}>
                <List
                    component="nav"
                    aria-label="main mailbox folders"
                    sx={{
                        "& svg": {
                            width: 32,
                            my: -0.75,
                            ml: -0.75,
                            mr: 0.75
                        }
                    }}
                >
                    {data.map((item) => (
                        <React.Fragment key={item.attributeId}>
                            <ListItemButton key={item.attributeId}>
                                <ListItemIcon>
                                    {item.attributeCategory === "QUALITATIVE" ? (
                                        <ArrowDropUpIcon sx={successSX} />
                                    ) : (
                                        <ArrowDropDownIcon sx={errorSX} />
                                    )}
                                </ListItemIcon>

                                <ListItemText
                                    primary={
                                        <Stack direction="row" justifyContent="evenly" alignItems="center" style={{ fontSize: "12px" }}>
                                            <Typography sx={item.attributeCategory === "QUALITATIVE" ? successSX : errorSX}>
                                                {item.attributeCategory === "QUALITATIVE" ? "QL" : "QN"}
                                            </Typography>

                                            <span style={{ marginLeft: "10px" }}>{item.attributeName}</span>
                                        </Stack>
                                    }
                                />
                            </ListItemButton>
                            <Divider />
                        </React.Fragment>
                    ))}
                </List>
            </PerfectScrollbar>
        </MainCard>
    );
};

TotalRevenueCard.propTypes = {
    title: PropTypes.string,
    data: PropTypes.array
};

export default TotalRevenueCard;