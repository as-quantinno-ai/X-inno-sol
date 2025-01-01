// material-ui
// import { useTheme } from "@mui/material/styles";
import { Paper, Typography, Chip } from "@mui/material";
import { useSelector } from "store";

import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot } from "@mui/lab";
import { getMetaDataVersionTracking } from "views/api-configuration/default";
import React, { useState, useEffect } from "react";

// assets

import api from "views/api-configuration/api";

// ==============================|| UI TIMELINE - CUSTOMIZED ||============================== //

export default function MetaDataHistory() {
    // const theme = useTheme();
    // const paper = {
    //     p: 2.5,
    //     boxShadow: "none",
    //     background: theme.palette.mode === "dark" ? theme.palette.dark.main : theme.palette.primary.light,
    //     border: "1px dashed",
    //     borderColor: theme.palette.mode === "dark" ? theme.palette.dark.dark : theme.palette.primary.dark
    // };
    // const { configData, schemaFields } = useSelector((state) => state.datasourceconfiguration);
    const { configData } = useSelector((state) => state.datasourceconfiguration);

    const [metaHistory, setMetaHistory] = useState(null);

    useEffect(() => {
        api.get(`${getMetaDataVersionTracking(configData.datasourceid, configData.productclientdatasetsid, configData.tableid)}`)
            .then((res) => {
                setMetaHistory(res?.data?.result);
            })
            .catch((err) => console.log(err));
    }, []);

    return (
        <Timeline position="alternate">
            {metaHistory &&
                Object?.entries(metaHistory)
                    .reverse()
                    .map(([key, value], index) => (
                        <TimelineItem key={`${key}-${index}`}>
                            <TimelineSeparator>
                                <TimelineDot
                                    style={{
                                        borderRadius: "8px",
                                        margin: "5px"
                                    }}
                                    key={key}
                                    color="secondary"
                                >
                                    <Typography component="span" fontWeight={700}>
                                        {key}
                                    </Typography>
                                </TimelineDot>
                                <TimelineConnector />
                            </TimelineSeparator>

                            <TimelineContent>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        display: "flex",
                                        flexWrap: "wrap",
                                        alignItems: "flex-start",
                                        border: "1px solid #607d8b69"
                                    }}
                                >
                                    <div>
                                        {value.complete.map((attribute, idx) => (
                                            <Chip
                                                key={`complete-${index}-${idx}`}
                                                label={`${attribute.attributeName} | ${attribute.attributeType}`}
                                                variant="contained"
                                                color="primary"
                                                sx={{
                                                    color: "white",
                                                    borderColor: "grey"
                                                }}
                                                style={{ margin: "4px", marginRight: "2px", borderRadius: "5px" }}
                                            />
                                        ))}

                                        {value.added.map((attribute, idx) => (
                                            <Chip
                                                key={`added-${index}-${idx}`}
                                                label={`${attribute.attributeName} | ${attribute.attributeType}`}
                                                variant="contained"
                                                color="success"
                                                sx={{
                                                    color: "white",
                                                    borderColor: "grey"
                                                }}
                                                style={{ margin: "4px", marginRight: "2px", borderRadius: "5px" }}
                                            />
                                        ))}
                                        {value.deleted.map((attribute, idx) => (
                                            <Chip
                                                key={`deleted-${index}-${idx}`}
                                                label={`${attribute.attributeName} | ${attribute.attributeType}`}
                                                variant="contained"
                                                color="error"
                                                sx={{
                                                    color: "white",
                                                    borderColor: "grey"
                                                }}
                                                style={{ margin: "4px", marginRight: "2px", borderRadius: "5px" }}
                                            />
                                        ))}
                                    </div>
                                </Paper>
                            </TimelineContent>
                        </TimelineItem>
                    ))}
        </Timeline>
    );
}
