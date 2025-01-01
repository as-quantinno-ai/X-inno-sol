import { useTheme } from "@mui/material/styles";
import PropTypes from "prop-types";
// material-ui
import { Link, Box, Typography, Tab, Tabs } from "@mui/material";
import PerfectScrollbar from "react-perfect-scrollbar";

// project imports
import React from "react";

function TabPanel({ children, value, index, ...other }) {
    return (
        <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
            {value === index && (
                <Box
                    sx={{
                        p: 3
                    }}
                >
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number,
    value: PropTypes.number
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`
    };
}

const TabComponent = ({ data }) => {
    const [value, setValue] = React.useState(0);
    const theme = useTheme();

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    return (
        <>
            <Tabs
                value={value}
                variant="scrollable"
                onChange={handleChange}
                textColor="secondary"
                indicatorColor="secondary"
                sx={{
                    mb: 3,
                    "& a": {
                        minHeight: "auto",
                        minWidth: 10,
                        py: 1.5,
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
                {data.map((item, indx) => (
                    <Tab key={indx} component={Link} to="#" label={item.head} {...a11yProps(indx)} />
                ))}
            </Tabs>
            {data.map((item, ind) => (
                <TabPanel key={ind} value={value} index={ind}>
                    <PerfectScrollbar style={{ height: 380 }}>{item.body}</PerfectScrollbar>
                </TabPanel>
            ))}
        </>
    );
};

TabComponent.propTypes = {
    data: PropTypes.array
};

export default TabComponent;
