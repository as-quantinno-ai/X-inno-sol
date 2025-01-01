import React, { useState } from "react";
import PropTypes from "prop-types";
import { Tab, Grid, Tabs, Box } from "@mui/material";

import { useTheme } from "@mui/material/styles";
import Content from "./Content";
import FontFamily from "./FontFamily";
import FontColor from "./FontColor";
import FontSize from "./FontSize";
import TextStyle from "./TextStyle";
import ThemePalete from "./ThemePalette";
import BackgroundColor from "./BackgroundColor";

function TabPanels(props) {
    const { children, value, index, ...other } = props;

    return (
        <div role="tabpanel" hidden={value !== index} id={`tabpanel-${index}`} aria-labelledby={`tab-${index}`} {...other}>
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}
// function a11yProps(index) {
//     return {
//         id: `simple-tab-${index}`,
//         "aria-controls": `simple-tabpanel-${index}`
//     };
// }

TabPanels.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any,
    value: PropTypes.any
};
const CustomSideMenu = ({
    handleColorClick,
    content,
    handleContentSubmit,
    handleForegroundColorClick,
    handleBackgroundColorClick,
    selectedCard,
    handleFontSizeClick,
    handleFontFamilyClick,
    handleFontStyleClick,
    // selectedItem,
    contentHeaderInputRef,
    contentBodyInputRef,
    handleCloseDrawer,
    headerValues,
    contentValues
}) => {
    const theme = useTheme();
    const [value, setValue] = useState(0);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <div>
            <Tabs
                value={value}
                onChange={handleChange}
                textColor="secondary"
                indicatorColor="secondary"
                sx={{
                    mb: 3,
                    "& a": {
                        minHeight: "auto",
                        minWidth: 10,
                        px: 1,
                        mr: 2.2,
                        color: theme.palette.grey[600],
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center"
                    },
                    "& a.Mui-selected": {
                        color: theme.palette.primary.main
                    },
                    "& a > svg": {
                        mb: "0px !important",
                        mr: 1.1
                    }
                }}
            >
                <Tab label="Styling" id="tab-1" />
                <Tab label="Content" id="tab-2" />
            </Tabs>
            <TabPanels value={value} index={0}>
                {/* // <MainCard style={{ height: '100%' }}> */}
                <Grid spacing={4} rowSpacing={4} sx={{ p: 2, paddingTop: "0px", paddingBottom: "20px" }}>
                    <Grid sx={{ padding: "5px" }}>
                        <BackgroundColor handleBackgroundColorClick={handleBackgroundColorClick} />
                    </Grid>
                    <Grid sx={{ padding: "5px" }}>
                        <ThemePalete handleColorClick={handleColorClick} />
                    </Grid>
                    <Grid sx={{ padding: "5px" }}>
                        <FontSize handleFontSizeClick={handleFontSizeClick} />
                    </Grid>
                    <Grid sx={{ padding: "5px" }}>
                        <TextStyle handleFontStyleClick={handleFontStyleClick} />
                    </Grid>
                    <Grid sx={{ padding: "5px" }}>
                        <FontFamily handleFontFamilyClick={handleFontFamilyClick} />
                    </Grid>
                    <Grid sx={{ padding: "5px" }}>
                        <FontColor handleForegroundColorClick={handleForegroundColorClick} />
                    </Grid>
                </Grid>
            </TabPanels>
            <TabPanels value={value} index={1}>
                <Grid container spacing={1} sx={{ p: 3 }}>
                    <Content
                        content={content}
                        selectedCard={selectedCard}
                        handleContentSubmit={handleContentSubmit}
                        contentHeaderInputRef={contentHeaderInputRef}
                        contentBodyInputRef={contentBodyInputRef}
                        handleCloseDrawer={handleCloseDrawer}
                        headerValues={headerValues}
                        contentValues={contentValues}
                    />
                </Grid>
            </TabPanels>
        </div>
    );
};

CustomSideMenu.propTypes = {
    handleColorClick: PropTypes.func,
    content: PropTypes.object,
    handleContentSubmit: PropTypes.func,
    handleForegroundColorClick: PropTypes.func,
    handleBackgroundColorClick: PropTypes.func,
    selectedCard: PropTypes.object,
    handleFontSizeClick: PropTypes.func,
    handleFontFamilyClick: PropTypes.func,
    handleFontStyleClick: PropTypes.func,
    selectedItem: PropTypes.object,
    contentHeaderInputRef: PropTypes.object,
    contentBodyInputRef: PropTypes.object,
    handleCloseDrawer: PropTypes.func,
    headerValues: PropTypes.object,
    contentValues: PropTypes.object
};

export default CustomSideMenu;
