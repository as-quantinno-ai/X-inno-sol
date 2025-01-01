import PropTypes from "prop-types";

// material-ui
import { Button, Grid, TextField, Typography } from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import React, { useState } from "react";
import SendIcon from "@mui/icons-material/Send";

// third-party
// import * as yup from "yup";
// import { useFormik } from "formik";

// project imports
// import AnimateButton from "ui-component/extended/AnimateButton";
// import { openSnackbar } from "store/slices/snackbar";
// import { useDispatch } from "store";
// import { editItem } from "store/slices/kanban";

// const avatarImage = require.context("assets/images/users", true);
// const validationSchema = yup.object({
//     title: yup.string().required("Task title is required"),
//     dueDate: yup.date()
// });

// ==============================|| KANBAN BOARD - ITEM EDIT ||============================== //

const AddTransformerText = ({
    item,
    // profiles,
    // userStory,
    // columns,
    handleDrawerOpen,
    handleChange,
    selectedMetaDataId,
    selectedMetaDataText,
    selectedAttributeName,
    sourceAttributeName
}) => {
    // const dispatch = useDispatch();
    const [description, setDescription] = useState("");
    const handleSubmit = (event) => {
        event.preventDefault();
        if (item && item.metadataid) {
            // handleChange(description, item.dsMetadataId);
            handleChange(description, item.metadataid);
            handleDrawerOpen();
        } else {
            console.error("Item or dsmetadataid is undefined");
        }
    };
    const textWithoutComma = String(selectedMetaDataText);
    const text = textWithoutComma?.startsWith(",") ? textWithoutComma?.slice(1) : "";

    const specificAttributeNames = sourceAttributeName[selectedMetaDataId] && sourceAttributeName[selectedMetaDataId].join(", ");

    return (
        <form onSubmit={handleSubmit}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sx={{ p: 2, m: 2 }}>
                        <TextField fullWidth id="title" name="title" label="Standard Metadata" value={selectedAttributeName} />
                    </Grid>
                    <Grid item xs={12} sx={{ p: 2, m: 2 }}>
                        <TextField fullWidth id="title" name="title" label="Data Source" value={specificAttributeNames} />
                    </Grid>
                    <Grid item xs={12} sx={{ p: 2, m: 2 }}>
                        <Grid item xs={12} sm={4}>
                            <Typography variant="subtitle1">Add Query:</Typography>
                        </Grid>
                        <Grid item xs={12} sm={8}>
                            <Grid container justifyContent="flex-start">
                                <TextField
                                    fullWidth
                                    id="description"
                                    defaultValue={text}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item xs={11}>
                        <Button fullWidth variant="contained" type="submit" endIcon={<SendIcon />} style={{ margin: "10px" }}>
                            Save
                        </Button>
                    </Grid>
                </Grid>
            </LocalizationProvider>
        </form>
    );
};

AddTransformerText.propTypes = {
    item: PropTypes.object,
    profiles: PropTypes.array,
    userStory: PropTypes.array,
    columns: PropTypes.array,
    handleDrawerOpen: PropTypes.func,
    handleChange: PropTypes.func,
    selectedMetaDataId: PropTypes.number,
    selectedMetaDataText: PropTypes.string,
    selectedAttributeName: PropTypes.string,
    sourceAttributeName: PropTypes.object
};

export default AddTransformerText;
