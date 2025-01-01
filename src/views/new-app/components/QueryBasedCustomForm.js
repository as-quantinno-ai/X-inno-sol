import React, { useState } from "react";
import { Typography, Select, MenuItem, FormControl, InputLabel, Grid, useTheme } from "@mui/material";
import MainCard from "ui-component/cards/MainCard";
import FormFooterButtons from "./FormButtons";
import api from "views/api-configuration/api";
import { useDispatch, useSelector } from "store";
import { putCustomFormsBindComponent } from "views/api-configuration/default";
import { gridSpacing } from "store/constant";
import { openSnackbar } from "store/slices/snackbar";
import PropTypes from "prop-types";
const QueryBasedCustomForm = ({ componentDataId, handleCloseDrawer }) => {
    const { forms } = useSelector((state) => state.globe);
    const { selectedDataset } = useSelector((state) => state.userLogin);
    const theme = useTheme();
    const dispatch = useDispatch();

    const [selectedItem, setSelectedItem] = useState("");
    // eslint-disable-next-line no-unused-vars
    const [loading, setLoading] = useState(false);

    const handleSelectChange = (event) => {
        setSelectedItem(event.target.value);
    };

    const handleSubmit = async () => {
        if (!selectedItem) {
            alert("Please select an item to submit");
            return;
        }

        setLoading(true);
        try {
            const response = await api.put(
                putCustomFormsBindComponent(componentDataId, selectedItem, selectedDataset.productclientdatasetsid)
            );
            if (response) {
                dispatch(
                    openSnackbar({
                        open: true,
                        message: "Form Connected Successfully",
                        variant: "alert",
                        alert: {
                            color: "success"
                        },
                        close: false
                    })
                );
            }
        } catch (error) {
            console.error(error);
            dispatch(
                openSnackbar({
                    open: true,
                    message: "Error Connecting Form",
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

    return (
        <div>
            <MainCard
                content={false}
                title={
                    <Grid container justifyContent="space-between" spacing={gridSpacing}>
                        <Grid item>
                            <Typography variant="h3" component="div" align="center" sx={{ color: theme.palette.primary.dark }}>
                                Connect with Form
                            </Typography>
                        </Grid>
                    </Grid>
                }
                style={{ width: "100%", height: "fit-content" }}
            >
                <Grid container spacing={2} p={4}>
                    <FormControl fullWidth sx={{ marginTop: 3 }}>
                        <InputLabel>Select Form</InputLabel>
                        <Select value={selectedItem} onChange={handleSelectChange} label="Select Item">
                            {forms.map((item, index) => (
                                <MenuItem key={index} value={item.formid}>
                                    {item.formtitle}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <FormFooterButtons onSubmit={handleSubmit} onCancel={handleCloseDrawer} />
            </MainCard>
        </div>
    );
};

QueryBasedCustomForm.propTypes = {
    componentDataId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    handleCloseDrawer: PropTypes.func
};

export default QueryBasedCustomForm;
