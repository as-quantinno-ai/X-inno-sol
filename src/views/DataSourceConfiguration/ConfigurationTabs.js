import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "store";

// material-ui
import { useTheme } from "@mui/material/styles";
import { Box, Tab, Tabs, Typography, Grid, FormControl, Button, Chip, MenuItem, Menu } from "@mui/material";
import { openSnackbar } from "store/slices/snackbar";
import { updateSchema } from "views/api-configuration/default";
import { getSchema, gets3config, getDbmsConfig } from "store/slices/datasource-configuration";

// assets
import SendIcon from "@mui/icons-material/Send";
import MetaDataHistory from "./MetaDataHistory";
import MetaDataMapping from "./MetaDataMapping";
import ObservabilityChartsCard from "./Observability/ObservabilityChartsCard";
import RawIngestedFilesDataTable from "./Observability/RawIngestedFilesDataTable";
import Configurations from "./Configurations";
import api from "views/api-configuration/api";

// tab content
function TabPanel({ children, value, index, ...other }) {
    return (
        <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography component="div">{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any,
    value: PropTypes.any
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`
    };
}

export const availableDataTypes = [
    { name: "string", label: "String" },
    { name: "integer", label: "Integer" },
    { name: "long", label: "Long" },
    { name: "double", label: "Double" },
    { name: "float", label: "Float" },
    { name: "date", label: "Date" },
    { name: "timestamp", label: "Tmestamp" }
];

// ================================|| UI TABS - SAMPLE ||================================ //
const chartData = {
    type: "line",
    height: 30,
    options: {
        chart: {
            id: "user-analytics-chart",
            sparkline: {
                enabled: true
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: "straight",
            width: 2
        },
        yaxis: {
            min: -2,
            max: 5,
            labels: {
                show: false
            }
        },
        tooltip: {
            fixed: {
                enabled: false
            },
            x: {
                show: false
            },
            y: {
                title: {
                    formatter: () => "Analytics "
                }
            },
            marker: {
                show: false
            }
        }
    },
    series: [
        {
            data: [2, 1, 2, 1, 1, 3, 0]
        }
    ]
};

export default function ConfigurationTabs() {
    const dispatch = useDispatch();
    // const { configData, schemaFields, getconfigData, dbmsConfig, s3Config } = useSelector((state) => state.datasourceconfiguration);
    const { configData, schemaFields } = useSelector((state) => state.datasourceconfiguration);
    const theme = useTheme();
    const [activeTab, setActiveTab] = useState(0);

    const [changedSchemaFields, setChangedSchemaFields] = useState({});

    const [anchorEl, setAnchorEl] = useState(null);
    const [menus, setMenus] = useState([]);

    useEffect(() => {
        const initialMenus = schemaFields && schemaFields.unapproved && schemaFields.unapproved.map(() => false);
        setMenus(initialMenus || []);
        if (configData?.sourcetype === "DBMS") {
            dispatch(getDbmsConfig(configData?.datasourceid));
        } else if (configData?.sourcetype === "S3") {
            dispatch(gets3config(configData?.datasourceid));
        }
    }, [schemaFields, configData]);

    const [attributeType, setAttributeType] = useState({});

    const handleClick = (index) => (event) => {
        const newMenus = [...menus];
        newMenus[index] = true;
        setAnchorEl(event.currentTarget);
        setMenus(newMenus);
    };

    const handleClose = (index) => () => {
        const newMenus = [...menus];
        newMenus[index] = false;
        setAnchorEl(null);
        setMenus(newMenus);
    };

    const handleTypeChange = (newType, index) => {
        const fieldName = schemaFields.unapproved[index]?.name;

        setAttributeType((prevAttributeType) => ({
            ...prevAttributeType,
            [fieldName]: newType
        }));

        setChangedSchemaFields((prevState) => ({
            ...prevState,
            [fieldName]: newType
        }));

        handleClose(index);
    };

    const handleChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const handleUpdateSchemaFields = async (e) => {
        e.preventDefault();
        try {
            const response = await api.put(updateSchema(configData?.datasourceid), { changes: changedSchemaFields });
            if (response) {
                dispatch(getSchema(configData?.datasourceid));

                dispatch(
                    openSnackbar({
                        open: true,
                        message: "New Meta Data Created Successfully",
                        variant: "alert",
                        alert: {
                            color: "success"
                        },
                        close: false
                    })
                );
            }
        } catch (error) {
            dispatch(
                openSnackbar({
                    open: true,
                    message: "Error Creating Meta Data Record",
                    variant: "alert",
                    alert: {
                        color: "error"
                    },
                    close: false
                })
            );
            console.error("Error creating data source record:", error);
        }
    };
    return (
        <>
            <Tabs
                value={activeTab}
                variant="scrollable"
                onChange={handleChange}
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
                <Tab key="configuration" component={Link} to="#" label="Configuration" {...a11yProps(0)} />
                <Tab key="observability" sx={{ textTransform: "none" }} component={Link} to="#" label="Observability" {...a11yProps(1)} />
                <Tab key="metadata" component={Link} to="#" label="Metadata" {...a11yProps(2)} />
                <Tab key="history" component={Link} to="#" label="Metadata History" {...a11yProps(3)} />
                <Tab key="mappings" component={Link} to="#" label="Metadata Mappings" {...a11yProps(4)} />
                <Tab key="authorized" component={Link} to="#" label="Authorized Users" {...a11yProps(5)} />
            </Tabs>
            <TabPanel key="configuration-panel" value={activeTab} index={0}>
                <Configurations handleChange={handleChange} />
            </TabPanel>
            <TabPanel key="observability-panel" value={activeTab} index={1}>
                <div
                    style={{
                        gridColumn: "span 12",
                        background: theme.palette.primary.main,
                        padding: "10px",
                        color: "white",
                        borderRadius: 5,
                        marginBottom: 3
                    }}
                >
                    <Typography content="span" color="inherit" variant="h4" style={{ margin: 0 }}>
                        Data Source Connection State
                    </Typography>
                </div>
                <Grid container spacing={3} alignItems="center">
                    <Grid item xs={12} sm={6} md={4} lg={2}>
                        <ObservabilityChartsCard type={1} chartData={chartData} value={798} title="Users" />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={2}>
                        <ObservabilityChartsCard type={1} chartData={chartData} value={486} title="Timeout" />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={2}>
                        <ObservabilityChartsCard type={1} chartData={chartData} value="9, 454" title="Views" />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={2}>
                        <ObservabilityChartsCard type={1} chartData={chartData} value={7.15} title="Session" />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={2}>
                        <ObservabilityChartsCard type={1} chartData={chartData} value="04:30" title="Avg. Session" />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={2}>
                        <ObservabilityChartsCard type={1} chartData={chartData} value="1.55%" title="Bounce Rate" />
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                    <RawIngestedFilesDataTable
                        datasetId={configData.productclientdatasetsid}
                        tableId={configData.tableid}
                        datasourceId={configData.datasourceid}
                        formTitle="File Upload History"
                    />
                </Grid>
            </TabPanel>
            <TabPanel key="metadata-panel" value={activeTab} index={2}>
                {schemaFields && schemaFields.unapproved && (
                    <>
                        <div
                            style={{
                                gridColumn: "span 12",
                                background: theme.palette.primary.main,
                                padding: "10px",
                                color: "white",
                                borderRadius: 5
                            }}
                        >
                            <Typography component="span" color="inherit" variant="h4" style={{ margin: 0 }}>
                                Unapproved MetaData
                            </Typography>
                        </div>
                        <Grid item xs={12} sm={12} lg={12} m={2}>
                            {schemaFields &&
                                schemaFields.unapproved &&
                                schemaFields.unapproved?.map((attributeName, index) => (
                                    <React.Fragment key={index}>
                                        <Menu
                                            id={`simple-menu-${index}`}
                                            keepMounted
                                            anchorEl={anchorEl}
                                            open={menus[index]}
                                            onClose={handleClose(index)}
                                        >
                                            {availableDataTypes.map((dtype, key) => (
                                                <MenuItem
                                                    key={key}
                                                    value={dtype.name}
                                                    onClick={() => {
                                                        handleTypeChange(dtype.name, index);
                                                    }}
                                                >
                                                    {dtype.label}
                                                </MenuItem>
                                            ))}
                                        </Menu>
                                        <Button
                                            aria-owns={anchorEl ? `simple-menu-${index}` : null}
                                            aria-controls={`simple-menu-${index}`}
                                            aria-haspopup="true"
                                            variant="outlined"
                                            sx={{ ml: 1, mb: 1 }}
                                            onClick={handleClick(index)}
                                        >
                                            {`${attributeName.name} | ${attributeType[attributeName.name] || attributeName.type}`}
                                        </Button>
                                    </React.Fragment>
                                ))}
                        </Grid>
                        <Grid item xs={12} sm={12} lg={12} m={2}>
                            <FormControl sx={{ m: 1, minWidth: 120, width: "50%" }}>
                                <Button type="submit" onClick={handleUpdateSchemaFields} variant="contained" endIcon={<SendIcon />}>
                                    Approve
                                </Button>
                            </FormControl>
                        </Grid>
                    </>
                )}
                <div
                    style={{
                        gridColumn: "span 12",
                        background: theme.palette.primary.main,
                        padding: "10px",
                        color: "white",
                        borderRadius: 5
                    }}
                >
                    <Typography component="span" color="inherit" variant="h4" style={{ margin: 0 }}>
                        Approved MetaData
                    </Typography>
                </div>
                <Grid item xs={12} sm={12} lg={12} m={2}>
                    {schemaFields &&
                        schemaFields.approved &&
                        schemaFields.approved?.map((attributeName, index) => (
                            <>
                                <Chip
                                    key={index}
                                    label={`${attributeName.name} | ${attributeName.type}`}
                                    variant="outlined"
                                    sx={{
                                        color: "grey",
                                        borderColor: "grey"
                                    }}
                                    style={{ margin: "4px", marginRight: "2px", borderRadius: "5px" }}
                                />
                            </>
                        ))}
                </Grid>
            </TabPanel>
            <TabPanel key="history-panel" value={activeTab} index={3}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <MetaDataHistory />
                    </Grid>
                </Grid>
            </TabPanel>
            <TabPanel key="mapping-panel" value={activeTab} index={4}>
                <MetaDataMapping />
            </TabPanel>
            <TabPanel key="authorization-panel" value={activeTab} index={5}>
                Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher
                vice lomo. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch.
            </TabPanel>
        </>
    );
}
