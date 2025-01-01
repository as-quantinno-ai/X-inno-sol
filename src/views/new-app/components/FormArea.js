import React, { useState } from "react";
import PropTypes from "prop-types";
// material-ui
import { useTheme } from "@mui/material/styles";
import { Drawer, Grid, IconButton, Tooltip, Button } from "@mui/material";

// third-party

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

// material-ui
// third-party
import PerfectScrollbar from "react-perfect-scrollbar";

import EditIcon from "@mui/icons-material/Edit";
import { gridSpacing } from "store/constant";
import FilterListIcon from "@mui/icons-material/FilterList";
import FormHeader from "./formHeader";
import IconResolver from "./basic/IconResolver";

// ==============================|| LIVE CUSTOMIZATION ||============================== //

const FormArea = ({ form, btnTitle, icon, reloadTable, actionType }) => {
    const theme = useTheme();
    const [open, setOpen] = useState(false);
    // drawer on/off

    const handleToggle = () => {
        setOpen(!open);
    };

    /*eslint-disable*/
    const formWithDrawerControl = React.isValidElement(form)
        ? React.cloneElement(form, {
              handleCloseDrawer: handleToggle,
              reloads: reloadTable
          })
        : null;
    /*eslint-enable*/
    const getIconName = (actionType) => {
        if (typeof actionType === "string") {
            return actionType || "AddCircleOutline";
        }

        if (typeof actionType?.buttonStyle === "string") {
            try {
                const parsedButtonStyle = JSON.parse(actionType.buttonStyle);
                return parsedButtonStyle?.icon || "AddCircleOutline";
            } catch (error) {
                console.error("Error parsing buttonStyle:", error);
                return "AddCircleOutline";
            }
        }

        return actionType?.buttonStyle?.icon || "AddCircleOutline";
    };
    const iconName = getIconName(actionType);
    return (
        <>
            {icon ? (
                <>
                    <Tooltip title={btnTitle}>
                        <IconButton
                            onClick={handleToggle}
                            sx={{
                                "&:hover": {
                                    color: theme.palette.secondary.dark
                                }
                            }}
                        >
                            {actionType === "edit" && <EditIcon />}
                            {actionType !== "edit" && actionType !== "filter" && <IconResolver iconName={iconName} fontSize="small" />}
                            {actionType === "filter" && <FilterListIcon />}
                        </IconButton>
                    </Tooltip>
                </>
            ) : (
                <Button
                    variant="contained"
                    startIcon={<AddCircleOutlineIcon />}
                    size="large"
                    disableRipple
                    onClick={handleToggle}
                    color="secondary"
                    sx={{
                        zIndex: theme.zIndex.speedDial
                    }}
                    style={{ marginRight: "4px" }}
                >
                    {btnTitle}
                </Button>
            )}

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
                    <PerfectScrollbar component="div">
                        <Grid container spacing={gridSpacing} sx={{ p: 3 }}>
                            <Grid item xs={12}>
                                <FormHeader onCancel={handleToggle} />
                                {formWithDrawerControl}
                            </Grid>
                        </Grid>
                    </PerfectScrollbar>
                )}
            </Drawer>
        </>
    );
};

FormArea.propTypes = {
    form: PropTypes.node,
    btnTitle: PropTypes.string,
    icon: PropTypes.oneOfType([PropTypes.element, PropTypes.object, PropTypes.node]),
    reloadTable: PropTypes.func,
    actionType: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
};

export default FormArea;
