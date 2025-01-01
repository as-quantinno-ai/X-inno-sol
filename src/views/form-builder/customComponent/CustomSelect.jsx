import { MenuItem, Select } from "@mui/material";
import React, { useState } from "react";
import PropTypes from "prop-types";
const CustomSelect = ({ field, func, defaultValue, defauldValue, parquetDataTypesForFields }) => {
    const [selectedValue, setSelectedValue] = useState((defaultValue && defaultValue[field?.field_name]) || "");

    const handleChange = (e) => {
        setSelectedValue(e.target.value);
        func(e, field.role, field.merging);
    };

    return (
        <div style={{ gridColumn: `span ${field.space}` }}>
            <div>{field.description}</div>
            <Select
                name={field.field_name}
                id={field.field_name}
                placeholder={field.field_name.replace(/_/g, " ").toUpperCase()}
                onChange={handleChange}
                value={selectedValue}
                style={{ width: "100%", marginTop: "0px", padding: "0px" }}
                disabled={field.disabled === "true"}
                defaultValue={(defaultValue && defaultValue[field.field_name]) || defauldValue}
                required={field.required === "true"}
                inputProps={{
                    dtype: parquetDataTypesForFields[field.dtype],
                    ...(field.merging && { merging: field.merging })
                }}
            >
                <MenuItem value="">--------------------------</MenuItem>
                {field.values?.split(",").map((value) => (
                    <MenuItem key={value} value={value}>
                        {value}
                    </MenuItem>
                ))}
            </Select>
        </div>
    );
};

CustomSelect.propTypes = {
    field: PropTypes.object,
    func: PropTypes.func,
    defaultValue: PropTypes.object,
    defauldValue: PropTypes.string,
    parquetDataTypesForFields: PropTypes.object
};

export default CustomSelect;
