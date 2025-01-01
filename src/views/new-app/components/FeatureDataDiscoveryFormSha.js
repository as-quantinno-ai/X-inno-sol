// material-ui
import { useTheme } from "@mui/material/styles";
import { Grid, FormControl, InputLabel, MenuItem, Select, Skeleton, Box, Typography } from "@mui/material";

import PropTypes from "prop-types";
// project imports
import { openSnackbar } from "store/slices/snackbar";
// import { useDataSource } from "contexts/DataSourcesContext";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "store";
import { comparativeAnalysisChiSqrRecs, GetAccessToken } from "views/api-configuration/default";

// Redux Toolkit Implementation
import { featuredDataSourceSelection } from "store/slices/AppDashboardRawSha";
// import JSXStyles from 'styles/style';
import TotalRevenueCard from "views/new-app/components/basic/TotalRevenueCard";
import { gridSpacing } from "store/constant";
import FeaturedDataTable from "views/new-app/components/basic/FeaturedDataTable";
import FeatureDataDiscoveryDataAnalysisSha from "./FeatureDataDiscoveryDataAnalysisSha";
import FeaturedColumnDataDiscovery from "./FeaturedColumnDataDiscovery";
import MainCard from "views/new-app/components/basic/cards/MainCard";
import api from "views/api-configuration/api";
// import { SetMlModelList } from 'store/slices/MlModelsRawSha';
// tab content customize
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
    index: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    value: PropTypes.any
};

// function a11yProps(index) {
//     return {
//         id: `simple-tab-${index}`,
//         "aria-controls": `simple-tabpanel-${index}`
//     };
// }
function FeatureDataDiscoveryFormSha({ data }) {
    const theme = useTheme();
    const dispatch = useDispatch();
    const { primary } = theme.palette.text;
    // eslint-disable-next-line no-unused-vars
    const [loading, setLoading] = useState(false);

    // const [DataSources, setDataSources] = useDataSource();
    // const [ComparativeAnalysisAttribs, setComparativeAnalysisAttribs] = useState([]);
    // eslint-disable-next-line no-unused-vars
    const [ChiSquareTable, setChiSquareTable] = useState(null);
    // eslint-disable-next-line no-unused-vars
    const [ChiSquareVisualSeries, setChiSquareVisualSeries] = useState(null);

    // const [Header, setHeader] = useState([]);
    // const [QualitativeData, setQualitativeData] = useState([]);

    // const [DsTitle, setDsTitle] = useState([]);
    // const [SelectedDs, setSelectedDs] = useState(-1);

    // eslint-disable-next-line no-unused-vars
    const [SelectedCharts, setSelectedCharts] = useState([]);
    // eslint-disable-next-line no-unused-vars
    const [ActiveCharts, setActiveCharts] = useState([]);
    // const { dataSourceTableId, dataSourceDataSetId } = useSelector((state) => state.featuredDataDiscovery);
    const { featuredMetaDataList, selectedFeaturedDataSource } = useSelector((state) => state.dataCollection);
    const [selectedValue, setSelectedValue] = useState(() => {
        const storedValue = sessionStorage.getItem("selectedCatalog");
        return storedValue || "";
    });

    useEffect(() => {
        setActiveCharts(SelectedCharts.filter((item) => item.active));
        // setLoading(false);
    }, [SelectedCharts]);

    // eslint-disable-next-line no-unused-vars
    const [value, setValue] = React.useState(0);

    // const handleChange = (event, newValue) => {
    //     setValue(newValue);
    // };

    useEffect(() => {
        setLoading(true);
    }, [selectedFeaturedDataSource]);

    // Redux Store

    // const styles = JSXStyles();

    const DataSourceChangeHandler = (event) => {
        const value = event.target.value;

        setSelectedValue(value);
        const datasetid = Number(event.target.value.slice(0, event.target.value.toString().search("-")));
        const tableid = Number(event.target.value.slice(event.target.value.toString().search("-") + 1, event.target.value.length));
        dispatch(featuredDataSourceSelection(datasetid, tableid));
        // dispatch(SetMlModelList(datasetid, tableid));
    };

    useEffect(() => {
        sessionStorage.setItem("selectedCatalog", selectedValue);
    }, [selectedValue]);

    useEffect(() => {
        const storedValue = sessionStorage.getItem("selectedCatalog");
        if (storedValue) {
            setSelectedValue(storedValue);
        }
    }, []);

    // eslint-disable-next-line no-unused-vars
    const [ComparativeAnalysisAtributeOptions, setComparativeAnalysisAtributeOptions] = useState(null);
    const ComparativeAnalysisTabAndChartGenerator = () => {
        const datasetid = Number(
            ComparativeAnalysisAtributeOptions.val.slice(0, ComparativeAnalysisAtributeOptions.val.toString().search("-"))
        );
        const tableid = Number(
            ComparativeAnalysisAtributeOptions.val.slice(
                ComparativeAnalysisAtributeOptions.val.toString().search("-") + 1,
                ComparativeAnalysisAtributeOptions.val.indexOf("|")
            )
        );
        const attributeid = Number(
            ComparativeAnalysisAtributeOptions.val.slice(
                ComparativeAnalysisAtributeOptions.val.indexOf("|") + 1,
                ComparativeAnalysisAtributeOptions.val.length
            )
        );

        api.get(`${comparativeAnalysisChiSqrRecs}/${datasetid}/${tableid}/${attributeid}`, { headers: GetAccessToken() })
            .then((response) => {
                // setChiSquareTable(response.data.result);
                dispatch(
                    openSnackbar({
                        open: true,
                        message: "Comparative Analysis Data Loaded Successfully",
                        variant: "alert",
                        alert: {
                            color: "success"
                        },
                        close: false
                    })
                );
                setChiSquareTable(response.data.result);

                setChiSquareVisualSeries({
                    chart: {
                        type: "bar"
                    },
                    plotOptions: {
                        bar: {
                            horizontal: ComparativeAnalysisAtributeOptions.ChartLayout
                        }
                    },
                    series: response.data.result[0].visualData.series,
                    animations: {
                        enabled: true,
                        easing: "easeinout",
                        speed: 800,
                        animateGradually: {
                            enabled: true,
                            delay: 150
                        },
                        dynamicAnimation: {
                            enabled: true,
                            speed: 350
                        }
                    },
                    xaxis: {
                        labels: {
                            style: {
                                // colors: [primary, primary, primary, primary, primary, primary]
                                // colors: response.data.result[0].visualData.series.map((obj) => primary)
                                colors: [primary, primary, primary, primary, primary, primary, primary, primary, primary, primary]
                            }
                        }
                    },
                    yaxis: {
                        labels: {
                            style: {
                                colors: [primary, primary, primary, primary, primary, primary, primary, primary, primary, primary]
                                // colors: response.data.result[0].visualData.series.map((obj) => primary)
                            }
                        }
                    },
                    dataLabels: {
                        style: {
                            fontSize: "10px",
                            fontWeight: "100",
                            backgroundColor: "red"
                        }
                    },

                    grid: {
                        stroke: 1,
                        opacity: 0.2,
                        xaxis: {
                            lines: {
                                show: true
                            },
                            axisBorder: {
                                show: false,
                                color: "red",
                                height: 1,
                                width: "100%",
                                offsetX: 0,
                                offsetY: 0
                            },
                            labels: {
                                show: false,
                                rotate: -45,
                                rotateAlways: false,
                                hideOverlappingLabels: true,
                                showDuplicates: false,
                                trim: false,
                                minHeight: undefined,
                                maxHeight: 120,
                                style: {
                                    colors: ["#fff"],
                                    fontSize: "12px",
                                    fontFamily: "Helvetica, Arial, sans-serif",
                                    fontWeight: 400,
                                    cssClass: "apexcharts-xaxis-label"
                                }
                            }
                        },
                        yaxis: {
                            lines: {
                                show: true
                            }
                        }
                    }
                });
                // chartOptions.series = response.data.result[0].visualData.series;
                setChiSquareVisualSeries("");

                return response.data.result;
            })
            .catch((response) => {
                dispatch(
                    openSnackbar({
                        open: true,
                        message: "Comparative Analysis Data Loading Falied",
                        variant: "alert",
                        alert: {
                            color: "error"
                        },
                        close: false
                    })
                );

                return response;
            });
    };
    useEffect(
        () =>
            ComparativeAnalysisAtributeOptions !== null &&
            ComparativeAnalysisAtributeOptions !== undefined &&
            ComparativeAnalysisTabAndChartGenerator()[ComparativeAnalysisAtributeOptions]
    );

    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12} sm={12} md={12} lg={12}>
                <FormControl
                    sx={{ m: 1, minWidth: 120 }}
                    style={{
                        display: "block",
                        width: "100%",
                        marginTop: "0px",
                        paddingLeft: "0px",
                        marginLeft: "0px"
                    }}
                >
                    <InputLabel id="data-source-select">Select Data Domain</InputLabel>
                    <Select
                        labelId="data-source-select"
                        id="data-source"
                        name="age"
                        fullWidth
                        defaultValue={selectedValue}
                        value={selectedValue}
                        onChange={DataSourceChangeHandler}
                        label="Select Data Source"
                    >
                        {data?.map((menuItem) => {
                            let tag = <></>;
                            if (menuItem.tableloadstatus === "FINISHED" && menuItem.tabletype === "FEATURE") {
                                tag = (
                                    <MenuItem value={`${menuItem.productclientdatasetsid}-${menuItem.tableid}`}>
                                        {menuItem.tablename}
                                    </MenuItem>
                                );
                            }
                            return tag;
                        })}
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={12} md={10} lg={10}>
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                        {selectedFeaturedDataSource ? (
                            <FeaturedDataTable type="feature" />
                        ) : (
                            <Skeleton variant="rectangular" height={200} />
                        )}

                        {/* {selectedFeaturedDataSource ? (
                            <FormArea
                                form={
                                    <PublishToDashboardForm
                                        funcid={8}
                                        referenceid={selectedFeaturedDataSource.tableid}
                                        tableid={selectedFeaturedDataSource.tableid}
                                        componentDisplayType="GRID"
                                    />
                                }
                                btnTitle="Publish"
                            />
                        ) : (
                            <></>
                        )} */}
                        {}
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} sm={12} md={2} lg={2}>
                {selectedFeaturedDataSource ? (
                    <TotalRevenueCard
                        title="Metadata"
                        // data={featuredMetaDataList.filter((item) => item.attributeCategory === 'QUALITATIVE')}
                        data={featuredMetaDataList}
                    />
                ) : (
                    <Skeleton variant="rectangular" height={200} />
                )}
                {/* <Tabs
                    value={value}
                    variant="scrollable"
                    onChange={handleChange}
                    textColor="secondary"
                    indicatorColor="secondary"
                    sx={{
                        mb: 3,
                        '& a': {
                            minHeight: 'auto',
                            minWidth: 10,
                            py: 1.5,
                            px: 1,
                            mr: 2.2,
                            color: theme.palette.grey[600],
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center'
                        },
                        '& a.Mui-selected': {
                            color: theme.palette.primary.main
                        },
                        '& a > svg': {
                            mb: '0px !important',
                            mr: 1.1
                        }
                    }}
                >
                    <Tab component={Link} to="#" label="Qualitative Data" {...a11yProps(0)} />
                    <Tab component={Link} to="#" label="Quantitative Data" {...a11yProps(1)} />
                </Tabs>
                <TabPanel value={value} index={0}>
                    {featuredMetaDataList ? (
                        <TotalRevenueCard
                            title="Qualitative Data"
                            data={featuredMetaDataList.filter((item) => item.attributeCategory === 'QUALITATIVE')}
                        />
                    ) : (
                        <></>
                    )}
                </TabPanel>
                <TabPanel value={value} index={1}>
                    {featuredMetaDataList ? (
                        <TotalRevenueCard
                            title="Quantitative Data"
                            data={featuredMetaDataList.filter((item) => item.attributeCategory === 'QUANTITATIVE')}
                        />
                    ) : (
                        <></>
                    )}
                </TabPanel> */}
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12}>
                {selectedFeaturedDataSource ? (
                    <MainCard titlel="Column Data Discovery">
                        <Grid container spacing={gridSpacing}>
                            {selectedFeaturedDataSource === null ? <></> : <FeaturedColumnDataDiscovery />}
                        </Grid>
                    </MainCard>
                ) : (
                    <Skeleton variant="rectangular" height={200} />
                )}
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12}>
                {selectedFeaturedDataSource ? (
                    <Grid container spacing={gridSpacing}>
                        <FeatureDataDiscoveryDataAnalysisSha />
                    </Grid>
                ) : (
                    <Skeleton variant="rectangular" height={200} />
                )}
            </Grid>
        </Grid>
    );
}

FeatureDataDiscoveryFormSha.propTypes = {
    data: PropTypes.array
};

export default FeatureDataDiscoveryFormSha;
