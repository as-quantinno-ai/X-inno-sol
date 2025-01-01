import React, { useState, useEffect } from "react";
import MainCard from "../basic/cards/MainCard";
import { gridSpacing } from "store/constant";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import { Grid, TextField, Typography, Button, Tooltip } from "@mui/material";
import { openSnackbar } from "store/slices/snackbar";
// project imports
import { useDispatch, useSelector } from "store";
import { useTheme } from "@mui/material/styles";
// import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
// import CheckBoxIcon from "@mui/icons-material/CheckBox";
// import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import Autocomplete from "@mui/material/Autocomplete";
import PropTypes from "prop-types";
// API Config
import { columnDataDisGetAllCOlumndatadisByLayerId } from "views/api-configuration/default";
import api from "views/api-configuration/api";
import FormFooterButtons from "../FormButtons";
import DateTimeRange from "./DateTimeRange";

// const tableType = ["RAW", "FEATURE"];
// const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
// const checkedIcon = <CheckBoxIcon fontSize="small" />;

// const filterOptions = createFilterOptions({
//     matchFrom: "start",
//     stringify: (option) => option
// });

const RangeUI = ({ item, ranges, onUpdateRange, setFormData }) => {
    console.log(item, "item");
    const currentRange = ranges[item.attributename] || { min: item.min, max: item.max };
    /*eslint-disable*/
    const updateFormData = (updatedMin, updatedMax) => {
        setFormData((formData) =>
            formData.find((field) => field.attrib_name === `${item.viewname}.${item.attributename}`)
                ? formData.map((field) =>
                      field.attrib_name === `${item.viewname}.${item.attributename}`
                          ? { ...field, value: `${updatedMin},${updatedMax}` }
                          : field
                  )
                : [
                      ...formData,
                      {
                          attrib_name: `${item.viewname}.${item.attributename}`,
                          attrib_type: item.attributetype,
                          value: `${updatedMin},${updatedMax}`
                      }
                  ]
        );
    };
    /*eslint-enable*/

    const handleMinDecrement = () => {
        const updatedMin = Math.max(currentRange.min - 1, 0);
        onUpdateRange(item.attributename, updatedMin, currentRange.max);
        updateFormData(updatedMin, currentRange.max);
    };

    const handleMinIncrement = () => {
        const updatedMin = currentRange.min + 1;
        onUpdateRange(item.attributename, updatedMin, currentRange.max);
        updateFormData(updatedMin, currentRange.max);
    };

    const handleMaxDecrement = () => {
        const updatedMax = Math.max(currentRange.max - 1, 0);
        onUpdateRange(item.attributename, currentRange.min, updatedMax);
        updateFormData(currentRange.min, updatedMax);
    };

    const handleMaxIncrement = () => {
        const updatedMax = currentRange.max + 1;
        onUpdateRange(item.attributename, currentRange.min, updatedMax);
        updateFormData(currentRange.min, updatedMax);
    };

    const handleMinValueChange = (e) => {
        const updatedMin = parseInt(e.target.value, 10);
        onUpdateRange(item.attributename, updatedMin, currentRange.max);
        updateFormData(updatedMin, currentRange.max);
    };

    const handleMaxValueChange = (e) => {
        const updatedMax = parseInt(e.target.value, 10);
        onUpdateRange(item.attributename, currentRange.min, updatedMax);
        updateFormData(currentRange.min, updatedMax);
    };

    return (
        <MainCard sx={{ width: "650px", ml: 0, mr: -7 }}>
            <Grid container spacing={0}>
                <Tooltip title={item.attributename}>
                    <div style={{ width: "15%", marginLeft: -10 }}>
                        <Typography noWrap sx={{ width: "100%", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
                            {item.attributename}
                        </Typography>
                    </div>
                </Tooltip>

                <Grid item xs={1}>
                    <Typography variant="body2" align="center">
                        Min
                    </Typography>
                </Grid>
                <Button variant="outlined" color="secondary" onClick={handleMinDecrement} disabled={currentRange.min === 0}>
                    -
                </Button>
                <TextField sx={{ width: "80px" }} type="number" value={currentRange.min} onChange={handleMinValueChange} />
                <Button variant="outlined" color="secondary" onClick={handleMinIncrement}>
                    +
                </Button>
                <Grid item xs={1}>
                    <Typography variant="body2" align="center">
                        Max
                    </Typography>
                </Grid>
                <Button variant="outlined" color="secondary" onClick={handleMaxDecrement}>
                    -
                </Button>
                <TextField sx={{ width: "80px" }} type="number" value={currentRange.max} onChange={handleMaxValueChange} />
                <Button sx={{ width: "10%" }} variant="outlined" color="secondary" onClick={handleMaxIncrement}>
                    +
                </Button>
            </Grid>
        </MainCard>
    );
};

RangeUI.propTypes = {
    item: PropTypes.object,
    ranges: PropTypes.object,
    onUpdateRange: PropTypes.func,
    setFormData: PropTypes.func
};

const QueryBasedFilterForm = ({
    totalCount,
    dashDatasetId,
    dashTableId,
    refrenceId,
    // setFinalData,
    handleApi,
    handleCloseDrawer
    // componentDataId
}) => {
    const dispatch = useDispatch();
    const theme = useTheme();

    const baseData = useSelector((state) => state.initialdata.baseData);

    const [formData, setFormData] = useState([]);
    const [columnData, setColumnData] = useState([]);

    const formatDate = (date) => dayjs(date).format("YYYY-MM-DD");
    const [dateRanges, setDateRanges] = useState([null, null]);
    const [startDate, endDate] = dateRanges;
    const [visibleOptions, setVisibleOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    // eslint-disable-next-line no-unused-vars
    const [filterText, setFilterText] = useState("");
    const [isReset, setIsReset] = useState(false);
    // eslint-disable-next-line no-unused-vars
    const [page, setPage] = useState({});
    const [perPage] = useState(10);
    const [allOptions, setAllOptions] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get(`${columnDataDisGetAllCOlumndatadisByLayerId(dashDatasetId, dashTableId, refrenceId)}`);
                setColumnData(response.data.result);
            } catch (error) {
                console.error("Error fetching column data:", error);
            }
        };

        fetchData();
    }, [dashDatasetId, dashTableId]);

    /*eslint-disable*/
    const setDateRange = (name, newRange) => {
        setFormData((formData) =>
            formData.find((field) => field.attrib_name === name)
                ? formData.map((field) => (field.attrib_name === name ? { ...field, value: newRange.join(",") } : field))
                : [
                      ...formData,
                      {
                          attrib_name: name,
                          attrib_type: "timestamp",
                          value: newRange.join("`|`")
                      }
                  ]
        );
    };

    /*eslint-enable*/
    const handleStartDateChange = (newValue) => {
        const formattedDate = formatDate(newValue.$d);
        const formattedEndDate = formatDate(dateRanges[1] && dateRanges[1].$d);

        setDateRanges([newValue, dateRanges[1]]);
        setDateRange("timestamp_identifier_da_an_v1", [formattedDate, formattedEndDate]);
    };

    const handleEndDateChange = (newValue) => {
        const formattedDate = formatDate(newValue.$d);
        const formattedStrtDate = formatDate(dateRanges[0].$d);

        setDateRanges([dateRanges[0], newValue]);
        setDateRange("timestamp_identifier_da_an_v1", [formattedStrtDate, formattedDate]);
    };

    const changeFieldValue = (e, value) => {
        const fieldName = e;
        const field = columnData?.filter((item) => item?.attributename === e);
        const viewName = field && field[0]?.viewname;
        const fieldValue = value.join("`|`");
        setFormData((formData) => {
            const updatedFormData = [...formData];
            const fieldIndex = updatedFormData.findIndex((field) => field.attrib_name === `${viewName}.${fieldName}`);

            if (fieldIndex !== -1) {
                if (fieldValue) {
                    updatedFormData[fieldIndex] = { ...updatedFormData[fieldIndex], value: fieldValue };
                } else {
                    updatedFormData.splice(fieldIndex, 1);
                }
            } else if (fieldValue) {
                updatedFormData.push({
                    attrib_name: `${viewName}.${fieldName}`,
                    attrib_type: "string",
                    value: fieldValue
                });
            }

            return updatedFormData.filter((field) => field.value.trim() !== "");
        });
    };

    const [ranges, setRanges] = useState(
        columnData.reduce(
            (acc, item) => ({
                ...acc,
                [item.attributename]: { min: item.min || 0, max: item.max || 0 }
            }),
            {}
        )
    );

    const handleUpdateRange = (attributename, updatedMin, updatedMax) => {
        setRanges((prevRanges) => ({
            ...prevRanges,
            [attributename]: { min: updatedMin, max: updatedMax }
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const doubleOrIntegerAttributes = columnData.filter(
            (column) => column.attributeType === "double" || column.attributeType === "integer"
        );

        if (doubleOrIntegerAttributes.length > 0 && (!startDate || !endDate)) {
            dispatch(
                openSnackbar({
                    open: true,
                    message: "Please provide a date range.",
                    anchorOrigin: { vertical: "top", horizontal: "right" },
                    variant: "alert",
                    alert: {
                        color: "error"
                    },
                    close: false
                })
            );
            return;
        }

        handleApi(formData);
        handleCloseDrawer();
    };

    const checkapplicationConfigurationTotalCount = baseData.applicationConfiguration.reduce((totalCount, item) => {
        if (item.type === "SEARCH_DATA_LIMIT") {
            return item.count;
        }
        return null;
    }, 0);

    useEffect(() => {
        const initialOptions = columnData.reduce((acc, item) => {
            if (item.attributetype === "string" && item.distinctValues) {
                const parsedDistinctValues = JSON.parse(item.distinctValues);
                const options = Object.keys(parsedDistinctValues);
                acc[item.attributename] = {
                    options,
                    visible: options.slice(0, perPage)
                };
            }
            return acc;
        }, {});
        setVisibleOptions(initialOptions);
        setAllOptions(initialOptions);
        if (isReset) {
            setVisibleOptions(initialOptions);
        }
    }, [columnData, perPage, isReset]);

    const loadMoreOptions = (attributename) => {
        setTimeout(() => {
            setLoading(false);

            const allOptions = visibleOptions[attributename]?.options || [];
            const currentVisible = visibleOptions[attributename]?.visible || [];

            if (currentVisible.length >= allOptions.length) {
                console.log("End of the list reached. No more options to load.");
                return;
            }

            const nextOptions = allOptions.slice(currentVisible.length, currentVisible.length + 10);

            const updatedVisible = [...currentVisible, ...nextOptions];

            setVisibleOptions((prevState) => ({
                ...prevState,
                [attributename]: {
                    options: allOptions,
                    visible: updatedVisible
                }
            }));
        }, 1000);
    };

    const handleScroll = (event, attributename) => {
        const threshold = 1;
        const bottom = event.target.scrollHeight - event.target.scrollTop - event.target.clientHeight <= threshold;
        const allOptions = visibleOptions[attributename]?.options || [];
        const currentVisible = visibleOptions[attributename]?.visible || [];

        if (bottom && !loading && currentVisible.length <= allOptions.length) {
            setLoading(true);
            setPage((prev) => ({
                ...prev,
                [attributename]: (prev[attributename] || 1) + 1
            }));
            loadMoreOptions(attributename);
        }
    };

    const handleSearch = (event, value, attributename) => {
        const query = value?.toLowerCase() || "";

        setFilterText(query);

        const allOption = allOptions[attributename]?.options || [];

        if (!query) {
            setVisibleOptions((prevState) => ({
                ...prevState,
                [attributename]: {
                    ...prevState[attributename],
                    visible: allOption.slice(0, perPage)
                }
            }));
        } else {
            const filteredOptions = allOption.filter((option) => option.toLowerCase().includes(query));

            setVisibleOptions((prevState) => ({
                ...prevState,
                [attributename]: {
                    ...prevState[attributename],
                    visible: filteredOptions
                }
            }));
        }
    };

    const handleClose = () => {
        setIsReset(true);
        setIsReset(false);
        setFilterText("");
    };

    return (
        <MainCard
            content={false}
            title={
                <Grid container justifyContent="space-between" spacing={gridSpacing}>
                    <Grid item>
                        <Typography variant="h3" component="div" align="center" sx={{ color: theme.palette.primary.dark }}>
                            Add Filter
                        </Typography>
                    </Grid>
                </Grid>
            }
            style={{ width: "100%", height: "fit-content" }}
        >
            <Grid container spacing={2} p={2}>
                {checkapplicationConfigurationTotalCount && totalCount > checkapplicationConfigurationTotalCount && (
                    <Grid item xs={12}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={["DateRangePicker"]}>
                                <DatePicker label="Start Date" value={dateRanges[0]} onChange={handleStartDateChange} />
                                <DatePicker label="End Date" value={dateRanges[1]} onChange={handleEndDateChange} />
                            </DemoContainer>
                        </LocalizationProvider>
                    </Grid>
                )}

                {columnData?.map((item, index) => {
                    const { attributetype, attributename } = item;

                    if (attributetype === "string") {
                        const options = visibleOptions[attributename]?.visible || [];

                        return (
                            <Grid key={index} item xs={12}>
                                <Autocomplete
                                    id={attributename}
                                    name={attributename}
                                    label={attributename}
                                    placeholder={attributename}
                                    fullWidth
                                    variant="outlined"
                                    multiple
                                    options={options}
                                    onInputChange={(e, value) => handleSearch(e, value, attributename)}
                                    getOptionLabel={(option) => option}
                                    onChange={(e, value) => changeFieldValue(attributename, value)}
                                    style={{ width: "500px" }}
                                    ListboxProps={{
                                        onScroll: (e) => handleScroll(e, attributename),
                                        style: { maxHeight: "200px", overflowY: "auto" }
                                    }}
                                    renderInput={(params) => <TextField {...params} label={attributename} placeholder={attributename} />}
                                    onClose={() => handleClose(attributename)}
                                />
                            </Grid>
                        );
                    }

                    if (attributetype === "double" || attributetype === "integer") {
                        return (
                            <div key={index} style={{ margin: "8px" }}>
                                <RangeUI
                                    item={item}
                                    ranges={ranges}
                                    onUpdateRange={handleUpdateRange}
                                    formData={formData}
                                    setFormData={setFormData}
                                />
                            </div>
                        );
                    }

                    if (attributetype === "date" || attributetype === "timestamp") {
                        return (
                            <div key={index} style={{ margin: "8px" }}>
                                <DateTimeRange
                                    columnData={columnData}
                                    item={item}
                                    ranges={ranges}
                                    onUpdateRange={handleUpdateRange}
                                    formData={formData}
                                    setFormData={setFormData}
                                />
                            </div>
                        );
                    }

                    return null;
                })}

                <Grid item xs={12} sm={6}>
                    <FormFooterButtons onSubmit={handleSubmit} onCancel={handleCloseDrawer} />
                </Grid>
            </Grid>
        </MainCard>
    );
};

QueryBasedFilterForm.propTypes = {
    totalCount: PropTypes.number,
    dashDatasetId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    dashTableId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    refrenceId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    setFinalData: PropTypes.func,
    handleApi: PropTypes.func,
    handleCloseDrawer: PropTypes.func
    // componentDataId: PropTypes.string,
};

export default QueryBasedFilterForm;
