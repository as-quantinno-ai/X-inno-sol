import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

// material-ui
import { useTheme } from "@mui/material/styles";
import { Collapse, List, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
// import { getCustomFormsByprodclidsidandTableIid, getCustomDashboard, GetAccessToken } from "views/api-configuration/default";
import { getCustomFormsByprodclidsidandTableIid } from "views/api-configuration/default";

// project imports
import NavItem from "../NavItem";
import useConfig from "hooks/useConfig";

// assets
import { IconChevronDown, IconChevronUp } from "@tabler/icons";
// import { useSelector, useDispatch } from "store";
import { useSelector } from "store";
import api from "views/api-configuration/api";

// ==============================|| SIDEBAR MENU LIST COLLAPSE ITEMS ||============================== //

const NavCollapse = ({ menu, level }) => {
    const theme = useTheme();
    const { borderRadius } = useConfig();

    // const dispatch = useDispatch();

    const { rawDataSources } = useSelector((state) => state.dataCollection);
    const { selectedDataset } = useSelector((state) => state.userLogin);
    // eslint-disable-next-line
    const [forms, setForms] = useState([]);
    // const [dashboards, setDashboards] = useState([]);
    // const [screens, setScreens] = useState([]);

    const { screens, chatbots } = useSelector((state) => state.globe);

    const loadForms = async () => {
        try {
            const formsArr = await Promise.all(
                rawDataSources.map(async (item) => {
                    const res = await api.get(getCustomFormsByprodclidsidandTableIid(item.datasetid, item.tableid));
                    return res.data.result;
                })
            );
            setForms(formsArr.flat());
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        loadForms();
    }, [selectedDataset]);

    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState(null);

    const handleClick = () => {
        setOpen(!open);
        setSelected(!open ? menu.id : null);
    };

    const { pathname } = useLocation();
    const checkOpenForParent = (child, id) => {
        child.forEach((item) => {
            if (item.url === pathname) {
                setOpen(true);
                setSelected(id);
            }
        });
    };

    // menu collapse for sub-levels
    useEffect(() => {
        const childrens = menu.children ? menu.children : [];
        childrens.forEach((item) => {
            if (item.children?.length) {
                checkOpenForParent(item.children, menu.id);
            }
            if (pathname && pathname.includes("product-details")) {
                if (item.url && item.url.includes("product-details")) {
                    setSelected(menu.id);
                    setOpen(true);
                }
            }
            if (item.url === pathname) {
                setSelected(menu.id);
                setOpen(true);
            }
        });
    }, [pathname, menu.children]);

    // menu collapse & item
    const menus = menu.children?.map((item) => {
        /* eslint-disable */
        switch (item.type) {
            case "collapse":
                return (
                    <>
                        <NavCollapse key={item.id} menu={item} level={level + 1} />
                    </>
                );
            case "item":
                return <NavItem key={item.id} item={item} level={level + 1} />;

            // case 'custom-form-items':
            //     return (
            //         <>
            //             {forms?.map((content, ind) => (
            //                 <NavItem
            //                     key={`form-nav-item-${ind}`}
            //                     item={{
            //                         id: `de-${ind}`,
            //                         title: content.formtitle,
            //                         type: 'custom-form-items',
            //                         url: `/data-entry/${content.formid}`
            //                     }}
            //                     level={level + 1}
            //                 />
            //             ))}
            //         </>
            //     );
            case "custom-dashboard-items":
                return (
                    <>
                        {screens?.map((content, ind) => (
                            <NavItem
                                key={`form-nav-item-${ind}`}
                                item={{
                                    id: `custom-dashbaord-screen-${ind}`,
                                    title: `${content.screen.screentitle}`,
                                    type: "custom-dashboard-items",
                                    // icon: icons.IconNote,
                                    url: `/show-dashboard/${content.screen.screenid}`
                                }}
                                level={level + 1}
                            />
                        ))}
                    </>
                );
            case "custom-chat-bots":
                return (
                    <>
                        {chatbots?.map((content, ind) => (
                            <NavItem
                                key={`chat-nav-item-${ind}`}
                                item={{
                                    id: `xtreme-bots-${ind}`,
                                    title: `${content.flowtitle}`,
                                    type: "custom-chat-bots",
                                    // icon: icons.IconNote,
                                    url: `/xtreme-bots/${content.flowid}`
                                }}
                                level={level + 1}
                            />
                        ))}
                    </>
                );
            default:
                return (
                    <Typography key={item.id} variant="h6" color="error" align="center">
                        Menu Items Error
                    </Typography>
                );
        }
    });
    /* eslint-enable */
    const Icon = menu.icon;
    const menuIcon = menu.icon ? (
        <Icon strokeWidth={1.5} size="15px" style={{ marginTop: "auto", marginBottom: "auto" }} />
    ) : (
        <FiberManualRecordIcon
            sx={{
                width: selected === menu.id ? 8 : 6,
                height: selected === menu.id ? 8 : 6
            }}
            fontSize={level > 0 ? "inherit" : "medium"}
        />
    );

    return (
        <>
            <ListItemButton
                sx={{
                    borderRadius: `${borderRadius}px`,
                    mb: 0.5,
                    alignItems: "flex-start",
                    backgroundColor: level > 1 ? "transparent !important" : "inherit",
                    py: level > 1 ? 1 : 1.25,
                    pl: `${level * 24}px`
                }}
                selected={selected === menu.id}
                onClick={handleClick}
            >
                <ListItemIcon sx={{ my: "auto", minWidth: !menu.icon ? 18 : 36 }}>{menuIcon}</ListItemIcon>
                <ListItemText
                    primary={
                        <Typography variant={selected === menu.id ? "h6" : "h6"} color="inherit" sx={{ my: "auto" }}>
                            {menu.title}
                        </Typography>
                    }
                    secondary={
                        menu.caption && (
                            <Typography variant="caption" sx={{ ...theme.typography.subMenuCaption }} display="block" gutterBottom>
                                {menu.caption}
                            </Typography>
                        )
                    }
                />
                {open ? (
                    <IconChevronUp stroke={1.5} size="16px" style={{ marginTop: "auto", marginBottom: "auto" }} />
                ) : (
                    <IconChevronDown stroke={1.5} size="16px" style={{ marginTop: "auto", marginBottom: "auto" }} />
                )}
            </ListItemButton>
            <Collapse in={open} timeout="auto" unmountOnExit>
                {open && (
                    <List
                        component="div"
                        disablePadding
                        sx={{
                            position: "relative",
                            "&:after": {
                                content: "''",
                                position: "absolute",
                                left: "32px",
                                top: 0,
                                height: "100%",
                                width: "1px",
                                opacity: theme.palette.mode === "dark" ? 0.2 : 1,
                                background: theme.palette.mode === "dark" ? theme.palette.dark.light : theme.palette.primary.light
                            }
                        }}
                    >
                        {menus}
                    </List>
                )}
            </Collapse>
        </>
    );
};

NavCollapse.propTypes = {
    menu: PropTypes.object,
    level: PropTypes.number
};

export default NavCollapse;
