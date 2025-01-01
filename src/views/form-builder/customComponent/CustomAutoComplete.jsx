import React from "react";
import { Autocomplete, TextField } from "@mui/material";
import PropTypes from "prop-types";
const CustomAutocomplete = ({ field, func, defaultValue, defauldValue, parquetDataTypesForFields }) => (
    <div style={{ gridColumn: `span ${field.space}` }}>
        <div>{field.description}</div>
        <Autocomplete
            multiple
            disableCloseOnSelect
            onChange={(e, value) => func([field.field_name, value], "multi-choices", field.merging)}
            options={field.values?.split(",")}
            defaultValue={(defaultValue && defaultValue[field.field_name]) || defauldValue}
            name={field.field_name}
            id={field.field_name}
            getOptionLabel={(option) => option}
            disabled={field.disabled === "true"}
            required={field.required === "true"}
            inputProps={{
                dtype: parquetDataTypesForFields[field.dtype]
            }}
            renderInput={(params) => <TextField {...params} />}
        />
    </div>
);

CustomAutocomplete.propTypes = {
    field: PropTypes.object,
    func: PropTypes.func,
    defaultValue: PropTypes.array,
    defauldValue: PropTypes.array,
    parquetDataTypesForFields: PropTypes.object
};
export default CustomAutocomplete;
