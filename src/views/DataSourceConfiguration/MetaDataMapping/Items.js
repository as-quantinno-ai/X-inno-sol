import PropTypes from "prop-types";
import React, { useState } from "react";
import { useDrag, useDrop } from "react-dnd";

// material-ui
import { useTheme } from "@mui/material/styles";
import { ButtonBase, Grid, IconButton, Menu, MenuItem, Stack, Tooltip, Typography, Drawer, Box } from "@mui/material";
import MoreVertTwoToneIcon from "@mui/icons-material/MoreVertTwoTone";
import MenuBookTwoToneIcon from "@mui/icons-material/MenuBookTwoTone";
import MainCard from "../../new-app/components/basic/cards/MainCard";

import PerfectScrollbar from "react-perfect-scrollbar";

// project imports
import useConfig from "hooks/useConfig";
import AddTransformerText from "./AddTransformerText";
import { gridSpacing } from "store/constant";

const Items = ({
    attributeName,
    show,
    item,
    // index,
    selectedMetaDataId,
    onClick,
    mappings,
    onTransformationChange,
    transformationTexts,
    selectedAttributeName,
    sourceAttributeName,
    addItem
}) => {
    const theme = useTheme();
    const { borderRadius } = useConfig();

    const [anchorEl, setAnchorEl] = useState(null);

    // const handlerDetails = (id) => {
    const handlerDetails = () => {
        // dispatch(selectItem(id));
    };

    const currentAttributeId = item.metadataid || item.dsMetadataId;
    const [hovered, setHovered] = useState(false);

    const handleMouseEnter = () => {
        setHovered(true);
    };

    const handleMouseLeave = () => {
        setHovered(false);
    };

    const [{ isDragging }, drag] = useDrag(() => ({
        type: "ITEM",
        item: { id: currentAttributeId, attributeName: item.attributeName },
        collect: (monitor) => ({
            isDragging: monitor.isDragging()
        })
    }));

    const [{ isOver }, drop] = useDrop(() => ({
        accept: "ITEM",
        drop: (draggedItem) => {
            addItem(draggedItem.id, currentAttributeId);
            onClick(currentAttributeId);
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop()
        })
    }));

    // eslint-disable-next-line no-unused-vars
    const [itemText, setItemText] = useState(null);

    const handleChange = (e, index) => {
        const text = e;
        setItemText(e);
        onTransformationChange(text, index);
    };

    const handleClick = (event) => {
        setAnchorEl(event?.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const [open, setOpen] = useState(false);

    const handleDrawerOpen = () => {
        setOpen((prevState) => !prevState);
    };

    return (
        <>
            <div
                ref={(node) => drag(drop(node))}
                style={{
                    userSelect: "none",
                    margin: "0 0 4px 0",
                    padding: 4,
                    border: "1px solid",
                    borderColor: theme.palette.mode === "dark" ? theme.palette.background.default : theme.palette.primary[200] + 75,
                    backgroundColor: isOver ? "lightgreen" : theme.palette.background.paper,
                    borderRadius: `${borderRadius}px`,
                    opacity: isDragging ? 0.5 : 1
                }}
                aria-hidden="true"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography
                        variant="subtitle1"
                        onClick={() => {
                            onClick(currentAttributeId, item.attributename);
                        }}
                        sx={{
                            display: "inline-block",
                            width: "calc(100% - 34px)",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            verticalAlign: "middle",
                            cursor: "pointer"
                        }}
                    >
                        {item.attributeName} <span style={{ color: "grey" }}>({item.attributeType})</span>
                    </Typography>
                    {show && mappings[selectedMetaDataId] && (
                        <Tooltip placement="top" title="Define Mapping">
                            <ButtonBase onClick={handleClick} aria-controls="menu-comment" aria-haspopup="true">
                                <IconButton component="span" size="small" disableRipple>
                                    <MoreVertTwoToneIcon fontSize="inherit" />
                                </IconButton>
                            </ButtonBase>
                        </Tooltip>
                    )}

                    <Menu
                        id="menu-comment"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                        variant="selectedMenu"
                        anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "right"
                        }}
                        transformOrigin={{
                            vertical: "top",
                            horizontal: "right"
                        }}
                    >
                        <MenuItem
                            onClick={() => {
                                handleClose();
                                handlerDetails(item.id);
                                handleDrawerOpen();
                            }}
                        >
                            Add Query
                        </MenuItem>
                    </Menu>
                </Stack>
                {show && hovered && transformationTexts[currentAttributeId] ? (
                    <Stack direction="row" spacing={0.5} alignItems="center">
                        <>
                            <Tooltip title="User Story">
                                <MenuBookTwoToneIcon color="secondary" sx={{ fontSize: "0.875rem" }} />
                            </Tooltip>
                            <Tooltip title={transformationTexts[currentAttributeId]?.[1]}>
                                <Typography
                                    variant="caption"
                                    color="secondary"
                                    sx={{
                                        cursor: "pointer",
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        maxWidth: "100%"
                                    }}
                                >
                                    {transformationTexts[currentAttributeId]?.[1] || "No Transformation"}
                                </Typography>
                            </Tooltip>
                        </>
                    </Stack>
                ) : null}
            </div>
            {/* </ArcherElement> */}
            {open && (
                <Drawer
                    sx={{
                        ml: open ? 3 : 0,
                        flexShrink: 0,
                        zIndex: 1200,
                        overflowX: "hidden",
                        width: { xs: 320, md: 450 },
                        "& .MuiDrawer-paper": {
                            height: "100vh",
                            width: { xs: 320, md: 450 },
                            position: "fixed",
                            border: "none",
                            borderRadius: "0px"
                        }
                    }}
                    variant="temporary"
                    anchor="right"
                    open={open}
                    ModalProps={{ keepMounted: true }}
                    onClose={handleDrawerOpen}
                >
                    {open && (
                        <>
                            {item && (
                                <>
                                    <Grid container spacing={0} alignItems="right">
                                        <MainCard
                                            content={false}
                                            title={
                                                <Grid container justifyContent="space-between" spacing={gridSpacing}>
                                                    <Grid item>
                                                        <Typography
                                                            variant="h3"
                                                            component="div"
                                                            align="center"
                                                            sx={{ color: theme.palette.primary.dark }}
                                                        >
                                                            Add Transformation Query
                                                        </Typography>
                                                    </Grid>
                                                </Grid>
                                            }
                                            style={{ width: "100%", height: "fit-content" }}
                                        >
                                            <PerfectScrollbar component="div">
                                                <Box sx={{ p: 3 }}>
                                                    <Grid container spacing={2}>
                                                        <Grid item xs={12}>
                                                            <AddTransformerText
                                                                sourceAttributeName={sourceAttributeName}
                                                                selectedAttributeName={selectedAttributeName}
                                                                attributeName={attributeName}
                                                                item={item}
                                                                handleDrawerOpen={handleDrawerOpen}
                                                                handleChange={handleChange}
                                                                mappings={mappings}
                                                                currentAttributeId={currentAttributeId}
                                                                selectedMetaDataId={selectedMetaDataId}
                                                                selectedMetaDataText={transformationTexts[selectedMetaDataId]}
                                                            />
                                                        </Grid>
                                                    </Grid>
                                                </Box>
                                            </PerfectScrollbar>
                                        </MainCard>
                                    </Grid>
                                </>
                            )}
                            {!item.attributeName && (
                                <Stack justifyContent="center" alignItems="center" sx={{ height: "100vh" }}>
                                    <Typography variant="h5" color="error">
                                        No item found
                                    </Typography>
                                </Stack>
                            )}
                        </>
                    )}
                </Drawer>
            )}
        </>
    );
};

Items.propTypes = {
    attributeName: PropTypes.string,
    sourceAttributeName: PropTypes.string,
    selectedAttributeName: PropTypes.string,
    item: PropTypes.object,
    mappings: PropTypes.object,
    transformationTexts: PropTypes.object,
    show: PropTypes.bool,
    index: PropTypes.number,
    currentAttributeId: PropTypes.string,
    selectedMetaDataId: PropTypes.string,
    onClick: PropTypes.func,
    onTransformationChange: PropTypes.func,
    addItem: PropTypes.func
};

export default Items;
