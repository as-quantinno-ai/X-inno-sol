import React, { useState, useEffect, useRef, useCallback } from "react";
// material-ui
import { Grid, Typography, Drawer, IconButton } from "@mui/material";
import { gridSpacing } from "store/constant";
import MainCard from "views/new-app/components/basic/cards/MainCard";
import CustomSideMenu from "../new-app/components/CustomSideMenu/CustomizationMenu";
import DehazeIcon from "@mui/icons-material/Dehaze";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
// import CustomSideMenu from '../new-app/components/basic/CustomSideMenu';
import { createCustomDashboardContentStyling, GetJWT, getScreenByScreenId } from "views/api-configuration/default";
import { useSelector } from "store";
import { useParams } from "react-router-dom";
import DashChart from "views/dash-charts/DashChart";
import api from "views/api-configuration/api";
import { useDispatch } from "react-redux";
import { getDatasetFilterConfig } from "store/slices/app-globe";
import PropTypes from "prop-types";
export function DashboardBuilder({ gridDimensions, components, refreshScreens, title, uuid }) {
    const [openDrawer, setOpenDrawer] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);
    const [selectedBackgroundColors, setSelectedBackgroundColors] = useState({});
    const [selectedColors, setSelectedColors] = useState({});
    const [selectedButtons, setSelectedButtons] = useState({});
    const [foregroundColor, setForegroundColor] = useState({});
    const [fontSize, setFontSize] = useState({});
    const [fontStyle, setFontStyle] = useState({});
    const [fontFamily, setFontFamily] = useState({});
    const [styled, setStyled] = useState({
        color: "",
        fontSize: "",
        fontStyle: "",
        fontFamily: "",
        selectedButton: "",
        foregroundColor: ""
    });
    const contentHeaderInputRef = useRef(null);
    const contentBodyInputRef = useRef(null);
    const [toggleStates, setToggleStates] = useState(
        components.reduce((acc, curr) => {
            acc[curr.layout.layoutid] = false;
            return acc;
        }, {})
    );

    const handleToggleChange = (layoutid) => {
        setToggleStates({
            ...toggleStates,
            [layoutid]: !toggleStates[layoutid]
        });
    };

    const handleFontSizeClick = (fontsize) => {
        setFontSize((prevFontSize) => ({
            ...prevFontSize,
            [selectedCard.layout.layoutid]: fontsize
        }));
    };
    const handleFontFamilyClick = (fontfamily) => {
        setFontFamily((prevFontFamily) => ({
            ...prevFontFamily,
            [selectedCard.layout.layoutid]: fontfamily
        }));
    };
    const handleFontStyleClick = (fontstyle) => {
        setFontStyle((prevFontStyle) => ({
            ...prevFontStyle,
            [selectedCard.layout.layoutid]: fontstyle
        }));
    };

    const handleForegroundColorClick = (foregroundColor) => {
        setForegroundColor((prevForegroundColor) => ({
            ...prevForegroundColor,
            [selectedCard.layout.layoutid]: foregroundColor
        }));
    };

    const handleBackgroundColorClick = (color) => {
        setSelectedBackgroundColors((prevSelectedBackgroundColors) => ({
            ...prevSelectedBackgroundColors,
            [selectedCard.layout.layoutid]: color
        }));
    };

    const handleColorClick = (color) => {
        setSelectedColors((prevSelectedColors) => ({
            ...prevSelectedColors,
            [selectedCard.layout.layoutid]: color.secondary
        }));
        setSelectedButtons((prevSelectedButtons) => ({
            ...prevSelectedButtons,
            [selectedCard.layout.layoutid]: color.primary
        }));
    };

    const handleContentSubmit = (selectedcardId) => {
        let content = {};
        content = { ...content, header: contentHeaderInputRef.current.value };
        content = { ...content, body: contentBodyInputRef.current.value };
        content = JSON.stringify(content);

        const styling = JSON.stringify(styled);
        const updatedContent = {
            content,
            layoutid: selectedcardId.layout.layoutid,
            styling
        };

        fetch(createCustomDashboardContentStyling, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${GetJWT()}`
            },
            body: JSON.stringify(updatedContent)
        })
            // eslint-disable-next-line no-unused-vars
            .then((response) => {
                refreshScreens();
                setOpenDrawer(false);
            })
            .catch((error) => {
                console.error(error);
            });
    };
    useEffect(() => {
        const layoutId = selectedCard?.layout?.layoutid || "";
        const backgroundColor = selectedBackgroundColors[layoutId] || "";
        const presetColor = selectedColors[layoutId] || "";
        const fontSizeValue = fontSize[layoutId] || "";
        const fontStyleValue = fontStyle[layoutId] || "";
        const fontFamilyValue = fontFamily[layoutId] || "";
        const selectedButtonValue = selectedButtons[layoutId] || "";
        const foregroundColorValue = foregroundColor[layoutId] || "";

        setStyled({
            presetColor,
            backgroundColor,
            fontSizeValue,
            fontStyleValue,
            fontFamilyValue,
            selectedButtonValue,
            foregroundColorValue
        });
    }, [selectedCard, selectedBackgroundColors, selectedColors, selectedButtons, foregroundColor, fontSize, fontStyle, fontFamily]);

    const [headerValues, setHeaderValues] = useState({});
    const [contentValues, setContentValues] = useState({});
    const handleOpenDrawer = (card) => {
        const dataContent = JSON.parse(card.layout.content);
        const headerValue = dataContent.header || "";
        const contentValue = dataContent.body || "";

        setSelectedCard(card);
        setHeaderValues((prevHeaderValues) => ({
            ...prevHeaderValues,
            [card.layout.layoutid]: headerValue || ""
        }));

        setContentValues((prevContentValues) => ({
            ...prevContentValues,
            [card.layout.layoutid]: contentValue || ""
        }));

        setOpenDrawer(true);
    };

    const handleCloseDrawer = () => {
        setSelectedCard(null);
        setOpenDrawer(false);
    };
    const [isHovered, setHovered] = useState(
        components.reduce((acc, curr) => {
            acc[curr.layout.layoutid] = false;
            return acc;
        }, {})
    );
    return (
        <div>
            {gridDimensions.map((rowInd, index) => (
                <Grid
                    container
                    spacing={gridSpacing}
                    style={{ height: `${Number(rowInd.height.replace("px", "")) + 60}px`, marginTop: "2px" }}
                    key={`${rowInd.num}-${index}`}
                >
                    {components
                        .filter((item) => JSON.parse(item.layout.position)[0][0] === rowInd.num)
                        .map((item, componentsIndex) => {
                            const content = JSON.parse(item.layout.content);
                            const styling = JSON.parse(item.layout.styling);
                            const header = content.header || title;
                            const layoutId = item.layout.layoutid;
                            const uniqueKey = `${layoutId}-${componentsIndex}`;

                            return (
                                <React.Fragment key={uniqueKey}>
                                    {item.data[0]?.componentDisplayType === "GRID" ? (
                                        <Grid
                                            item
                                            xs={12}
                                            sm={12}
                                            md={12}
                                            lg={JSON.parse(item.layout.position)[1][1] - (JSON.parse(item.layout.position)[0][1] - 1)}
                                            style={{
                                                color: "red",
                                                position: "relative",
                                                height: "100%",
                                                marginBottom: 20
                                            }}
                                            key={`${layoutId}-${componentsIndex}-chart`}
                                        >
                                            <MainCard
                                                key={`${layoutId}-${componentsIndex}-card`}
                                                style={{
                                                    position: "relative",
                                                    height: "100%",
                                                    marginBottom: 2,
                                                    backgroundColor:
                                                        selectedBackgroundColors[item.layout.layoutid] || styling.backgroundColor,
                                                    color: selectedColors[item.layout.layoutid] || styling.presetcolor
                                                }}
                                                contentSX={{ p: 0.5, m: 0.5 }}
                                            >
                                                <DashChart
                                                    data={item.data}
                                                    dataDetails={item.dataDetails}
                                                    height={rowInd.height}
                                                    title={header}
                                                    uuid={uuid}
                                                />
                                            </MainCard>
                                        </Grid>
                                    ) : (
                                        <Grid
                                            item
                                            xs={12}
                                            sm={12}
                                            md={12}
                                            lg={JSON.parse(item.layout.position)[1][1] - (JSON.parse(item.layout.position)[0][1] - 1)}
                                            style={{
                                                color: "blue",
                                                position: "relative",
                                                height: "100%",
                                                marginBottom: 20
                                            }}
                                            key={`${layoutId}-${componentsIndex}-`}
                                        >
                                            {item.data[0]?.componentDisplayType === "GRID" ? (
                                                <MainCard
                                                    key={`${layoutId}-${componentsIndex}-card`}
                                                    style={{
                                                        position: "relative",
                                                        height: "100%",
                                                        marginBottom: 20,
                                                        backgroundColor:
                                                            selectedBackgroundColors[item.layout.layoutid] || styling.backgroundColor,
                                                        color: selectedColors[item.layout.layoutid] || styling.presetcolor
                                                    }}
                                                    contentSX={{ p: 0.5, m: 0.5 }}
                                                >
                                                    <DashChart
                                                        key={`DashGrid-${layoutId}`}
                                                        data={item.data}
                                                        dataDetails={item.dataDetails}
                                                        height={rowInd.height}
                                                        title={title}
                                                    />
                                                </MainCard>
                                            ) : (
                                                <MainCard
                                                    key={`${layoutId}-${componentsIndex}-card`}
                                                    style={{
                                                        position: "relative",
                                                        height: "100%",
                                                        marginBottom: 20,
                                                        backgroundColor:
                                                            selectedBackgroundColors[item.layout.layoutid] || styling.backgroundColor,
                                                        color: selectedColors[item.layout.layoutid] || styling.presetcolor
                                                    }}
                                                    contentSX={{ p: 0.5, m: 0.5 }}
                                                >
                                                    <Grid container item xs={12} justifyContent="center" alignItems="center">
                                                        <Grid container item xs={9}>
                                                            <Typography variant="h3">{header}</Typography>
                                                        </Grid>
                                                        <Grid container item xs={3} justifyContent="flex-end" alignItems="flex-start">
                                                            <IconButton
                                                                onMouseEnter={() =>
                                                                    setHovered({
                                                                        ...isHovered,
                                                                        [item.layout.layoutid]: !isHovered[item.layout.layoutid]
                                                                    })
                                                                }
                                                                onMouseLeave={() => setHovered(false)}
                                                                onClick={() =>
                                                                    setHovered({
                                                                        ...isHovered,
                                                                        [item.layout.layoutid]: !isHovered[item.layout.layoutid]
                                                                    })
                                                                }
                                                            >
                                                                {isHovered ? (
                                                                    <>
                                                                        <DehazeIcon
                                                                            color={
                                                                                toggleStates[item.layout.layoutid] ? "primary" : "inherit"
                                                                            }
                                                                            fontSize="small"
                                                                            onClick={() => handleToggleChange(item.layout.layoutid)}
                                                                        />
                                                                        <EditIcon
                                                                            color={
                                                                                toggleStates[item.layout.layoutid] ? "primary" : "inherit"
                                                                            }
                                                                            fontSize="small"
                                                                            onClick={() => handleOpenDrawer(item)}
                                                                        />
                                                                        <DeleteIcon
                                                                            color={
                                                                                toggleStates[item.layout.layoutid] ? "primary" : "inherit"
                                                                            }
                                                                            fontSize="small"
                                                                            onClick={() => handleOpenDrawer(item)}
                                                                        />
                                                                    </>
                                                                ) : (
                                                                    <MoreVertIcon
                                                                        color={toggleStates[item.layout.layoutid] ? "primary" : "inherit"}
                                                                        fontSize="small"
                                                                    />
                                                                )}
                                                            </IconButton>
                                                        </Grid>
                                                    </Grid>

                                                    {toggleStates[item.layout.layoutid] ? (
                                                        <Grid
                                                            style={{
                                                                width: "95%",
                                                                overflow: "auto",
                                                                maxHeight: "30vh",
                                                                padding: "10px"
                                                            }}
                                                            key={`${item.layout.layoutid}-typography`}
                                                        >
                                                            <Typography
                                                                style={{
                                                                    color:
                                                                        foregroundColor[item.layout.layoutid] ||
                                                                        styling.foregroundColorValue,
                                                                    fontSize: fontSize[item.layout.layoutid] || styling.fontSizeValue,
                                                                    fontWeight: fontStyle[item.layout.layoutid] || styling.fontStyleValue,
                                                                    fontFamily: fontFamily[item.layout.layoutid] || styling.fontFamilyValue,
                                                                    overflow: "auto"
                                                                }}
                                                            >
                                                                {content.body}
                                                            </Typography>
                                                        </Grid>
                                                    ) : (
                                                        <Grid
                                                            style={{
                                                                paddingRight: 0,

                                                                marginBottom: 20,
                                                                height: "100%",
                                                                width: "95%"
                                                            }}
                                                            key={`${item.layout.layoutid}-Grid`}
                                                        >
                                                            <DashChart
                                                                key={`Dashchart-${layoutId}`}
                                                                data={item.data}
                                                                dataDetails={item.dataDetails}
                                                                height={rowInd.height}
                                                                uuid={uuid}
                                                            />
                                                        </Grid>
                                                    )}
                                                </MainCard>
                                            )}

                                            <Drawer
                                                open={openDrawer}
                                                hideBackdrop={false}
                                                // variant="temporary"
                                                onClose={() => handleCloseDrawer(item)}
                                                PaperProps={{
                                                    sx: {
                                                        width: 300,
                                                        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)"
                                                    }
                                                }}
                                            >
                                                <CustomSideMenu
                                                    handleBackgroundColorClick={handleBackgroundColorClick}
                                                    handleColorClick={handleColorClick}
                                                    handleForegroundColorClick={handleForegroundColorClick}
                                                    selectedCard={selectedCard}
                                                    contentHeaderInputRef={contentHeaderInputRef}
                                                    contentBodyInputRef={contentBodyInputRef}
                                                    handleContentSubmit={handleContentSubmit}
                                                    handleFontSizeClick={handleFontSizeClick}
                                                    handleFontStyleClick={handleFontStyleClick}
                                                    handleFontFamilyClick={handleFontFamilyClick}
                                                    handleCloseDrawer={handleCloseDrawer}
                                                    headerValues={headerValues}
                                                    contentValues={contentValues}
                                                />
                                            </Drawer>
                                        </Grid>
                                    )}
                                </React.Fragment>
                            );
                        })}
                </Grid>
            ))}
        </div>
    );
}

export function Dashboard() {
    const dispatch = useDispatch();

    const { id } = useParams();

    const { selectedDataset } = useSelector((state) => state.userLogin);
    const [screen, setScreen] = useState(null);

    function fetchScreens() {
        if (selectedDataset) {
            dispatch(getDatasetFilterConfig(selectedDataset.productclientdatasetsid));
            api.get(`${getScreenByScreenId(id)}`)
                .then((res) => {
                    setScreen(res.data.result);
                    // console.table(res);
                })
                .catch((err) => console.error("err", err));
        }
    }

    useEffect(() => {
        setScreen(null);
        fetchScreens();
        // const selectData = JSON.parse(localStorage.getItem("selectDataSet"));
    }, [id]);

    const refreshScreens = useCallback(() => {
        fetchScreens();
    }, [fetchScreens]);

    return (
        <>
            {screen ? (
                <DashboardBuilder
                    key={screen?.screen.screentitle}
                    gridDimensions={JSON.parse(screen.screen.screenrows)}
                    componentsLayout={screen.components.map((component) => JSON.parse(component.layout.position))}
                    components={screen.components}
                    refreshScreens={refreshScreens}
                    title={screen?.screen.screentitle}
                />
            ) : (
                <></>
            )}
        </>
    );
}

DashboardBuilder.propTypes = {
    gridDimensions: PropTypes.array,
    components: PropTypes.array,
    title: PropTypes.string,
    uuid: PropTypes.string,
    refreshScreens: PropTypes.func
};
// ================================|| UI TABS - COLOR ||================================ //

export default Dashboard;
