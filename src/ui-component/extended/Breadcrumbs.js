import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

// material-ui
import { useTheme } from "@mui/material/styles";
import { Box, Card, Divider, Grid, Typography } from "@mui/material";
import MuiBreadcrumbs from "@mui/material/Breadcrumbs";
import useMediaQuery from "@mui/material/useMediaQuery";

// project imports
import { BASE_PATH } from "config";
import { gridSpacing } from "store/constant";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";

// assets
import { IconTallymark1 } from "@tabler/icons";
// import AccountTreeTwoToneIcon from "@mui/icons-material/AccountTreeTwoTone";
import HomeIcon from "@mui/icons-material/Home";
import HomeTwoToneIcon from "@mui/icons-material/HomeTwoTone";
import { useSelector } from "store";
import { THEME_MODE } from "constants/generic";

const linkSX = {
    display: "flex",
    color: "#000",
    textDecoration: "none",
    alignContent: "center",
    alignItems: "center",
    whiteSpace: "nowwrap",
    marginRight: "5px"
};

// ==============================|| BREADCRUMBS ||============================== //

const Breadcrumbs = ({ card, divider, icon, icons, maxItems, navigation, rightAlign, separator, title, titleBottom, ...others }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const { drawerOpen } = useSelector((state) => state.menu);

    const { rawDataSources } = useSelector((state) => state.dataCollection);
    const { selectedDataset } = useSelector((state) => state.userLogin);

    const { screens } = useSelector((state) => state.globe);
    const [main, setMain] = useState();
    const [breadcrumbs, setBreadcrumbs] = useState([]);
    const [sourceId, setSourceId] = useState([]);
    const [item, setItem] = useState();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm", "md", "xs"));
    const isMiniLaptopScreen = useMediaQuery("(max-width: 1350px)");
    const isLaptopScreen = useMediaQuery("(max-width: 1500px)");
    const isTabletScreen = useMediaQuery("(max-width: 900px)");
    const iconStyle = {
        marginRight: theme.spacing(0.75),
        marginTop: `-${theme.spacing(0.25)}`,
        width: "16px",
        height: "16px",
        color: "#000"
    };
    const firstScreenId = screens?.length > 0 ? `/show-dashboard/${screens[0].screenid}` : "/data-ingestion";
    const cardWidth = isTabletScreen ? "400px" : isMiniLaptopScreen || isLaptopScreen ? "calc(100vw - 680px)" : "calc(100vw - 680px)";

    useEffect(() => {
        const storedItem = localStorage.getItem("breadcrumbItem");
        // const rawStoredItem = localStorage.getItem("breadcrumbItem");
        // const storedItem = rawStoredItem ? JSON.parse(rawStoredItem) : {};
        if (!storedItem === "undefined") {
            try {
                setItem(storedItem);
            } catch (error) {
                console.error("Error parsing stored item:", error);
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("breadcrumbItem", JSON.stringify(item));
    }, [item]);
    useEffect(() => {
        const pathnames = location?.pathname.split("/").filter((x) => x);

        const path = location?.pathname;
        const regex = /\/(\d+)\/(\d+)\/(\d+)/;
        const matches = path.match(regex);

        if (matches && pathnames?.length >= 3) {
            const firstNumber = matches[1];
            const secondNumber = matches[2];
            const thirdNumber = matches[3];
            const dataSource = rawDataSources.find(
                (item) => item?.catalogsid?.toString() === firstNumber && item?.tableid?.toString() === secondNumber
            );
            setBreadcrumbs(dataSource?.tablename);
            setSourceId(thirdNumber);
        } else {
            setBreadcrumbs(null);
        }
    }, [location]);

    const arrowStyle = {
        width: "28px",
        height: "28px",
        fontSize: "0.7rem",
        verticalAlign: "middle",
        color: "#000"
    };

    const getCollapse = (menu) => {
        if (menu.children) {
            menu.children.filter((collapse) => {
                if (collapse.type && collapse.type === "collapse") {
                    getCollapse(collapse);
                } else if (collapse.type && collapse.type === "item") {
                    if (document.location.pathname === BASE_PATH + collapse.url) {
                        setMain(menu);
                        setItem(collapse);
                    }
                } else if (collapse.type && collapse.type === "custom-dashboard-items") {
                    // const pathnames = location?.pathname.split("/").filter((x) => x);
                    const itemUrlWithSlash = `${BASE_PATH + collapse.url}`;
                    const currentUrl = `${document.location.pathname}`;
                    if (currentUrl.startsWith(itemUrlWithSlash)) {
                        setMain(menu);
                        setItem(collapse);
                    }
                } else if (collapse.type && collapse.type === "custom-form-items") {
                    const itemUrlWithSlash = `${BASE_PATH + collapse.url}`;
                    const currentUrl = `${document.location.pathname}`;

                    if (currentUrl.startsWith(itemUrlWithSlash)) {
                        setMain(menu);
                        setItem(collapse);
                    }
                }
                return false;
            });
        }
    };

    useEffect(() => {
        navigation?.items?.map((menu) => {
            if (
                (menu.type && menu.type === "group") ||
                menu.type === "custom-form-items" ||
                menu.type === "custom-dashboard-items" ||
                menu.type === "noPerms"
            ) {
                getCollapse(menu);
            }

            return false;
        });
    });

    const handleDatasetClick = () => {
        if (selectedDataset) {
            navigate("/");
        }
    };

    const handleItemTitleClick = (item) => {
        if (item !== "Dashboard" && item !== "Data Entry" && item !== "Home" && item !== "profile") {
            const urlTitle = item.replace(/\s+/g, "-");
            navigate(`/${urlTitle}`);
        }
    };
    // item separator
    // const SeparatorIcon = separator;
    const separatorIcon = separator ? <ArrowRightIcon stroke={1.5} size="16px" /> : <IconTallymark1 stroke={1.5} size="16px" />;

    // let mainContent;
    // let itemContent;
    let breadcrumbContent = <Typography />;
    // let itemTitle = "";
    // let CollapseIcon;
    // let ItemIcon;

    // collapse item
    if (main && main.type === "collapse") {
        // CollapseIcon = main.icon ? main.icon : AccountTreeTwoToneIcon;
        // mainContent = (
        //     <Typography component={Link} to="#" variant="subtitle1" sx={linkSX}>
        //         {icons && <CollapseIcon style={iconStyle} />}
        //         {main.title}
        //     </Typography>
        // );
    }

    // items
    if ((item && item.type === "item") || item?.type === "custom-form-items" || item?.type === "custom-dashboard-items") {
        // itemTitle = item.title;

        // ItemIcon = item.icon ? item.icon : AccountTreeTwoToneIcon;
        // itemContent = (
        //     <Typography
        //         variant="subtitle1"
        //         sx={{
        //             display: "flex",
        //             textDecoration: "none",
        //             alignContent: "center",
        //             alignItems: "center",
        //             color: "#000"
        //         }}
        //     >
        //         {icons && <ItemIcon style={iconStyle} />}
        //         {itemTitle}
        //     </Typography>
        // );
        if (item.breadcrumbs !== false) {
            breadcrumbContent = (
                <Card
                    sx={{
                        marginBottom: card === false ? 0 : theme.spacing(gridSpacing),
                        border: card === false ? "none" : "1px solid",
                        borderColor:
                            theme.palette.mode === THEME_MODE.DARK ? theme.palette.background.default : theme.palette.primary[200] + 75,
                        // background: card === false ? 'transparent' : theme.palette.background.default,
                        background: "#eef2f6",
                        p: isMobile ? 0 : 0.5,
                        pl: isMobile ? 0 : 0.5,
                        pr: isMobile ? 0 : 1,
                        [theme.breakpoints.down("md")]: {
                            mb: 1
                        },
                        width: "auto",
                        minWidth: "200px",
                        maxWidth: cardWidth,
                        overflowX: "auto"
                    }}
                    {...others}
                >
                    <Box sx={{ display: "flex", overflowX: "auto" }}>
                        <Grid
                            container
                            direction={rightAlign ? "row" : "column"}
                            justifyContent={rightAlign ? "space-between" : "flex-start"}
                            alignItems={rightAlign ? "center" : "flex-start"}
                            spacing={1}
                            sx={{ flexWrap: "nowrap" }}
                            className="_custom-grid"
                            color="#000"
                        >
                            {title && !titleBottom && (
                                <Grid item>
                                    <Typography
                                        variant={isMobile ? "h6" : "h5"}
                                        sx={{
                                            color: "#000",
                                            whiteSpace: "nowrap",
                                            fontWeight: 500,
                                            display: "inline-flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            fontSize: drawerOpen ? null : null,
                                            cursor: item.title !== "dashboard" && item.title !== "data entry" ? "pointer" : "auto"
                                        }}
                                    >
                                        <MuiBreadcrumbs
                                            sx={{
                                                "& .MuiBreadcrumbs-separator": { width: 16, ml: 1.25, mr: 1.25 },
                                                whiteSpace: "nowrap",
                                                color: "#000"
                                            }}
                                            aria-label="breadcrumb"
                                            maxItems={maxItems || 8}
                                            separator={separatorIcon}
                                        >
                                            <Typography component={Link} to={firstScreenId} color="#000" variant="caption" sx={linkSX}>
                                                {icons && <HomeTwoToneIcon sx={iconStyle} />}
                                                {icon && <HomeIcon sx={{ ...iconStyle, mr: 0 }} />}
                                            </Typography>
                                            {/* {mainContent}
                                            {itemContent} */}
                                        </MuiBreadcrumbs>
                                        {selectedDataset && (
                                            <span
                                                style={{
                                                    cursor: item.title !== "dashboard" && item.title !== "data entry" ? "pointer" : "auto",
                                                    color: "#000",
                                                    display: "flex",
                                                    alignItems: "center"
                                                }}
                                                onClick={handleDatasetClick}
                                                onKeyDown={(event) => {
                                                    if (event.key === "Enter" || event.key === "Spacebar") {
                                                        handleDatasetClick();
                                                    }
                                                }}
                                                role="button"
                                                tabIndex={0}
                                            >
                                                {selectedDataset.datasetname}
                                                <ArrowRightIcon style={arrowStyle} />
                                            </span>
                                        )}
                                        {item.title && (
                                            <>
                                                <span
                                                    style={{
                                                        cursor:
                                                            item.title !== "dashboard" && item.title !== "data entry" ? "pointer" : "auto",
                                                        color: "#000"
                                                    }}
                                                    onClick={() => {
                                                        if (item.title !== "dashboard" && item.title !== "data entry") {
                                                            handleItemTitleClick(item.title);
                                                        }
                                                    }}
                                                    onKeyDown={(event) => {
                                                        if (event.key === "Enter" || event.key === "Spacebar") {
                                                            if (item.title !== "dashboard" && item.title !== "data entry") {
                                                                handleItemTitleClick(item.title);
                                                            }
                                                        }
                                                    }}
                                                    role="button"
                                                    tabIndex={0}
                                                >
                                                    {item.title}
                                                </span>
                                            </>
                                        )}
                                        {breadcrumbs && (
                                            <>
                                                <ArrowRightIcon style={arrowStyle} stroke={1.5} size={drawerOpen ? null : "16px"} />
                                                {breadcrumbs}
                                            </>
                                        )}
                                        {sourceId && breadcrumbs && (
                                            <>
                                                <ArrowRightIcon style={arrowStyle} /> Datasource ID: {sourceId}
                                            </>
                                        )}
                                    </Typography>
                                </Grid>
                            )}
                            {title && titleBottom && (
                                <Grid item>
                                    <Typography variant="h5" sx={{ fontWeight: 500, whiteSpace: "nowrap", color: "#000" }}>
                                        {item.title}
                                    </Typography>
                                </Grid>
                            )}
                        </Grid>
                    </Box>

                    {card === false && divider !== false && <Divider sx={{ borderColor: theme.palette.primary.main, mb: gridSpacing }} />}
                </Card>
            );
        }
    }

    return breadcrumbContent;
};

Breadcrumbs.propTypes = {
    card: PropTypes.bool,
    divider: PropTypes.bool,
    icon: PropTypes.bool,
    icons: PropTypes.bool,
    maxItems: PropTypes.number,
    navigation: PropTypes.object,
    rightAlign: PropTypes.bool,
    separator: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
    title: PropTypes.bool,
    titleBottom: PropTypes.bool
};

export default Breadcrumbs;
