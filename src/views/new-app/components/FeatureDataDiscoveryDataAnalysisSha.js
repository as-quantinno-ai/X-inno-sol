import React from "react";
// material-ui
import { useTheme } from "@mui/material/styles";
import { Grid, MenuItem, Select, Skeleton, Box, Typography } from "@mui/material";

// project imports
import { openSnackbar } from "store/slices/snackbar";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "store";
import { updateSelectedCharts } from "store/slices/AppDashboardRawSha";
import {
    loadFileDataUrl,
    comparativeAnalysisChiSqrRecs,
    metadataList,
    // columnDataDisPostBiVariantAnalysis,
    columnDataDisGetBiVariantAnalysisByDsTaId,
    GetAccessToken
} from "views/api-configuration/default";
import DynamicDashChart from "views/dash-charts/DynamicDashChart";
import MUIDataTable from "mui-datatables";
import CircularProgress from "@mui/material/CircularProgress";
import api from "views/api-configuration/api";

const ChartTypes = [
    "Line Chart",
    "Bar Chart",
    "Column Chart",
    "Pie Chart",
    "Doughnut Chart",
    "Radial Chart",
    "Area Chart",
    "Polar Chart",
    "Box Chart",
    "Tree Chart",
    "Semi Doughnut Chart",
    "Gauge Chart"
];
const quantitativeChartTypes = ["Box Chart", "Gauge Chart", "Semi Donut Chart"];

// const styles = {
//     tableStyles: {
//         tableCellsHeader: {
//             padding: "10px",
//             fontSize: "12px",
//             minWidth: "150px"
//         },
//         tableCard: {
//             maxHeight: "400px",
//             height: "400px",
//             overflowY: "scroll"
//         },
//         tableCellBody: {
//             padding: "10px",
//             fontSize: "12px"
//         }
//     }
// };

function FeatureDataDiscoveryDataAnalysisSha() {
    const theme = useTheme();
    const dispatch = useDispatch();
    const { primary } = theme.palette.text;
    const [loading, setLoading] = useState(false);
    // eslint-disable-next-line no-unused-vars
    const [errorqualitative, setErrorqualitative] = useState(false);
    // eslint-disable-next-line no-unused-vars
    const [errorquantitative, setErrorquantitative] = useState(false);

    // const [ComparativeAnalysisAttribs, setComparativeAnalysisAttribs] = useState([]);
    // const [dataChck, setDataChck] = useState("qn");
    // eslint-disable-next-line no-unused-vars
    const [ChiSquareTable, setChiSquareTable] = useState(null);
    // eslint-disable-next-line no-unused-vars
    const [ChiSquareVisualSeries, setChiSquareVisualSeries] = useState(null);

    // const [SelectedDs, setSelectedDs] = useState(-1);
    const { selectedFeaturedDataSource } = useSelector((state) => state.dataCollection);
    const { comparativeanalysisattribute } = useSelector((state) => state.dataCollection);
    const { selectedCharts } = useSelector((state) => state.dataCollection);
    // eslint-disable-next-line no-unused-vars
    const [metadata, setMetadata] = useState([]);
    // const [SelectedCharts, setSelectedCharts] = useState([]);
    // eslint-disable-next-line no-unused-vars
    const [fileData, setFileData] = useState([]);
    const [ActiveCharts, setActiveCharts] = useState([]);
    // eslint-disable-next-line no-unused-vars
    const [BiVaraintVisualCharts, setBiVaraintVisualCharts] = useState([]);
    // eslint-disable-next-line no-unused-vars
    const [biVariantMapFields, setBiVariantMapFields] = useState([]);

    // eslint-disable-next-line no-unused-vars
    const [formData, setFormData] = useState({
        charttype: "BAR",
        createdatetime: "",
        data: "[]",
        datasetid: selectedFeaturedDataSource ? selectedFeaturedDataSource.datasetid : 0,
        attributeandgroupids: `${biVariantMapFields}`,
        id: 0,
        tableid: selectedFeaturedDataSource ? selectedFeaturedDataSource.tableid : 0
    });

    // const submitForm = (e) => {
    //     e.preventDefault();
    //     api.post(columnDataDisPostBiVariantAnalysis, formData, { headers: GetAccessToken() })
    //         .then((res) => {
    //             return res;
    //         })
    //         .catch((err) => {
    //             return err;
    //         });
    // };

    useEffect(() => {
        setActiveCharts(selectedCharts.filter((item) => item.active));
    }, [selectedCharts]);

    useEffect(() => {
        if (selectedFeaturedDataSource) {
            setFormData({
                charttype: "BAR",
                createdatetime: "",
                data: "[]",
                datasetid: selectedFeaturedDataSource ? selectedFeaturedDataSource.productclientdatasetsid : 0,
                attributeandgroupids: `${biVariantMapFields}`,
                id: 0,
                tableid: selectedFeaturedDataSource ? selectedFeaturedDataSource.tableid : 0
            });

            Promise.all([
                api.get(
                    columnDataDisGetBiVariantAnalysisByDsTaId(
                        selectedFeaturedDataSource.productclientdatasetsid,
                        selectedFeaturedDataSource.tableid
                    )
                ),
                api.get(`${metadataList}${selectedFeaturedDataSource.productclientdatasetsid}/${selectedFeaturedDataSource.tableid}`),
                api.get(`${loadFileDataUrl}${selectedFeaturedDataSource.loadedTableLocation}`)
            ])
                .then((responses) => {
                    const [biVariantAnalysisResponse, metadataResponse, fileDataResponse] = responses;

                    setBiVaraintVisualCharts(biVariantAnalysisResponse.data.result);
                    setMetadata(metadataResponse.data.result);
                    setFileData(fileDataResponse.data.result);
                    setLoading(false);

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

                    return responses;
                })
                .catch((error) => {
                    dispatch(
                        openSnackbar({
                            open: true,
                            message: "Failed to load featured data",
                            variant: "alert",
                            alert: {
                                color: "error"
                            },
                            close: false
                        })
                    );
                    setLoading(false);
                    return error;
                });
        }
    }, [selectedFeaturedDataSource]);

    const onChartListChange = (e) => {
        setLoading(true);
        // charttype datasetId tableId attributeid attribName
        const chartInfo = e.target.value.split(",");

        let charts = selectedCharts;

        charts = charts.map((item) => {
            let chartData = item;
            if (item.dsid === Number(chartInfo[1]) && item.taid === Number(chartInfo[2]) && item.attid === Number(chartInfo[3])) {
                chartData = { ...item, active: true, ct: chartInfo[0] };
            }
            return chartData;
        });
        dispatch(updateSelectedCharts(charts));
    };

    // Redux Store
    // const { dataSourceTableId, dataSourceDataSetId } = useSelector((state) => state.featuredDataDiscovery);

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
            ComparativeAnalysisAtributeOptions !== null && ComparativeAnalysisAtributeOptions !== undefined
                ? ComparativeAnalysisTabAndChartGenerator()
                : null,
        [ComparativeAnalysisAtributeOptions]
    );

    // const addBiVariantMapFields = () => {
    //     setBiVariantMapFields([...biVariantMapFields, { selected_attrib: "", selected_grp: "" }]);
    // };
    // const removeBiVariantMapFields = (n) => {
    //     const arr = biVariantMapFields;
    //     setBiVariantMapFields(biVariantMapFields.filter((_, index) => index !== n));
    // };
    // const selctAttribBiVariantMapFields = (ind, val) => {
    //     const data = [...biVariantMapFields];
    //     data[ind] = { ...data[ind], selected_attrib: val };
    //     setBiVariantMapFields(data);
    //     setFormData({
    //         charttype: "BAR",
    //         createdatetime: "",
    //         data: "[]",
    //         datasetid: selectedFeaturedDataSource ? selectedFeaturedDataSource.productclientdatasetsid : 0,
    //         attributeAndGroupIds: `${biVariantMapFields}`,
    //         id: 0,
    //         tableid: selectedFeaturedDataSource ? selectedFeaturedDataSource.tableId : 0
    //     });
    // };

    // const selctGrpibBiVariantMapFields = (ind, val) => {
    //     const data = [...biVariantMapFields];
    //     data[ind] = { ...data[ind], selected_grp: val };
    //     setBiVariantMapFields(data);
    //     setFormData({
    //         charttype: "BAR",
    //         createdatetime: "",
    //         data: "[]",
    //         datasetid: selectedFeaturedDataSource ? selectedFeaturedDataSource.productclientdatasetsid : 0,
    //         attributeAndGroupIds: JSON.stringify(biVariantMapFields),
    //         id: 0,
    //         tableid: selectedFeaturedDataSource ? selectedFeaturedDataSource.tableId : 0
    //     });
    //     console.table("bivaraintformData", formData);
    // };
    // const changeFieldValue = (value) => {
    //     setFormData({
    //         charttype: value,
    //         createdatetime: "",
    //         data: "[]",
    //         datasetid: selectedFeaturedDataSource ? selectedFeaturedDataSource.productclientdatasetsid : 0,
    //         attributeAndGroupIds: JSON.stringify(biVariantMapFields),
    //         id: 0,
    //         tableid: selectedFeaturedDataSource ? selectedFeaturedDataSource.tableId : 0
    //     });
    // };
    const columns = [
        {
            name: "SelectChartType",
            label: "SELECT VISUAL",
            options: {
                customBodyRender: (value, tableMeta) => (
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Select Chart Type"
                        style={{ width: "100%", padding: "0px" }}
                        size="small"
                        onChange={onChartListChange}
                        value={`${quantitativeChartTypes[0]},${selectedFeaturedDataSource.productclientdatasetsid},${
                            selectedFeaturedDataSource.tableid
                        },${comparativeanalysisattribute[tableMeta.rowIndex].attributeid},${
                            comparativeanalysisattribute[tableMeta.rowIndex].attribName
                        }`}
                    >
                        {quantitativeChartTypes.map((ct, index) => (
                            <MenuItem
                                key={index}
                                value={`${ct},${selectedFeaturedDataSource.productclientdatasetsid},${selectedFeaturedDataSource.tableid},${
                                    comparativeanalysisattribute[tableMeta.rowIndex].attributeid
                                },${comparativeanalysisattribute[tableMeta.rowIndex].attribName}`}
                            >
                                {ct}
                            </MenuItem>
                        ))}
                    </Select>
                )
            }
        },
        {
            name: "attribName",
            label: "VARIABLE NAME"
        },
        {
            name: "mean",
            label: "MEAN"
        },
        {
            name: "median",
            label: "MEDIAN"
        },
        {
            name: "sqrtroot",
            label: "S.Q.R DEVIATION"
        },
        {
            name: "quartile1",
            label: "QUARTILE 01"
        },
        {
            name: "quartile2",
            label: "QUARTILE 02"
        },
        {
            name: "quartile3",
            label: "QUARTILE 03"
        },
        {
            name: "min",
            label: "MIN"
        },
        {
            name: "max",
            label: "MAX"
        },
        {
            name: "mod",
            label: "MOD"
        },
        {
            name: "nullValueCount",
            label: "NULL VALUE COUNT"
        }
    ];

    /*eslint-disable*/
    const quantitative = comparativeanalysisattribute
        ? comparativeanalysisattribute
              .filter((attr) => attr.attribCategory === "QUANTITATIVE")
              .map((item) => ({
                  ...item,
                  SelectChartType: `${quantitativeChartTypes[0]},${selectedFeaturedDataSource.productclientdatasetsid},${selectedFeaturedDataSource.tableid},${item.attributeid},${item.attribName}`
              }))
        : [];
    /*eslint-enable*/
    let noMatchContent;

    if (loading) {
        noMatchContent = (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <CircularProgress />
            </Box>
        );
    } else if (errorquantitative) {
        noMatchContent = (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Typography color="error">{errorquantitative}</Typography>
            </Box>
        );
    } else {
        noMatchContent = (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Typography color="primary"> No Records Available</Typography>
            </Box>
        );
    }

    let noMatchquantitativeOptions;

    if (loading) {
        noMatchquantitativeOptions = (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <CircularProgress />
            </Box>
        );
    } else if (errorqualitative) {
        noMatchquantitativeOptions = (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Typography color="error">{errorqualitative}</Typography>
            </Box>
        );
    } else {
        noMatchquantitativeOptions = (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Typography color="primary"> No Records Available</Typography>
            </Box>
        );
    }
    const quantitativeoptions = {
        elevation: 0,
        textLabels: {
            body: {
                noMatch: noMatchquantitativeOptions
            }
        },
        selectableRows: "none", // or "multiple"
        print: false,
        download: false,
        viewColumns: false
    };

    /*eslint-disable*/
    const qualitative = comparativeanalysisattribute
        ? comparativeanalysisattribute
              .filter((attr) => attr.attribCategory === "QUALITATIVE")
              .map((item) => ({
                  ...item,
                  SelectChartType: `${ChartTypes[0]},${selectedFeaturedDataSource.productclientdatasetsid},${selectedFeaturedDataSource.tableid},${item.attributeid},${item.attribName}`
              }))
        : [];
    /*eslint-enable*/
    const qualitativeoptions = {
        textLabels: {
            body: {
                noMatch: noMatchContent
            }
        },
        elevation: 0,
        selectableRows: "none", // or "multiple"
        print: false,
        download: false,
        viewColumns: false
    };

    // CHARTS FORMS STATES
    return (
        <>
            <Grid item xs={12} sm={12} md={12} lg={12}>
                {selectedFeaturedDataSource !== null ? (
                    <>
                        <Grid container spacing={1}>
                            <Grid item xs={12} sm={12} md={12} lg={12}>
                                <MUIDataTable
                                    title="QUANTITATIVE DATA"
                                    data={quantitative}
                                    columns={columns}
                                    options={quantitativeoptions}
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={12}>
                                <MUIDataTable title="QUALITATIVE DATA" data={qualitative} columns={columns} options={qualitativeoptions} />
                            </Grid>
                        </Grid>

                        {/* <MainCard titlel="Column Data Discovery">
                            <TabComponent
                                data={[
                                    {
                                        head: "Quantitative Data",
                                        body: <> </>
                                    },
                                    {
                                        head: "Qualitative Data",
                                        body: <> </>
                                    },
                                    {
                                        head: "Bi Variant Analysis",
                                        body: (
                                            <>
                                                <form onSubmit={submitForm} style={{ marginTop: "30px" }}>
                                                    <Grid container spacing={gridSpacing}>
                                                        <Grid item xs={12}>
                                                            <Tooltip title="Add Row">
                                                                <IconButton
                                                                    variant="contained"
                                                                    onClick={addBiVariantMapFields}
                                                                    style={{ float: "right" }}
                                                                >
                                                                    <AddCircleIcon />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </Grid>
                                                        {biVariantMapFields.map((item, ind) => (
                                                            <>
                                                                <Grid item xs={5} lg={5}>
                                                                    <InputLabel>Select Filter Attribute</InputLabel>
                                                                    <FormControl sx={{ m: 1, minWidth: 120, width: "100%" }}>
                                                                        <Select
                                                                            labelId="t-i-s"
                                                                            id="filterattributeid"
                                                                            name="filterattributeid"
                                                                            onChange={(event) =>
                                                                                // changeFieldValue("filterattributeid", event.target.value)
                                                                                selctAttribBiVariantMapFields(ind, event.target.value)
                                                                            }
                                                                            fullWidth
                                                                            variant="outlined"
                                                                            value={item.selected_attrib}
                                                                        >
                                                                            {metadata.map((item) => (
                                                                                <MenuItem value={item.attributeId}>
                                                                                    {item.attributeName}
                                                                                </MenuItem>
                                                                            ))}
                                                                        </Select>
                                                                    </FormControl>
                                                                </Grid>
                                                                <Grid item xs={5} lg={5}>
                                                                    <InputLabel>Select Filter Attribute</InputLabel>
                                                                    <FormControl sx={{ m: 1, minWidth: 120, width: "100%" }}>
                                                                        <Select
                                                                            labelId="t-i-s"
                                                                            id="filterattributeid"
                                                                            name="filterattributeid"
                                                                            onChange={(event) =>
                                                                                selctGrpibBiVariantMapFields(ind, event.target.value)
                                                                            }
                                                                            fullWidth
                                                                            variant="outlined"
                                                                            value={item.selected_grp}
                                                                        >
                                                                            {metadata.map((item) => (
                                                                                <MenuItem value={item.attributeId}>
                                                                                    {item.attributeName}
                                                                                </MenuItem>
                                                                            ))}
                                                                        </Select>
                                                                    </FormControl>
                                                                </Grid>
                                                                <Grid
                                                                    item
                                                                    xs={2}
                                                                    lg={2}
                                                                    style={{
                                                                        display: "flex",
                                                                        justifyContent: "flex-end",
                                                                        alignItems: "flex-end",
                                                                        padding: "12px 0px 1px 8px"
                                                                    }}
                                                                >
                                                                    <Tooltip title="Add Row">
                                                                        <IconButton
                                                                            variant="contained"
                                                                            onClick={() => removeBiVariantMapFields(ind)}
                                                                            style={{ float: "right" }}
                                                                        >
                                                                            <DeleteIcon />
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                </Grid>
                                                            </>
                                                        ))}

                                                        <Grid item xs={12} lg={12}>
                                                            <InputLabel>Select Chart Type</InputLabel>
                                                            <FormControl sx={{ m: 1, minWidth: 120, width: "100%" }}>
                                                                <Select
                                                                    labelId="t-i-s"
                                                                    id="charttype"
                                                                    name="charttype"
                                                                    onChange={(event) => changeFieldValue(event.target.value)}
                                                                    fullWidth
                                                                    variant="outlined"
                                                                >
                                                                    {["BAR", "STACKED", "COLUMN", "LINE"].map((item) => (
                                                                        <MenuItem value={item}>{item}</MenuItem>
                                                                    ))}
                                                                </Select>
                                                            </FormControl>
                                                        </Grid>
                                                        <Grid item xs={12} lg={4}>
                                                            <Button
                                                                type="submit"
                                                                variant="contained"
                                                                endIcon={<SendIcon />}
                                                                // onClick={submitForm}
                                                            >
                                                                SUBMIT
                                                            </Button>
                                                        </Grid>
                                                    </Grid>
                                                </form>
                                            </>
                                        )
                                    }
                                ]}
                            />
                        </MainCard> */}
                    </>
                ) : (
                    <>
                        <Grid container>
                            <Grid item xs={12} sm={12} md={12} lg={12}>
                                <Skeleton variant="rectangular" height={200} />
                            </Grid>
                        </Grid>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={12} md={4} lg={4}>
                                <Skeleton variant="rectangular" height={200} />
                            </Grid>
                            <Grid item xs={12} sm={12} md={4} lg={4}>
                                <Skeleton variant="rectangular" height={200} />
                            </Grid>
                            <Grid item xs={12} sm={12} md={4} lg={4}>
                                <Skeleton variant="rectangular" height={200} />
                            </Grid>
                        </Grid>
                    </>
                )}
            </Grid>
            {ActiveCharts.map((item, indx) => (
                <Grid key={indx} item xs={12} sm={12} md={4} lg={4}>
                    {item.active && (
                        <DynamicDashChart
                            dsid={item.dsid}
                            taid={item.taid}
                            attid={item.attid}
                            ct={item.ct}
                            attName={item.attName}
                            functionname="FEATURE-DATA-DISCOVERY-SINGLEVARIABLE"
                        />
                    )}
                </Grid>
            ))}
            {/* {BiVaraintVisualCharts
                ? BiVaraintVisualCharts.map((item) => (
                      <Grid item xs={12} lg={12}>
                          {console.log("charttypes", item.data)}
                          <DynamicChart
                              bivaraintAnalysisData={JSON.parse(item.data)}
                              ct={item.ct}
                              state="BI"
                              funcid={8}
                              attid={item.id}
                              dsid={item.datasetid}
                              taid={item.tableid}
                          />
                      </Grid>
                  ))
                : console.log("ChartNotLoading", BiVaraintVisualCharts)} */}
        </>
    );
}

export default FeatureDataDiscoveryDataAnalysisSha;
