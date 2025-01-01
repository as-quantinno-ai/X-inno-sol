import React, { useState } from "react";
import MainCard from "./cards/MainCard";
import { gridSpacing } from "store/constant";
import PropTypes from "prop-types";
import { Grid, Typography, Checkbox, ListItemText, ListItemButton } from "@mui/material";

import { useDispatch } from "store";
import { openSnackbar } from "store/slices/snackbar";
import { useTheme } from "@mui/material/styles";

// API Config
import { GetJWT, metadataList, metadataUniqueConstraintsApi } from "views/api-configuration/default";

import { useFetch } from "react-async";
import api from "views/api-configuration/api";

const UniqueContraintsForm = ({ datasetid, tableid, tablename }) => {
    const theme = useTheme();

    const dispatch = useDispatch();
    const [checkedItems, setCheckedItems] = useState({});

    const updateUniqueConstraints = (datasetid, tableid, attid, value) => {
        api.put(
            metadataUniqueConstraintsApi(datasetid, tableid, attid, value),
            {},
            {
                headers: {
                    Authorization: `Bearer ${GetJWT()}`
                }
            }
        )
            .then(() => {
                setCheckedItems((prevState) => ({
                    ...prevState,
                    [attid]: value
                }));

                dispatch(
                    openSnackbar({
                        open: true,
                        message: "Unique Constraint Updated Successfully",
                        variant: "alert",
                        alert: {
                            color: "success"
                        },
                        close: false
                    })
                );
            })
            .catch((err) => {
                console.log("Error: " + err);
                dispatch(
                    openSnackbar({
                        open: true,
                        message: "Error Creating Unique Constraint Record",
                        variant: "alert",
                        alert: {
                            color: "error"
                        },
                        close: false
                    })
                );
            });
    };
    const { data, error } = useFetch(`${metadataList}/${datasetid}/${tableid}`, {
        headers: { accept: "application/json", Authorization: `Bearer ${GetJWT()}` }
    });
    if (error) return error.message;
    if (data)
        return (
            <MainCard
                content={false}
                title={
                    <Grid container justifyContent="space-between" spacing={gridSpacing}>
                        <Grid item>
                            <Typography variant="h3" component="div" align="center" sx={{ color: theme.palette.primary.dark }}>
                                Add Unique Constraints ({tablename.replace(/_/g, " ")})
                            </Typography>
                        </Grid>
                    </Grid>
                }
                style={{ width: "100%", height: "fit-content" }}
            >
                <Grid container spacing={0}>
                    {data.result?.map((item, indx) => (
                        <Grid key={indx} item lg={12} md={12}>
                            <ListItemButton component="a" href="#simple-list">
                                <ListItemText primary={item.attributeName} secondary={item.attributeType} />
                                <Checkbox
                                    checked={checkedItems[item.attributeId] || item.uniqueIdentifier}
                                    sx={{ "& .MuiSvgIcon-root": { fontSize: 28 } }}
                                    onChange={(e) =>
                                        updateUniqueConstraints(
                                            item.productclientdatasetsid,
                                            item.tableId,
                                            item.attributeId,
                                            e.target.checked
                                        )
                                    }
                                />
                            </ListItemButton>
                        </Grid>
                    ))}
                </Grid>
            </MainCard>
        );
    return null;
};

UniqueContraintsForm.propTypes = {
    datasetid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    tableid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    tablename: PropTypes.string
};

export default UniqueContraintsForm;
