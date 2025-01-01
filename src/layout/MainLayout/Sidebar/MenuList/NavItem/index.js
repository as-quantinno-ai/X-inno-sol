import PropTypes from "prop-types";
import React, { forwardRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

// material-ui
import { useTheme } from "@mui/material/styles";
import { Avatar, Chip, ListItemButton, ListItemIcon, ListItemText, Typography, useMediaQuery } from "@mui/material";

// project imports
import useConfig from "hooks/useConfig";
import { useDispatch, useSelector } from "store";
import { activeItem, openDrawer } from "store/slices/menu";

// assets
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import * as MuiIcons from "@mui/icons-material";
// ==============================|| SIDEBAR MENU LIST ITEMS ||============================== //
function getIconComponent(iconName) {
    if (typeof iconName === "string") {
        return MuiIcons[iconName] || null;
    }
    return iconName;
}
const NavItem = ({ item, level }) => {
    const theme = useTheme();
    const { pathname } = useLocation();
    const { drawerOpen } = useSelector((state) => state.menu);
    const matchesSM = useMediaQuery(theme.breakpoints.down("lg"));

    const { borderRadius } = useConfig();
    const dispatch = useDispatch();
    const { selectedItem } = useSelector((state) => state.menu);

    let Icon = null;

    if (item && typeof item === "object" && Object.keys(item).length > 0) {
        Icon = getIconComponent(item.icon);
    }
    const isValidComponent = Icon && (typeof Icon === "function" || (typeof Icon === "object" && Icon.$$typeof));

    const itemIcon = isValidComponent ? (
        <Icon stroke={1.5} size="24px" />
    ) : (
        <FiberManualRecordIcon
            sx={{
                width: selectedItem.findIndex((id) => id === item?.id) > -1 ? 8 : 6,
                height: selectedItem.findIndex((id) => id === item?.id) > -1 ? 8 : 6
            }}
            fontSize={level > 0 ? "inherit" : "small"}
        />
    );

    let itemTarget = "_self";
    if (item.target) {
        itemTarget = "_blank";
    }

    // eslint-disable-next-line react/display-name
    let listItemProps = { component: forwardRef((props, ref) => <Link ref={ref} {...props} to={item.url} target={itemTarget} />) };
    if (item?.external) {
        listItemProps = { component: "a", href: item.url, target: itemTarget };
    }

    const itemHandler = (id) => {
        dispatch(activeItem([id]));
        if (matchesSM) dispatch(openDrawer(false));
    };

    useEffect(() => {
        const currentIndex = document.location.pathname
            .toString()
            .split("/")
            .findIndex((id) => id === item.id);
        if (currentIndex > -1) {
            dispatch(activeItem([item.id]));
        }
    }, [pathname]);

    return (
        <ListItemButton
            {...listItemProps}
            disabled={item.disabled}
            sx={{
                borderRadius: `${borderRadius}px`,
                mb: 0.5,
                alignItems: "flex-start",
                backgroundColor: level > 1 ? "transparent !important" : "inherit",
                py: level > 1 ? 0.5 : 0.5,
                pl: `${level * 15}px`
            }}
            selected={selectedItem?.findIndex((id) => id === item.id) > -1}
            onClick={() => itemHandler(item.id)}
        >
            <ListItemIcon
                sx={{ my: "auto", minWidth: !item?.icon ? 18 : 36, py: !drawerOpen && "20px", display: "flex", justifyContent: "center" }}
            >
                {itemIcon}
            </ListItemIcon>
            {drawerOpen && (
                <ListItemText
                    primary={
                        <Typography
                            variant={selectedItem?.findIndex((id) => id === item.id) > -1 ? "h6" : "h6"}
                            color="inherit"
                            fontWeight={100}
                        >
                            {item.title}
                        </Typography>
                    }
                    secondary={
                        item.caption && (
                            <Typography variant="h6" sx={{ ...theme.typography.subMenuCaption }} display="block" gutterBottom>
                                {item.caption}
                            </Typography>
                        )
                    }
                />
            )}
            {item.chip && (
                <Chip
                    color={item.chip.color}
                    variant={item.chip.variant}
                    size={item.chip.size}
                    label={item.chip.label}
                    avatar={item.chip.avatar && <Avatar>{item.chip.avatar}</Avatar>}
                />
            )}
        </ListItemButton>
    );
};

NavItem.propTypes = {
    item: PropTypes.object,
    level: PropTypes.number
};

export default NavItem;
