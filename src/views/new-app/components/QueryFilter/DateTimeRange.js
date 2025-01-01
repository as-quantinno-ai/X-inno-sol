import React from "react";
import { Grid, Typography, TextField, Tooltip } from "@mui/material";
import MainCard from "ui-component/cards/MainCard";
import { convertToUTC } from "constants/generic";
// import moment from "moment";
import PropTypes from "prop-types";

const DateTimeRangeUI = ({ columnData, item, ranges, onUpdateRange, setFormData }) => {
    /*eslint-disable*/
    const currentRange =
        item.attributetype === "date"
            ? ranges[item.attributename] || { min: item.min, max: item.max }
            : ranges[item.attributename] || {
                  min: item.min || "2024-10-01T09:00",
                  max: item.max || "2024-10-01T17:00"
              };
    /*eslint-enable*/
    const field = columnData?.filter((items) => items?.attributename === item.attributename);
    const viewName = field && field[0]?.viewname;
    const updateFormData = (updatedMin, updatedMax) => {
        if (updatedMin && updatedMax) {
            setFormData((prevFormData) => {
                const existingIndex = prevFormData.findIndex((field) => field.attrib_name === `${viewName}.${item.attributename}`);

                if (existingIndex !== -1) {
                    const updatedField = {
                        ...prevFormData[existingIndex],
                        value: `${updatedMin},${updatedMax}`
                    };
                    return [...prevFormData.slice(0, existingIndex), updatedField, ...prevFormData.slice(existingIndex + 1)];
                }
                return [
                    ...prevFormData,
                    {
                        attrib_name: `${viewName}.${item.attributename}`,
                        attrib_type: item.attributetype,
                        value: `${updatedMin},${updatedMax}`
                    }
                ];
            });
        }
    };

    const handleDateChange = (e, isMin) => {
        const value = e.target.value;
        if (isMin) {
            onUpdateRange(item.attributename, value, currentRange.max);
            updateFormData(value, currentRange.max);
        } else {
            onUpdateRange(item.attributename, currentRange.min, value);
            updateFormData(currentRange.min, value);
        }
    };

    const handleDateTimeChange = (value, isMin, isDate) => {
        const minDateTimeParts = currentRange.min.split("T");
        const maxDateTimeParts = currentRange.max.split("T");

        const newMinDate = isDate && isMin ? value : minDateTimeParts[0];
        const newMinTime = !isDate && isMin ? value : minDateTimeParts[1];
        const newMaxDate = isDate && !isMin ? value : maxDateTimeParts[0];
        const newMaxTime = !isDate && !isMin ? value : maxDateTimeParts[1];

        const newMinDateTime = convertToUTC(newMinDate, newMinTime);
        const newMaxDateTime = convertToUTC(newMaxDate, newMaxTime);

        if (isMin) {
            updateFormData(newMinDateTime, currentRange.max || newMaxDateTime);
            onUpdateRange(item.attributename, newMinDateTime, currentRange.max || newMaxDateTime);
        } else {
            updateFormData(currentRange.min || newMinDateTime, newMaxDateTime);
            onUpdateRange(item.attributename, currentRange.min || newMinDateTime, newMaxDateTime);
        }
    };

    const convertToLocal = (utcDateTime) => {
        const date = new Date(utcDateTime);

        const localTime = date.toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false
        });

        return localTime;
    };

    return (
        <MainCard sx={{ width: "650px", ml: 0, mr: 0 }}>
            <Grid container spacing={0} alignItems="center">
                <Tooltip title={item.attributename}>
                    <div style={{ width: "15%", marginLeft: -10 }}>
                        <Typography noWrap sx={{ width: "100%", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
                            {item.attributename}
                        </Typography>
                    </div>
                </Tooltip>

                {item.attributetype === "date" && (
                    <>
                        <Grid item xs={1}>
                            <Typography variant="body2" align="center">
                                Min Date
                            </Typography>
                        </Grid>
                        <TextField
                            sx={{ width: "140px", mr: 1 }}
                            type="date"
                            value={currentRange.minDate}
                            onChange={(e) => handleDateChange(e, true)}
                        />

                        <Grid item xs={1}>
                            <Typography variant="body2" align="center">
                                Max Date
                            </Typography>
                        </Grid>
                        <TextField
                            sx={{ width: "140px", mr: 1 }}
                            type="date"
                            value={currentRange.maxDate}
                            onChange={(e) => handleDateChange(e, false)}
                        />
                    </>
                )}

                {item.attributetype === "timestamp" && (
                    <>
                        <Grid container spacing={0} alignItems="center">
                            <Grid item xs={12} sm={6}>
                                <Typography variant="body2" align="center">
                                    Min DateTime
                                </Typography>
                                <TextField
                                    sx={{ width: "140px", mr: 1 }}
                                    type="date"
                                    value={currentRange.min.split("T")[0]}
                                    onChange={(e) => handleDateTimeChange(e.target.value, true, true)}
                                />
                                <TextField
                                    sx={{ width: "140px" }}
                                    type="time"
                                    value={convertToLocal(currentRange.min)}
                                    onChange={(e) => handleDateTimeChange(e.target.value, true, false)}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Typography variant="body2" align="center">
                                    Max DateTime
                                </Typography>
                                <TextField
                                    sx={{ width: "140px", mr: 1 }}
                                    type="date"
                                    value={currentRange.max.split("T")[0]}
                                    onChange={(e) => handleDateTimeChange(e.target.value, false, true)}
                                />
                                <TextField
                                    sx={{ width: "140px" }}
                                    type="time"
                                    value={convertToLocal(currentRange.max)}
                                    onChange={(e) => handleDateTimeChange(e.target.value, false, false)}
                                />
                            </Grid>
                        </Grid>
                    </>
                )}
            </Grid>
        </MainCard>
    );
};

DateTimeRangeUI.propTypes = {
    columnData: PropTypes.array,
    item: PropTypes.object,
    ranges: PropTypes.object,
    onUpdateRange: PropTypes.func,
    // formData: PropTypes.array.isRequired,
    setFormData: PropTypes.func
};

export default React.memo(DateTimeRangeUI);
