import PropTypes from "prop-types";
import React, { useState } from "react";

// material-ui
import { Button, Grid, IconButton, TextField, Stack } from "@mui/material";

// third-party
// project imports
import SubCard from "ui-component/cards/SubCard";
import { useDispatch, useSelector } from "store";
import { addItem } from "store/slices/kanban";

// assets
import CalendarTodayTwoToneIcon from "@mui/icons-material/CalendarTodayTwoTone";
import PeopleAltTwoToneIcon from "@mui/icons-material/PeopleAltTwoTone";
import CloseIcon from "@mui/icons-material/Close";

// ==============================|| KANBAN BOARD - ADD ITEM ||============================== //

// const AddItem = ({ columnId, selectedValue }) => {
const AddItem = ({ columnId, selectedValue }) => {
    const dispatch = useDispatch();
    const [addTaskBox, setAddTaskBox] = useState(false);
    const datasetid = Number(selectedValue?.slice(0, selectedValue?.toString().search("-")));
    const tableid = Number(selectedValue?.slice(selectedValue?.toString().search("-") + 1, selectedValue.length));
    const { items } = useSelector((state) => state.kanban);
    const handleAddTaskChange = () => {
        setAddTaskBox((prev) => !prev);
    };
    const { getconfigData } = useSelector((state) => state.datasourceconfiguration);
    const [title, setTitle] = useState("");
    const [isTitle, setIsTitle] = useState(false);

    const addTask = () => {
        if (title.length > 0) {
            const order = items.length + 1;
            dispatch(addItem(getconfigData.datasourceid, columnId.datapipelinelayerid, order, datasetid, tableid, title));
            // dispatch(getItem(columnId, columns, newItem, items, '0', userStory));
            // dispatch(getColumns(datasetid));

            handleAddTaskChange();
            setTitle("");
        } else {
            setIsTitle(true);
        }
    };

    const handleAddTask = (event) => {
        if (event.key === "Enter" || event.keyCode === 13) {
            addTask();
        }
    };

    const handleTaskTitle = (event) => {
        const newTitle = event.target.value;
        setTitle(newTitle);
        if (newTitle.length <= 0) {
            setIsTitle(true);
        } else {
            setIsTitle(false);
        }
    };

    return (
        <Grid container alignItems="center" spacing={1} sx={{ marginTop: 1 }}>
            {addTaskBox && selectedValue && (
                <Grid item xs={12}>
                    <SubCard contentSX={{ p: 2, transition: "background-color 0.25s ease-out" }}>
                        <Grid container alignItems="center" spacing={0.5}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    placeholder="Add Transformer"
                                    value={title}
                                    onChange={handleTaskTitle}
                                    sx={{
                                        mb: 2,
                                        "& input": { bgcolor: "transparent", p: 0, borderRadius: "0px" },
                                        "& fieldset": { display: "none" },
                                        "& .MuiFormHelperText-root": {
                                            ml: 0
                                        },
                                        "& .MuiOutlinedInput-root": {
                                            bgcolor: "transparent"
                                        }
                                    }}
                                    onKeyUp={handleAddTask}
                                    helperText={isTitle ? "Task title is required." : ""}
                                    error={isTitle}
                                />
                            </Grid>
                            <Grid item>
                                <Button variant="text" size="small" color="primary" sx={{ p: 0.5, minWidth: 32 }}>
                                    <PeopleAltTwoToneIcon fontSize="small" />
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button variant="text" size="small" color="primary" sx={{ p: 0.5, minWidth: 32 }}>
                                    <CalendarTodayTwoToneIcon fontSize="small" />
                                </Button>
                            </Grid>
                            <Grid item xs zeroMinWidth />
                            <Grid item>
                                <Stack direction="row" alignItems="center" spacing={0.5}>
                                    <IconButton size="small" color="error" onClick={handleAddTaskChange}>
                                        <CloseIcon fontSize="small" />
                                    </IconButton>
                                    <Button variant="contained" color="primary" onClick={addTask} size="small">
                                        Add
                                    </Button>
                                </Stack>
                            </Grid>
                        </Grid>
                    </SubCard>
                </Grid>
            )}
            {!addTaskBox && (
                <Grid item xs={12}>
                    <Button variant="text" color="primary" sx={{ width: "100%" }} onClick={handleAddTaskChange}>
                        Add Transformer
                    </Button>
                </Grid>
            )}
        </Grid>
    );
};

AddItem.propTypes = {
    columnId: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object]),
    selectedValue: PropTypes.string
};

export default AddItem;
