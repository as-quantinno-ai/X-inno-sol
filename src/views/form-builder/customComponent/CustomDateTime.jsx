import React from "react";
import moment from "moment";
import PropTypes from "prop-types";
const { TextField } = require("@mui/material");

const CustomDateTime = ({ field, func, date, setDate, time, setTime, defaultValue, excludeFirst11Digits, parquetDataTypesForFields }) => {
    const handleDateChange = (e) => {
        func(e, field.role, field.merging);
        setDate(e.target.value);
    };

    const handleTimeChange = (e) => {
        func(e, field.role, field.merging);
        setTime(e.target.value);
    };

    const formatTime = (isoTimeString) => moment(isoTimeString, "HH:mm:ss").format("HH:mm:ss");

    const formattedTime = formatTime(time);
    const formattedDefaultValue =
        defaultValue && defaultValue[field.field_name] ? excludeFirst11Digits(defaultValue[field.field_name]) : time;
    const formattedDefaultDateValue =
        defaultValue && defaultValue[field.field_name] ? excludeFirst11Digits(defaultValue[field.field_name]) : date;

    return (
        <div style={{ gridColumn: `span ${field.space}` }}>
            <div>{field.description}</div>
            {field.role === "date" && (
                <TextField
                    type="date"
                    name={field.field_name}
                    id={field.field_name}
                    placeholder={field.field_name.replace(/_/g, " ").toUpperCase()}
                    onChange={handleDateChange}
                    value={date}
                    defaultValue={formattedDefaultDateValue}
                    inputProps={{
                        dtype: parquetDataTypesForFields[field.dtype],
                        ...(field.merging && { merging: field.merging })
                    }}
                    fullWidth
                    disabled={field.disabled === "true"}
                    required={field.required === "true"}
                />
            )}
            {field.role === "time" && (
                <TextField
                    type="time"
                    name={field.field_name}
                    id={field.field_name}
                    placeholder={field.field_name.replace(/_/g, " ").toUpperCase()}
                    onChange={handleTimeChange}
                    value={(defaultValue && formattedTime) || time}
                    defaultValue={formattedDefaultValue}
                    inputProps={{
                        step: 1,
                        dtype: parquetDataTypesForFields[field.dtype],
                        ...(field.merging && { merging: field.merging })
                    }}
                    fullWidth
                    disabled={field.disabled === "true"}
                    required={field.required === "true"}
                />
            )}
        </div>
    );
};

CustomDateTime.propTypes = {
    field: PropTypes.object,
    func: PropTypes.func,
    date: PropTypes.string,
    setDate: PropTypes.func,
    time: PropTypes.string,
    setTime: PropTypes.func,
    defaultValue: PropTypes.object,
    excludeFirst11Digits: PropTypes.func,
    parquetDataTypesForFields: PropTypes.object
};
export default CustomDateTime;
