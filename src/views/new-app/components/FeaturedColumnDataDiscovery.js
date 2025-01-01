// material-ui
import { useTheme } from "@mui/material/styles";
import { Grid, FormControl, InputLabel, MenuItem, Select, Skeleton } from "@mui/material";

// project imports
import { openSnackbar } from "store/slices/snackbar";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "store";
import { columnDataDisList, loadFileDataUrl, comparativeAnalysisChiSqrRecs, GetAccessToken } from "views/api-configuration/default";
import MeanModeList from "./basic/MeanModeList ";
import api from "views/api-configuration/api";
// Redux Toolkit Implementation

function FeaturedColumnDataDiscovery() {
    const theme = useTheme();
    const dispatch = useDispatch();
    const { primary } = theme.palette.text;
    // eslint-disable-next-line no-unused-vars
    const [loading, setLoading] = useState(false);

    const { featuredMetaDataList } = useSelector((state) => state.dataCollection);

    const { selectedFeaturedDataSource } = useSelector((state) => state.dataCollection);

    const [ColumnDataDis, setColumnDataDis] = useState([]);
    // eslint-disable-next-line no-unused-vars
    const [ChiSquareTable, setChiSquareTable] = useState(null);
    // eslint-disable-next-line no-unused-vars
    const [ChiSquareVisualSeries, setChiSquareVisualSeries] = useState(null);

    // eslint-disable-next-line no-unused-vars
    const [Header, setHeader] = useState([]);
    // eslint-disable-next-line no-unused-vars
    const [QualitativeData, setQualitativeData] = useState([]);

    // const [DsTitle, setDsTitle] = useState([]);
    // const [SelectedDs, setSelectedDs] = useState(-1);
    const [SelectedVar, setSelectedVar] = useState(-1);

    // eslint-disable-next-line no-unused-vars
    const [SelectedCharts, setSelectedCharts] = useState([]);
    // eslint-disable-next-line no-unused-vars
    const [ActiveCharts, setActiveCharts] = useState([]);

    useEffect(() => {
        setActiveCharts(SelectedCharts.filter((item) => item.active));
        // setLoading(false);
    }, [SelectedCharts]);
    // eslint-disable-next-line no-unused-vars
    const [fileData, setFileData] = useState([]);

    useEffect(() => {
        setLoading(true);
        if (selectedFeaturedDataSource != null) {
            api.get(`${loadFileDataUrl}/${selectedFeaturedDataSource.loadedTableLocation}`)
                .then((response) => {
                    dispatch(
                        openSnackbar({
                            open: true,
                            message: "Featured Data Loaded Successfully",
                            variant: "alert",
                            alert: {
                                color: "success"
                            },
                            close: false
                        })
                    );
                    setFileData(response.data.result);
                    setLoading(false);
                    return response.data.result;
                })
                .catch((response) => {
                    dispatch(
                        openSnackbar({
                            open: true,
                            message: "Failed Loading File Data",
                            variant: "alert",
                            alert: {
                                color: "error"
                            },
                            close: false
                        })
                    );
                    return response;
                });
        }
    }, [selectedFeaturedDataSource]);

    useEffect(() => {
        setQualitativeData(Header.filter((obj) => obj.category === "QUALITATIVE"));
    }, [Header]);

    // Redux Store
    // const { dataSourceTableId, dataSourceDataSetId } = useSelector((state) => state.featuredDataDiscovery);

    // function CreateColumns(data) {
    //     const columns = [];
    //     for (let i = 0; i < data.length; i += 1) {
    //         columns.push({
    //             key: data[i].attributeName,
    //             name: data[i].attributeName
    //         });
    //     }
    //     return columns;
    // }

    // function CreateRows(data) {
    //     const rows = data.map((row) => row);
    //     return rows;
    // }

    // const rows = CreateRows(fileData);

    // const column = CreateColumns(featuredMetaDataList);

    const VaribleChangeHandler = (event) => {
        setLoading(true);
        const datasetid = Number(event.target.value.slice(0, event.target.value.toString().search("-")));
        const tableid = Number(event.target.value.slice(event.target.value.toString().search("-") + 1, event.target.value.indexOf("|")));
        const attributeid = Number(event.target.value.slice(event.target.value.indexOf("|") + 1, event.target.value.length));
        api.get(`${columnDataDisList}${datasetid}/${tableid}/${attributeid}`, { headers: GetAccessToken() })
            .then((response) => {
                setColumnDataDis(response.data.result[0]);
                setLoading(false);
                return response.data.result;
            })
            .catch((response) => {
                return response;
            });
        setSelectedVar(event.target.value);
    };

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

    // CHARTS FORMS STATES
    // const [VisualCharts, setVisualCharts] = useState([]);

    // CHARTS FORMS STATES
    return (
        <>
            <Grid item xs={12} sm={12} md={12} lg={12}>
                <FormControl sx={{ m: 1, minWidth: "100%" }}>
                    <InputLabel id="data-source-select">Select Variable</InputLabel>
                    <Select
                        labelId="data-source-select"
                        id="data-source"
                        name="age"
                        label="Select Data Source"
                        onChange={VaribleChangeHandler}
                    >
                        {featuredMetaDataList.map((menuItem, indx) => (
                            <MenuItem key={indx} value={`${menuItem.productclientdatasetsid}-${menuItem.tableId}|${menuItem.attributeId}`}>
                                {menuItem.attributeName}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>
            {SelectedVar === -1 ? (
                <Grid item xs={12} sm={12} md={12} lg={12}>
                    <Skeleton variant="rectangular" height={200} />
                </Grid>
            ) : (
                <Grid item xs={12} sm={12} md={12} lg={12}>
                    <MeanModeList obj={ColumnDataDis} />
                </Grid>
            )}
        </>
    );
}

export default FeaturedColumnDataDiscovery;
