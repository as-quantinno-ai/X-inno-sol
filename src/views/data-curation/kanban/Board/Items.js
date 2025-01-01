import PropTypes from "prop-types";
import React, { useState } from "react";

// material-ui
import { useTheme } from "@mui/material/styles";
import { IconButton, Stack, Typography } from "@mui/material";

// third-party
import { Draggable } from "react-beautiful-dnd";

// project imports
import useConfig from "hooks/useConfig";
import AlertItemDelete from "./AlertItemDelete";
import { openSnackbar } from "store/slices/snackbar";
import { useDispatch } from "store";
import { deleteItem } from "store/slices/kanban";

// assets
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
// import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";

// item drag wrapper
const getDragWrapper = (isDragging, draggableStyle, theme, radius) => {
    const bgcolor = theme.palette.mode === "dark" ? theme.palette.background.paper + 90 : theme.palette.grey[50];
    return {
        userSelect: "none",
        margin: `0 0 ${8}px 0`,
        padding: 16,
        border: "1px solid",
        borderColor: theme.palette.mode === "dark" ? theme.palette.background.default : theme.palette.primary[200] + 75,
        backgroundColor: isDragging ? bgcolor : theme.palette.background.paper,
        borderRadius: radius,
        ...draggableStyle
    };
};

// ==============================|| KANBAN BOARD - ITEMS ||============================== //

const Items = ({ item, index, stage }) => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const { borderRadius } = useConfig();

    const [expanded, setExpanded] = useState(false);

    // const handlerDetails = (id) => {
    //     //    dispatch(selectItem(id));
    //     setExpanded(!expanded);
    // };
    const handlerDetails = () => {
        //    dispatch(selectItem(id));
        setExpanded(!expanded);
    };

    const [open, setOpen] = useState(false);

    const handleModalClose = async (status) => {
        setOpen(false);
        if (status) {
            await dispatch(deleteItem(item.transformerid, item.productclientdatasetsid, item.tableid));
            // await dispatch(getColumns(item.productclientdatasetsid));
            // await dispatch(getItems(item.productclientdatasetsid, item.tableid));
            dispatch(
                openSnackbar({
                    open: true,
                    message: "Task Deleted successfully",
                    anchorOrigin: { vertical: "top", horizontal: "right" },
                    variant: "alert",
                    alert: {
                        color: "success"
                    },
                    close: false
                })
            );
        }
    };

    return (
        <Draggable key={item.transformerid} draggableId={item.transformerid.toString()} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={getDragWrapper(snapshot.isDragging, provided.draggableProps.style, theme, `${borderRadius}px`)}
                >
                    <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                        {stage !== "BRONZE" ? (
                            <>
                                <IconButton size="small" onClick={() => handlerDetails(item.transformerid)}>
                                    <MoreHorizIcon fontSize="small" aria-controls="menu-simple-card" aria-haspopup="true" />
                                </IconButton>
                                <IconButton size="small" onClick={() => setOpen(true)}>
                                    <DeleteTwoToneIcon fontSize="small" aria-controls="menu-simple-card" aria-haspopup="true" />
                                </IconButton>
                            </>
                        ) : (
                            <></>
                        )}
                    </div>
                    <Stack sx={{ mb: 0 }}>
                        <div>
                            <Typography
                                onClick={() => handlerDetails(item.transformerid)}
                                variant="h6"
                                sx={{
                                    display: "inline-block",
                                    width: "100%",
                                    overflow: "hidden",
                                    verticalAlign: "middle",
                                    cursor: "pointer",
                                    textOverflow: expanded ? "unset" : "ellipsis",
                                    whiteSpace: expanded ? "normal" : "nowrap"
                                }}
                            >
                                {item.transformationquery}
                            </Typography>
                        </div>

                        {open && <AlertItemDelete title={item.transformationquery} open={open} handleClose={handleModalClose} />}
                    </Stack>
                </div>
            )}
        </Draggable>
    );
};

Items.propTypes = {
    index: PropTypes.number,
    item: PropTypes.object,
    stage: PropTypes.string
};

export default Items;
